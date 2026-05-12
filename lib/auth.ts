import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Raio X Eleitoral",
      credentials: {
        email: { label: "E-mail", type: "email", placeholder: "vendedor@raioxeleitoral.com.br" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        console.log("--- Tentativa de Login ---");
        console.log("E-mail digitado:", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log("Erro: E-mail ou senha não fornecidos.");
          return null;
        }

        try {
          const user = await db.user.findUnique({
            where: { email: credentials.email.toLowerCase().trim() }
          });

          if (!user) {
            console.log("Erro: Usuário não encontrado no banco de dados.");
            return null;
          }

          if (user.password === credentials.password) {
            console.log("Sucesso: Login autorizado para", user.email);
            return {
              id: user.id,
              name: user.name,
              email: user.email,
            };
          }

          console.log("Erro: Senha incorreta para o usuário", user.email);
          return null;
        } catch (error: any) {
          console.error("ERRO CRÍTICO NO BANCO DE DADOS:", error.message);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.id = token.sub;
      }
      return session;
    }
  }
};
