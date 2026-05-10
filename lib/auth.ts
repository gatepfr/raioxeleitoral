import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Agência Iceberg",
      credentials: {
        email: { label: "E-mail", type: "email", placeholder: "vendedor@iceberg.com" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        // Simple static check for the agency
        // In production, this should check the database
        if (credentials?.email === "admin@iceberg.com" && credentials?.password === "admin123") {
          return {
            id: "1",
            name: "Vendedor Admin",
            email: "admin@iceberg.com",
          };
        }
        return null;
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
