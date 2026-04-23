<<<<<<< HEAD
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import getCollection, { USERS_COLLECTION } from "@/db";

// Narrow env vars from `string | undefined` to `string` so the GitHub
// provider config type-checks, and fail fast with a clear message if
// someone forgot to set them in .env.local.
const { AUTH_GITHUB_ID, AUTH_GITHUB_SECRET } = process.env;
if (!AUTH_GITHUB_ID || !AUTH_GITHUB_SECRET) {
    throw new Error(
        "Missing AUTH_GITHUB_ID or AUTH_GITHUB_SECRET in .env.local"
    );
}
=======
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import getCollection, {USERS_COLLECTION} from "@/db";

>>>>>>> b029b970f1ff04ade93d67053a1b3bc0ff47cb48

async function findEmail(email: string) {
    const users = await getCollection(USERS_COLLECTION);
    const exists = await users.findOne({ email });
    if (exists) {
        return true;
    }
    return false;
}

async function createUser(user: any) {
    const users = await getCollection(USERS_COLLECTION);

    return users.insertOne({
        name: user.name,
        email: user.email,
        hasProfile: false,
    });
}

// If user doesn't exist we add to database
export const { handlers, auth } = NextAuth({
    providers: [
        GitHub({
            clientId: AUTH_GITHUB_ID,
            clientSecret: AUTH_GITHUB_SECRET,
        }),
    ],
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
});