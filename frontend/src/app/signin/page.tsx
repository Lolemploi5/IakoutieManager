import type { Metadata } from "next";

import { SignInCard } from "@/components/auth/sign-in-card";

export const metadata: Metadata = {
  title: "Se connecter - Iakoutie Manager",
  description: "Se connecter avec Discord",
};

export default function SignInPage() {
  return <SignInCard />;
}