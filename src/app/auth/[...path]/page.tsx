"use client";

import "@neondatabase/auth-ui/css";
import { NeonAuthUIProvider, AuthView } from "@neondatabase/auth-ui";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { ptBRLocalization } from "@/lib/auth/localization";

export default function AuthPage() {
  const pathname = usePathname();
  
  // Extrai a view da URL (ex: "/auth/forgot-password" -> "forgot-password")
  const pathPart = pathname.split("/").pop();
  
  // Converte a string da URL para a key esperada pelo AuthView
  const viewMap: Record<string, string> = {
    "sign-in": "SIGN_IN",
    "sign-up": "SIGN_UP",
    "forgot-password": "FORGOT_PASSWORD",
    "reset-password": "RESET_PASSWORD",
    "email-otp": "EMAIL_OTP",
    "magic-link": "MAGIC_LINK",
    "email-verification": "EMAIL_VERIFICATION",
    "two-factor": "TWO_FACTOR",
  };
  
  const view = (viewMap[pathPart || ""] || "SIGN_IN") as any;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <NeonAuthUIProvider 
        authClient={authClient} 
        localization={ptBRLocalization}
        credentials={{ forgotPassword: true }}
      >
        <AuthView path={pathname} view={view} />
      </NeonAuthUIProvider>
    </div>
  );
}
