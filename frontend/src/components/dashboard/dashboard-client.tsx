"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

type SessionResponse = {
  authenticated: boolean;
  member_in_guild: boolean;
  has_required_role: boolean;
  username: string | null;
  avatar_url: string | null;
  roles: string[];
  guild_name: string | null;
  dashboard_url: string;
  discord_login_url: string;
  access_message: string | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export function DashboardClient() {
  const [session, setSession] = useState<SessionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
        });

        if (!response.ok) {
          if (active) {
            setSession(null);
            setError(null);
          }
          return;
        }

        const data = (await response.json()) as SessionResponse;
        if (active) {
          setSession(data);
        }
      } catch {
        if (active) {
          setError("Impossible de contacter le backend FastAPI.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadSession();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md border-white/10 bg-white/5 text-white shadow-2xl shadow-black/20 backdrop-blur">
          <CardHeader className="space-y-3 text-center">
            <Loader2 className="mx-auto size-8 animate-spin text-white/70" />
            <CardTitle className="text-2xl text-white">Chargement du dashboard</CardTitle>
            <CardDescription className="text-white/60">
              Vérification de la session Discord en cours.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Alert className="max-w-xl border-white/10 bg-white/5 text-white">
          <AlertCircle className="size-4" />
          <AlertTitle>Backend indisponible</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!session?.authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-xl border-white/10 bg-white/5 text-white shadow-2xl shadow-black/20 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Connexion requise</CardTitle>
            <CardDescription className="text-white/60">
              Tu dois te connecter avec Discord pour accéder au dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="rounded-full">
              <a href={`${API_URL}/auth/discord/login`}>Se connecter avec Discord</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session.member_in_guild || !session.has_required_role) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-xl border-white/10 bg-white/5 text-white shadow-2xl shadow-black/20 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Accès refusé</CardTitle>
            <CardDescription className="text-white/60">
              {session.access_message ?? "Tu dois faire partie du serveur Discord configuré pour accéder au dashboard."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-white/10 bg-white/5 text-white">
              <AlertCircle className="size-4" />
              <AlertTitle>Statut de la session</AlertTitle>
              <AlertDescription>
                {session.member_in_guild
                  ? "Le compte est connecté, mais les rôles autorisés ne sont pas présents."
                  : "Le compte connecté n’est pas membre du serveur Discord configuré."}
              </AlertDescription>
            </Alert>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Discord: {session.guild_name ?? "serveur inconnu"}</Badge>
              <Badge variant="outline" className="border-white/10 text-white/70">
                Rôles détectés: {session.roles.length}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar username={session.username} avatarUrl={session.avatar_url} />
        <SidebarInset className="bg-background/95">
          <main className="flex min-h-screen flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-2">
              <Badge className="w-fit">Connecté via Discord</Badge>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Dashboard Iakoutie Manager
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-white/60">
                L’utilisateur est validé par FastAPI, membre du serveur, et possède au moins un rôle autorisé.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: "Utilisateur", value: session.username ?? "Inconnu" },
                { label: "Serveur", value: session.guild_name ?? "Discord" },
                { label: "Rôles autorisés", value: `${session.roles.length}` },
              ].map((item) => (
                <Card key={item.label} className="border-white/10 bg-white/5 text-white shadow-lg shadow-black/10 backdrop-blur">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-white/50">{item.label}</CardDescription>
                    <CardTitle className="text-2xl text-white">{item.value}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <Card className="border-white/10 bg-white/5 text-white shadow-lg shadow-black/10 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-xl text-white">Zone principale</CardTitle>
                <CardDescription className="text-white/60">
                  Ici tu pourras brancher les futures vues métier du projet.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-white/70">
                <p>
                  Ce shell est prêt pour les pages de gestion, la surveillance et les modules internes.
                </p>
                <p>
                  La sidebar shadcn à gauche est déjà branchée et peut évoluer avec tes sections métier.
                </p>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}