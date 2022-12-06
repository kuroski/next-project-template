import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Role } from "@prisma/client";
import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { env } from "@/env/server.mjs";
import prisma from "@/lib/prisma";

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          role: user.role,
          id: user.id,
        },
      };
    },
  },
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
      role: Role;
    };
  }

  interface User {
    role: Role;
  }
}

export default authOptions;
