import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Technical from "@/components/sections/Technical";
import Work from "@/components/sections/Work";
import Philosophy from "@/components/sections/Philosophy";
import Presence from "@/components/sections/Presence";
import Support from "@/components/sections/Support";
import Contact from "@/components/sections/Contact";
export const dynamic = 'force-dynamic';
import { db } from "@/lib/db";
import {
    heroContent, aboutContent, projects, siteSettings,
    philosophyContent, technicalSkills, presenceLinks, supportItems
} from "@/lib/db/schema";

// Convert nulls from Drizzle to undefined so optional props match
function nn<T extends object>(obj: T | undefined): { [K in keyof T]: Exclude<T[K], null> } | undefined {
    if (!obj) return undefined;
    return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, v === null ? undefined : v])
    ) as any;
}

export default async function Home() {
    let heroData, aboutData, projectsData, settingsData, philosophyData, techData, presenceData, supportData;

    try {
        [
            heroData, aboutData, projectsData, settingsData,
            philosophyData, techData, presenceData, supportData
        ] = await Promise.all([
            db.select().from(heroContent).limit(1).then(r => r[0]),
            db.select().from(aboutContent).limit(1).then(r => r[0]),
            db.select().from(projects),
            db.select().from(siteSettings).limit(1).then(r => r[0]),
            db.select().from(philosophyContent).limit(1).then(r => r[0]),
            db.select().from(technicalSkills).orderBy(technicalSkills.order),
            db.select().from(presenceLinks).orderBy(presenceLinks.order),
            db.select().from(supportItems)
        ]);
    } catch (error) {
        console.warn("DB fetch failed, using component defaults:", error);
    }

    return (
        <>
            <Hero data={nn(heroData)} />
            <Philosophy data={nn(philosophyData)} />
            <About data={nn(aboutData)} />
            <Technical data={techData as any} />
            <Work data={projectsData as any} />
            <Presence data={presenceData as any} />
            <Support data={supportData as any} />
            <Contact data={nn(settingsData)} />
        </>
    );
}
