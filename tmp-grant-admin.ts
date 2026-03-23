import { db } from './lib/db';
import { portfolioUsers } from './lib/db/schema';
import { eq } from 'drizzle-orm';

async function grantAdmin() {
    console.log("Updating user role to admin...");
    try {
        const res = await db.update(portfolioUsers)
            .set({ role: 'admin' })
            .where(eq(portfolioUsers.email, 'dhananjayasurankumara@gmail.com'));
        console.log("Update successful:", res);
    } catch (err) {
        console.error("Update failed:", err);
    }
    process.exit(0);
}

grantAdmin();
