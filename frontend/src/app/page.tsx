import { ArrowRight, Server, ShieldCheck, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(0_0%_100%/0.08),transparent_30%),radial-gradient(circle_at_bottom_right,hsl(0_0%_100%/0.05),transparent_24%)]" />
      <div className="relative z-10 w-full max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-black/20 backdrop-blur">
              <Sparkles className="size-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/70">Iakoutie Manager</p>
              <p className="text-xs text-white/45">Frontend Next.js · Backend FastAPI</p>
            </div>
          </div>
          <Badge variant="outline" className="border-white/10 bg-white/5 text-white/70">
            Shadcn UI only
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <section className="space-y-6">
            <Badge className="w-fit bg-white text-black hover:bg-white/90">Accès Discord sécurisé</Badge>
            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
                Connecte-toi avec Discord pour ouvrir le dashboard Iakoutie Manager.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
                Le backend vérifie automatiquement que l’utilisateur est bien dans le serveur Discord ciblé et qu’il possède les rôles autorisés avant d’afficher le dashboard.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-11 rounded-full px-5">
                <a href={`${API_URL}/auth/discord/login`}>
                  Se connecter avec Discord
                  <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11 rounded-full border-white/10 bg-white/5 px-5 text-white hover:bg-white/10">
                <a href={`${API_URL}/health`}>Vérifier le backend</a>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  icon: ShieldCheck,
                  title: "Vérification serveur",
                  text: "Accès réservé aux membres du Discord configuré.",
                },
                {
                  icon: Server,
                  title: "Contrôle des rôles",
                  text: "Le backend filtre les rôles autorisés avant l’accès.",
                },
                {
                  icon: Sparkles,
                  title: "UI shadcn",
                  text: "Interface sombre, propre et cohérente avec shadcn.",
                },
              ].map((feature) => (
                <Card key={feature.title} className="border-white/10 bg-white/5 text-white shadow-xl shadow-black/10 backdrop-blur">
                  <CardHeader className="space-y-2">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-white/10">
                      <feature.icon className="size-4" />
                    </div>
                    <CardTitle className="text-base text-white">{feature.title}</CardTitle>
                    <CardDescription className="text-white/60">{feature.text}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>

          <Card className="border-white/10 bg-card/90 text-card-foreground shadow-2xl shadow-black/30 backdrop-blur">
            <CardHeader className="space-y-3">
              <Badge variant="secondary" className="w-fit">
                Étape 1
              </Badge>
              <CardTitle className="text-2xl">Connexion Discord</CardTitle>
              <CardDescription>
                Après authentification, le backend confirme l’appartenance au serveur et les rôles requis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                <p className="text-sm font-medium">Ce que fait le flux</p>
                <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                  <p>1. Discord authentifie l’utilisateur.</p>
                  <p>2. FastAPI vérifie le serveur ciblé et les rôles autorisés.</p>
                  <p>3. L’utilisateur est redirigé vers le dashboard ou bloqué avec un message clair.</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Configuration attendue côté backend :</p>
                <p>DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_GUILD_ID, DISCORD_REQUIRED_ROLE_IDS.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
