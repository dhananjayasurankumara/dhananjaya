import { db } from './lib/db';
import { users } from './lib/db/schema';

async function checkUsers() {
    const allUsers = await db.select().from(users);
    console.log(JSON.stringify(allUsers, null, 2));
    process.exit(0);
}

checkUsers();
