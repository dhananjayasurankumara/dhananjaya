import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Technical from "@/components/sections/Technical";
import Work from "@/components/sections/Work";
import Philosophy from "@/components/sections/Philosophy";
import Presence from "@/components/sections/Presence";
import Support from "@/components/sections/Support";
import Contact from "@/components/sections/Contact";
import { db } from "@/lib/db";
import { heroContent, aboutContent, projects, siteSettings } from "@/lib/db/schema";

// Convert nulls from Drizzle to undefined so optional props match
function nn<T extends object>(obj: T | undefined): { [K in keyof T]: Exclude<T[K], null> } | undefined {
    if (!obj) return undefined;
    return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, v === null ? undefined : v])
    ) as any;
}

export default async function Home() {
    let heroData, aboutData, projectsData, settingsData;

    try {
        [heroData, aboutData, projectsData, settingsData] = await Promise.all([
            db.select().from(heroContent).limit(1).then(r => r[0]),
            db.select().from(aboutContent).limit(1).then(r => r[0]),
            db.select().from(projects),
            db.select().from(siteSettings).limit(1).then(r => r[0]),
        ]);
    } catch (error) {
        console.warn("DB fetch failed, using component defaults:", error);
    }

    return (
        <>
            <Hero data={nn(heroData)} />
            <Philosophy />
            <About data={nn(aboutData)} />
            <Technical />
            <Work data={projectsData as any} />
            <Presence />
            <Support />
            <Contact data={nn(settingsData)} />
        </>
    );
}
