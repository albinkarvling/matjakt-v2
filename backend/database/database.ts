import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
}

export const database = new Pool({
    connectionString,
    max: 5,
});

database.on("error", (error) => {
    console.error("Unexpected PostgreSQL connection error", error);
});
