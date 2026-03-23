'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import gsap from 'gsap';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Welcome to my digital space. I'm Dananjaya's assistant. Ask me anything about his work, skills, or philosophy.",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initial message state for reset
    const initialMessages: Message[] = [
        {
            id: '1',
            text: "Welcome to my digital space. I'm Dananjaya's assistant. Ask me anything about his work, skills, or philosophy.",
            sender: 'bot',
            timestamp: new Date()
        }
    ];

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    // Reset bot state when closed
    useEffect(() => {
        if (!isOpen) {
            const timer = setTimeout(() => {
                setMessages(initialMessages);
                setInputValue('');
                setIsTyping(false);
            }, 500); // Wait for exit animation to complete
            return () => clearTimeout(timer);
        } else {
            // Focus input when opened
            setTimeout(() => {
                inputRef.current?.focus();
            }, 600);
        }
    }, [isOpen]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: inputValue })
            });

            const data = await response.json();

            // Artificial delay for feel
            setTimeout(() => {
                const botMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: data.response || "I couldn't process that. Can you try again?",
                    sender: 'bot',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botMessage]);
                setIsTyping(false);

                // Handle commands like "scroll to contact"
                if (data.response.toLowerCase().includes('scroll') && data.response.toLowerCase().includes('contact')) {
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }, 1000);
        } catch (error) {
            console.error('Chat Error:', error);
            setIsTyping(false);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 10002 }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="chat-window-wrapper"
                        initial={{ opacity: 0, x: 40, y: 0, scale: 0.95, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, x: 40, y: 0, scale: 0.95, filter: 'blur(10px)' }}
                        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                        style={{
                            position: 'relative',
                            width: 'min(90vw, 400px)',
                            height: 'min(70vh, 600px)',
                            background: 'rgba(5, 5, 5, 0.9)',
                            backdropFilter: 'blur(40px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.02)',
                            marginBottom: '1.5rem'
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '1.5rem',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'rgba(255, 255, 255, 0.02)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    background: '#00FF88',
                                    boxShadow: '0 0 10px #00FF88'
                                }} />
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.2em',
                                    opacity: 0.8
                                }}>
                                    Digital Assistant
                                </span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                style={{ background: 'none', border: 'none', color: 'var(--soft-grey)', cursor: 'pointer', padding: '0.5rem' }}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={scrollRef}
                            style={{
                                flex: 1,
                                overflowY: 'auto',
                                padding: '1.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.5rem',
                                scrollbarWidth: 'none'
                            }}
                        >
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    style={{
                                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                        maxWidth: '85%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                                    }}
                                >
                                    <div style={{
                                        padding: '1rem 1.25rem',
                                        background: msg.sender === 'user' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                                        border: '1px solid rgba(255, 255, 255, 0.05)',
                                        borderRadius: msg.sender === 'user' ? '1.2rem 1.2rem 0.2rem 1.2rem' : '0.2rem 1.2rem 1.2rem 1.2rem',
                                        fontSize: '0.9rem',
                                        lineHeight: 1.6,
                                        color: msg.sender === 'user' ? 'var(--accent-white)' : 'var(--soft-grey)',
                                        position: 'relative'
                                    }}>
                                        {msg.text}
                                    </div>
                                    <span style={{ fontSize: '0.6rem', opacity: 0.3, marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '4px', padding: '0.5rem' }}>
                                    {[0, 1, 2].map(i => (
                                        <motion.div
                                            key={i}
                                            animate={{ opacity: [0.2, 1, 0.2] }}
                                            transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                                            style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--soft-grey)' }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <div style={{
                                display: 'flex',
                                gap: '0.75rem',
                                background: 'rgba(255, 255, 255, 0.03)',
                                padding: '0.5rem 0.5rem 0.5rem 1.25rem',
                                borderRadius: '2rem',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                alignItems: 'center',
                                cursor: 'text'
                            }}
                                onClick={() => inputRef.current?.focus()}
                            >
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Type your message..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    style={{
                                        flex: 1,
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--accent-white)',
                                        fontSize: '0.85rem',
                                        outline: 'none',
                                        padding: '0.5rem 0',
                                        cursor: 'text'
                                    }}
                                />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSendMessage();
                                    }}
                                    style={{
                                        width: '34px',
                                        height: '34px',
                                        borderRadius: '50%',
                                        background: 'rgba(255, 255, 255, 0.08)',
                                        border: 'none',
                                        color: 'var(--accent-white)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.div
                initial={{ opacity: 0, y: 30, x: 30 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.8, delay: 1, ease: [0.19, 1, 0.22, 1] }}
            >
                <motion.button
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9, rotate: -5 }}
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'var(--graphite)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'var(--accent-white)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 0 10px rgba(255,255,255,0.05)',
                        transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={isOpen ? 'open' : 'closed'}
                            initial={{ opacity: 0, x: 20, rotate: -90 }}
                            animate={{ opacity: 1, x: 0, rotate: 0 }}
                            exit={{ opacity: 0, x: -20, rotate: 90 }}
                            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
                        </motion.div>
                    </AnimatePresence>
                </motion.button>
            </motion.div>
        </div>
    );
}
