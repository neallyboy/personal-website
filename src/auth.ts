import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    signIn({ profile }) {
      const authorized = process.env.AUTHORIZED_GITHUB_USERNAME;
      if (!authorized) {
        console.error("AUTHORIZED_GITHUB_USERNAME environment variable is not set");
        return false;
      }
      // Only allow the single authorized GitHub account
      return (profile as { login?: string })?.login === authorized;
    },
  },
});
