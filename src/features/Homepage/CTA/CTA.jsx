import { Button } from "../ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTA() {
  return (
    <section className="flex items-center justify-center min-h-screen py-24 px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-hero]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,255,0.15),transparent_50%)]" />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Start Free Today</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to Automate Your Workflow?
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join over 1 million users who trust us to automate their daily tasks. 
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="hero" size="lg" className="group">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            {/* <Button variant="outline" size="lg">
              Talk to Sales
            </Button> */}
          </div>

        </div>
      </div>
    </section>
  );
}
