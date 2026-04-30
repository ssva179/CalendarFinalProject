//Job - Stephanie: Database
// I initialized the database from how we previously did it in the mini projects.
//We decided to create a database so that we could properly store events and users.
import {Collection, Db, MongoClient} from "mongodb";
export const EVENTS_COLLECTION = "events-collection";   // for widget invite 
export const INVITES_COLLECTION = "invites-collection"; //for widget invite 

const MONGO_URI = process.env.MONGO_URI as string;

if(!MONGO_URI){
    throw new Error("Something is wrong with your key");
}

const DB_NAME = "cs-391-Calendar-project";

export const USERS_COLLECTION = "users-collection";

let client: MongoClient | null=null;
let db: Db | null=null;

async function connect(): Promise<Db> {
    // If `client` is not yet initialized, create a new MongoClient instance
    // and connect to MongoDB using the provided URI.
    if (!client) {
        client = new MongoClient(MONGO_URI);
        await client.connect();
    }
    // Return the database instance for the specified database name.
    return client.db(DB_NAME);
}


export default async function getCollection(collectionName: string): Promise<Collection> {
    // If `db` is not yet initialized, call `connect` to establish the connection.
    if (!db) {
        db = await connect();
    }
    // Return the requested collection from the database.
    return db.collection(collectionName);
}