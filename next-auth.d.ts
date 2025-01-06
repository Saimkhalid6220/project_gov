import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add custom fields here
      name: string;
      email: string;
      role?: boolean; // Example of an optional custom field
    };
  }
}
