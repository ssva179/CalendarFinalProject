//Job - Stephanie: Standard OAuth.js/GitHub authentication from lecture + adding db logic to store
// "old" users, so in the future they are not prompted to create profile again.
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

//making sure our email values are unique per user
async function findEmail(email: string) {
    const users = await getCollection(USERS_COLLECTION);
    const exists = await users.findOne({ email });
    if (exists) {
        return true;
    }return false;
}

//We create user if valid email
async function createUser(user: any) {
    const users = await getCollection(USERS_COLLECTION);
    return users.insertOne({
        name: user.name,
        email: user.email,
        hasProfile: false,
    });
}


// If user doesn't exist we add to database standard authjs implementation:
//https://authjs.dev/guides/configuring-github
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
