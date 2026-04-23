import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import getCollection, {USERS_COLLECTION} from "@/db";




async function findEmail(email: string) {
    const users = await getCollection(USERS_COLLECTION)
    const exists = await users.findOne({email});
    if (exists) {
        return true;
    }return false;
}
async function createUser(user: any) {
    const users = await getCollection(USERS_COLLECTION)

    return users.insertOne({
        name: user.name,
        email: user.email,
        hasProfile: false,
    })
}
//If user doesn't exist we add to database
export const { handlers, auth } = NextAuth({
    providers: [GitHub],
    events:{async signIn({user}) {
            if (!user.email){
                return
            }
            const exists = await findEmail(user.email)
            if (!exists) {await createUser(user)}
        }
    }

})

