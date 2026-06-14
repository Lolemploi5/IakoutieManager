from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Any
from urllib.parse import urlencode

import httpx
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from itsdangerous import BadSignature, URLSafeSerializer
from dotenv import load_dotenv


load_dotenv()


@dataclass(frozen=True)
class Settings:
    discord_client_id: str = os.getenv("DISCORD_CLIENT_ID", "")
    discord_client_secret: str = os.getenv("DISCORD_CLIENT_SECRET", "")
    discord_redirect_uri: str = os.getenv(
        "DISCORD_REDIRECT_URI", "http://localhost:8000/auth/discord/callback"
    )
    discord_guild_id: str = os.getenv("DISCORD_GUILD_ID", "")
    required_role_ids: tuple[str, ...] = tuple(
        role_id.strip()
        for role_id in os.getenv("DISCORD_REQUIRED_ROLE_IDS", "").split(",")
        if role_id.strip()
    )
    frontend_url: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    session_secret: str = os.getenv("SESSION_SECRET", "change-me-in-production")
    discord_bot_token: str = os.getenv("DISCORD_BOT_TOKEN", "")


settings = Settings()
serializer = URLSafeSerializer(settings.session_secret, salt="iakoutie-manager-session")
state_serializer = URLSafeSerializer(settings.session_secret, salt="iakoutie-manager-state")

app = FastAPI(title="Iakoutie Manager API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/auth/discord/login")
def discord_login(next: str = "/dashboard") -> Response:
    if not settings.discord_client_id:
        raise HTTPException(status_code=500, detail="DISCORD_CLIENT_ID manquant")

    state = state_serializer.dumps({"next": next})
    params = {
        "client_id": settings.discord_client_id,
        "redirect_uri": settings.discord_redirect_uri,
        "response_type": "code",
        "scope": "identify",
        "state": state,
        "prompt": "consent",
    }
    return RedirectResponse(
        url=f"https://discord.com/api/oauth2/authorize?{urlencode(params)}",
        status_code=302,
    )


@app.get("/auth/discord/callback")
async def discord_callback(code: str, state: str) -> Response:
    if not settings.discord_client_id or not settings.discord_client_secret:
        raise HTTPException(status_code=500, detail="Configuration Discord incomplète")

    try:
        state_payload = state_serializer.loads(state)
    except BadSignature as exc:
        raise HTTPException(status_code=400, detail="State OAuth invalide") from exc

    async with httpx.AsyncClient(timeout=20) as client:
        token_response = await client.post(
            "https://discord.com/api/oauth2/token",
            data={
                "client_id": settings.discord_client_id,
                "client_secret": settings.discord_client_secret,
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": settings.discord_redirect_uri,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        token_response.raise_for_status()
        token_data = token_response.json()

        access_token = token_data["access_token"]
        user_response = await client.get(
            "https://discord.com/api/users/@me",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        user_response.raise_for_status()
        user_data = user_response.json()

        member_data = await fetch_guild_member(client, user_data["id"])
        session_data = build_session(user_data, member_data)

    response = RedirectResponse(
        url=f"{settings.frontend_url}{state_payload.get('next', '/dashboard')}",
        status_code=302,
    )
    response.set_cookie(
        key="iakoutie_session",
        value=serializer.dumps(session_data),
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 60 * 24 * 7,
        path="/",
    )
    return response


@app.get("/auth/me")
def auth_me(request: Request) -> dict[str, Any]:
    raw_session = request.cookies.get("iakoutie_session")
    if not raw_session:
        raise HTTPException(status_code=401, detail="Non authentifié")

    try:
        return serializer.loads(raw_session)
    except BadSignature as exc:
        raise HTTPException(status_code=401, detail="Session invalide") from exc


async def fetch_guild_member(client: httpx.AsyncClient, user_id: str) -> dict[str, Any] | None:
    if not settings.discord_guild_id or not settings.discord_bot_token:
        return None

    response = await client.get(
        f"https://discord.com/api/guilds/{settings.discord_guild_id}/members/{user_id}",
        headers={"Authorization": f"Bot {settings.discord_bot_token}"},
    )
    if response.status_code == 404:
        return None
    response.raise_for_status()
    return response.json()


def build_session(user_data: dict[str, Any], member_data: dict[str, Any] | None) -> dict[str, Any]:
    roles = member_data.get("roles", []) if member_data else []
    member_in_guild = member_data is not None
    has_required_role = bool(
        settings.required_role_ids and any(role_id in roles for role_id in settings.required_role_ids)
    ) or not settings.required_role_ids

    access_message: str | None
    if not member_in_guild:
        access_message = "Tu dois faire partie du serveur Discord configuré pour accéder au dashboard."
    elif not has_required_role:
        access_message = "Tu es bien sur le serveur, mais tu n’as pas le rôle requis."
    else:
        access_message = None

    avatar_hash = user_data.get("avatar")
    avatar_url = (
        f"https://cdn.discordapp.com/avatars/{user_data['id']}/{avatar_hash}.png?size=128"
        if avatar_hash
        else None
    )

    return {
        "authenticated": True,
        "user_id": user_data["id"],
        "username": user_data.get("global_name") or user_data.get("username"),
        "avatar_url": avatar_url,
        "member_in_guild": member_in_guild,
        "has_required_role": has_required_role,
        "roles": roles,
        "guild_name": settings.discord_guild_id or None,
        "access_message": access_message,
        "dashboard_url": f"{settings.frontend_url}/dashboard",
        "discord_login_url": f"{settings.frontend_url}/",
    }