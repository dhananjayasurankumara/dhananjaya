import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const input = message.toLowerCase();
        let response = "";

        // Categories of knowledge
        const responses = {
            greetings: [
                "Greetings. I am Dananjaya's digital assistant. How can I help you explore his creative engineering today?",
                "Welcome. I'm here to guide you through Dananjaya's digital portfolio. What would you like to know?",
                "Hello! I am the digital soul of this portfolio. How can I assist you in discovering Dananjaya's work?"
            ],
            identity: [
                "Dananjaya is an architect of digital experiences with 5+ years of expertise. He merges aesthetic precision with technical mastery to build digital souls, not just pixels.",
                "Based on the intersection of design and code, Dananjaya is a creative developer and graphic designer who crafts high-fidelity digital products.",
                "He describes himself as a 'Digital Alchemist'—someone who transforms complex code into premium, cinematic visual stories."
            ],
            stack: [
                "His technical mastery includes React, Next.js, GSAP, Three.js, and architectural design. He operates at the intersection of aesthetic authority and technical precision.",
                "For development, he relies on a high-performance stack: Next.js for structure, GSAP for cinematic motion, and Three.js for immersive 3D experiences.",
                "His toolkit is curated for visual excellence, featuring Framer Motion, Vanilla CSS for maximum control, and PostgreSQL via Neon for robust data management."
            ],
            philosophy: [
                "His philosophy is 'Digital Alchemy'. He believes in architecture as the silence between the code, focusing on aesthetic authority and premium visual storytelling.",
                "He views digital creation as architectural design—every pixel must have a purpose, and every interaction must feel like a deliberate, premium experience.",
                "Digital Alchemy is the process of merging technical mastery with aesthetic precision to create something that feels alive and premium."
            ],
            work: [
                "Dananjaya focuses on high-fidelity digital experiences. You can find his featured works in the 'Work' section, ranging from architectural design to full-stack development.",
                "His portfolio showcases a variety of projects where design meets code. From minimalist web apps to complex 3D environments, aesthetic precision is the common thread.",
                "He specializes in premium digital products. You should definitely check out the 'Work' section to see his latest 'Digital Souls'."
            ],
            contact: [
                "You can reach him directly via the 'Contact' section below, or email him at dhananjayasurankumara@gmail.com. Would you like me to scroll there for you?",
                "Available for high-impact partnerships worldwide. Use the contact form at the bottom, or connect via LinkedIn and WhatsApp listed there.",
                "Let's create something extraordinary. You can find all his direct contact links—Gmail, WhatsApp, and LinkedIn—in the 'Contact' section."
            ],
            fallback: [
                "That's an interesting point. While I'm still learning, I can tell you about Dananjaya's works, his skills, or his philosophy. What would you like to know?",
                "I'm specifically trained on Dananjaya's portfolio data. I may not know about that yet, but I can guide you to his 'Work', 'About', or 'Contact' sections.",
                "I'm not quite sure about that. Try asking about his 'Design Philosophy', 'Technical Stack', or how to 'Contact' him."
            ]
        };

        const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

        // Enhanced Matching Logic
        if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
            response = getRandom(responses.greetings);
        } else if (input.includes('who') || input.includes('about') || input.includes('dananjaya') || input.includes('name')) {
            response = getRandom(responses.identity);
        } else if (input.includes('stack') || input.includes('tech') || input.includes('tool') || input.includes('skill') || input.includes('language')) {
            response = getRandom(responses.stack);
        } else if (input.includes('philosophy') || input.includes('design') || input.includes('alchemy') || input.includes('concept')) {
            response = getRandom(responses.philosophy);
        } else if (input.includes('work') || input.includes('project') || input.includes('portfolio') || input.includes('showcase')) {
            response = getRandom(responses.work);
        } else if (input.includes('contact') || input.includes('email') || input.includes('hire') || input.includes('talk') || input.includes('reach')) {
            response = getRandom(responses.contact);
        } else {
            response = getRandom(responses.fallback);
        }

        return NextResponse.json({ response });
    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
