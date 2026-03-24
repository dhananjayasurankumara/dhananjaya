import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Technical from "@/components/sections/Technical";
import Work from "@/components/sections/Work";
import Philosophy from "@/components/sections/Philosophy";
import Presence from "@/components/sections/Presence";
import Support from "@/components/sections/Support";
import Reviews from "@/components/sections/Reviews";
import Contact from "@/components/sections/Contact";
export const dynamic = 'force-dynamic';
import { db } from "@/lib/db";
import {
    heroContent, aboutContent, projects, siteSettings,
    philosophyContent, technicalSkills, presenceLinks, supportItems,
    backgroundImages
} from "@/lib/db/schema";

// Convert nulls from Drizzle to undefined so optional props match
function nn<T extends object>(obj: T | undefined): { [K in keyof T]: Exclude<T[K], null> } | undefined {
    if (!obj) return undefined;
    return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, v === null ? undefined : v])
    ) as any;
}

export default async function Home() {
    let heroData, aboutData, projectsData, settingsData, philosophyData, techData, presenceData, supportData, bgImages: any[] = [];

    try {
        const results = await Promise.all([
            db.select().from(heroContent).limit(1).then(r => r[0]),
            db.select().from(aboutContent).limit(1).then(r => r[0]),
            db.select().from(projects),
            db.select().from(siteSettings).limit(1).then(r => r[0]),
            db.select().from(philosophyContent).limit(1).then(r => r[0]),
            db.select().from(technicalSkills).orderBy(technicalSkills.order),
            db.select().from(presenceLinks).orderBy(presenceLinks.order),
            db.select().from(supportItems),
            db.select().from(backgroundImages)
        ]);
        heroData = results[0];
        aboutData = results[1];
        projectsData = results[2];
        settingsData = results[3];
        philosophyData = results[4];
        techData = results[5];
        presenceData = results[6];
        supportData = results[7];
        bgImages = results[8];
    } catch (error) {
        console.warn("DB fetch failed, using component defaults:", error);
    }

    const getBg = (section: string) => bgImages.find(img => img.section === section);

    return (
        <>
            <Hero data={nn(heroData)} bg={getBg('hero')} />
            <Philosophy data={nn(philosophyData)} bg={getBg('philosophy')} />
            <About data={nn(aboutData)} bg={getBg('about')} />
            <Technical data={techData as any} bg={getBg('skills')} />
            <Work data={projectsData as any} bg={getBg('work')} />
            <Presence data={presenceData as any} bg={getBg('presence')} />
            <Support data={supportData as any} bg={getBg('support')} />
            <Reviews />
            <Contact data={nn(settingsData)} bg={getBg('contact')} />
        </>
    );
}
