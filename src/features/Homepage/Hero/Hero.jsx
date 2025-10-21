import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "@assets/logo_only.png";
import "@styles/index.css"

export default function Hero() {
    const navigate = useNavigate();

    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,255,0.1),transparent_50%)]" />
 
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="flex justify-center items-center w-60 h-60 md:w-50 md:h-50">
              <img 
                src={logo} 
                alt="Logo" 
                className="w-[200%] h-[200%] object-cover animate-pulse"
                style={{ filter: "drop-shadow(var(--glow-primary))" }}
              />
            </div>
          </div>

          {/* Badge */}
          <div className="mb-6 inline-flex items-center glow-primary pointer-events-none text-[var(--brand-cyan)] gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">AI-Powered Automation</span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text slide-in-from-bottom-4 duration-500">
             <span className='font-semibold text-brand-cyan '>Par</span>se with <span className='font-light'>In</span><span className='font-semibold text-brand-purple-light'>sight</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            Build powerful workflows that connect your favorite tools and automate repetitive tasks. 
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            <button className="flex items-center font-bold text-xl md:text-2xl justify-center button-gradient hover:button-gradient-glow rounded-2xl p-5" onClick={() => {navigate("/signup")}}>
              Start Automating
              <ArrowRight className="ml-2 h-10 w-10 group-hover:translate-x-1 transition-transform" />
            </button>
            {/* <Button variant="outline" size="lg">
              Watch Demo
            </Button> */}
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">X</div>
              <div className="text-sm text-muted-foreground">Integrations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">Y</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">Z</div>
              <div className="text-sm text-muted-foreground">Tasks Automated</div>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>
    );
}
