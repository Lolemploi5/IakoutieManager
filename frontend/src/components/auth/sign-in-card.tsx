"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export function SignInCard() {
  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
        });

        if (response.ok && active) {
          window.location.href = "/dashboard";
        }
      } catch {
        // Aucun état de session, on laisse afficher la page.
      }
    }

    void checkSession();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070707] px-4 py-10">
      <div className="w-full max-w-160">
        <Item
          variant="outline"
          size="default"
          className="rounded-[18px] border-white/10 bg-[#1b1b1b] px-10 py-12 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]"
        >
          <ItemHeader>
            <ItemContent className="space-y-4">
              <ItemTitle className="text-[2.1rem] font-semibold tracking-[-0.045em] text-white">
                Se connecter
              </ItemTitle>
              <ItemDescription className="max-w-125 text-[1.05rem] leading-7 text-zinc-400">
                Connecte-toi avec ton compte Discord pour accéder à Iakoutie Manager.
              </ItemDescription>
            </ItemContent>
          </ItemHeader>

          <ItemActions className="pt-10">
            <form action={`${API_URL}/auth/discord/login`} method="GET" className="w-full">
              <Button
                type="submit"
                variant="default"
                size="lg"
                className="h-12 w-full rounded-xl bg-[#5865F2] px-6 text-[0.98rem] font-semibold text-white shadow-none hover:bg-[#4752C4]"
              >
                Continuer avec Discord
              </Button>
            </form>
          </ItemActions>

          <ItemFooter className="pt-8 text-center text-[0.95rem] text-zinc-500">
            En cliquant sur continuer, tu acceptes nos conditions d'utilisation.
          </ItemFooter>
        </Item>
      </div>
    </div>
  );
}