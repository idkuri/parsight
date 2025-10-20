import { Workflow, Lock, Gauge, Users, Globe, Code } from "lucide-react";

const features = [
  {
    icon: Workflow,
    title: "Visual Workflow Builder",
    description: "Design complex automations with our intuitive drag-and-drop interface",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "Bank-level encryption and compliance with SOC 2, GDPR, and HIPAA",
  },
  {
    icon: Gauge,
    title: "Lightning Fast",
    description: "Execute workflows in milliseconds with our optimized infrastructure",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share workflows and collaborate with your team in real-time",
  },
  {
    icon: Globe,
    title: "5000+ Integrations",
    description: "Connect with virtually any app or service in your tech stack",
  },
  {
    icon: Code,
    title: "Custom Code",
    description: "Extend capabilities with JavaScript, Python, or webhooks",
  },
];

export default function Features() {
  return (
    <section className="min-h-screen py-24 px-4 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="container mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything You Need to Automate
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features that make automation accessible to everyone
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,212,255,0.15)]"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
              
              <div className="relative">
                {/* Icon */}
                <div className="mb-4 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors group-hover:scale-110 duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
