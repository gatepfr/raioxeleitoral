"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Lock } from "lucide-react";

import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Credenciais inválidas. Tente novamente.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      setError("Ocorreu um erro ao entrar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50/50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-64 h-32 relative">
            <Image 
              src="/raioxeleitoral.png" 
              alt="Raio X Eleitoral" 
              fill 
              className="object-contain" 
              priority 
            />
          </div>
          <p className="text-muted-foreground font-medium">Munição Comercial de Elite</p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>
              Entre com suas credenciais da agência.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase text-zinc-500">E-mail</label>
                <Input
                  type="email"
                  placeholder="vendedor@raioxeleitoral.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase text-zinc-500">Senha</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-red-500 font-semibold bg-red-50 p-2 rounded border border-red-100">
                  {error}
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar no Sistema"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="flex items-center justify-center gap-2 text-zinc-400 text-sm font-medium">
          <Lock className="h-3 w-3" />
          Sistema Protegido
        </div>
      </div>
    </div>
  );
}
