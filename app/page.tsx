import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Technical from "@/components/sections/Technical";
import Work from "@/components/sections/Work";
import Philosophy from "@/components/sections/Philosophy";
import Presence from "@/components/sections/Presence";
import Support from "@/components/sections/Support";
import Contact from "@/components/sections/Contact";
import { client } from "@/sanity/lib/client";
import { heroQuery, aboutQuery, projectsQuery, siteSettingsQuery } from "@/sanity/lib/queries";

export default async function Home() {
    let heroData, aboutData, projectsData, settingsData;

    try {
        [heroData, aboutData, projectsData, settingsData] = await Promise.all([
            client.fetch(heroQuery),
            client.fetch(aboutQuery),
            client.fetch(projectsQuery),
            client.fetch(siteSettingsQuery),
        ]);
    } catch (error) {
        console.warn("Sanity fetch failed, using fallbacks:", error);
    }

    return (
        <>
            <Hero data={heroData} />
            <Philosophy />
            <About data={aboutData} />
            <Technical />
            <Work data={projectsData} />
            <Presence />
            <Support />
            <Contact data={settingsData} />
        </>
    );
}
