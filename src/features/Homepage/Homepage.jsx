import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from "@contexts/AuthContext"
import { useNavigate } from 'react-router-dom';
import Hero from "./Hero"
import HowItWorks from "./HowItWorks"
import Features from "./Features"
import Integrations from "./Integrations"
import CTA from "./CTA"
import Footer from "./Footer"

// Scroll Reveal Component
const ScrollReveal = ({ children, delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ease-out ${
                isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-20'
            }`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

const Homepage = () => {
    const { userInfo } = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (userInfo) {
            navigate("/dashboard");
        }
    }, [userInfo])
    
    return (
        <main className="min-h-screen overflow-hidden w-full">
            <Hero />
            <ScrollReveal>
                <HowItWorks />
            </ScrollReveal>
            <ScrollReveal delay={100}>
                <Features />
            </ScrollReveal>
            <ScrollReveal delay={200}>
                <Integrations />
            </ScrollReveal>
            <ScrollReveal delay={300}>
                <CTA />
            </ScrollReveal>
                <Footer />
        </main>
    );
};

export default Homepage;