import NextAuth, { getServerSession, type NextAuthOptions } from "next-auth";
import GitHub from "next-auth/providers/github";

import getCollection, { USERS_COLLECTION } from "@/db";

async function findEmail(email: string) {
    const users = await getCollection(USERS_COLLECTION);
    const exists = await users.findOne({ email });
    return Boolean(exists);
}

async function createUser(user: { name?: string | null; email?: string | null }) {
    const users = await getCollection(USERS_COLLECTION);

    return users.insertOne({
        name: user.name ?? "",
        email: user.email,
        hasProfile: false,
    });
}

export const authOptions: NextAuthOptions = {
    providers: [
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID ?? process.env.GITHUB_ID ?? "",
            clientSecret: process.env.AUTH_GITHUB_SECRET ?? process.env.GITHUB_SECRET ?? "",
        }),
    ],
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
    events: {
        async signIn({ user }) {
            if (!user.email) {
                return;
            }

            const exists = await findEmail(user.email);
            if (!exists) {
                await createUser(user);
            }
        },
    },
};

const handler = NextAuth(authOptions);

export const handlers = { GET: handler, POST: handler };

export function auth() {
    return getServerSession(authOptions);
}
