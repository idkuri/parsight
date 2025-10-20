import { Zap, Link2, Play, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Link2,
    title: "Connect Your Apps",
    description: "Choose from 5000+ integrated apps and services to connect your workflow",
  },
  {
    icon: Zap,
    title: "Set Up Triggers",
    description: "Define when your automation should run with powerful trigger conditions",
  },
  {
    icon: Play,
    title: "Configure Actions",
    description: "Decide what happens next with customizable action sequences",
  },
  {
    icon: CheckCircle,
    title: "Automate & Relax",
    description: "Let your workflows run automatically while you focus on what matters",
  },
];

export default function HowItWorks() {
  return (
    <section className="flex items-center justify-center min-h-screen py-24 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,212,255,0.05),transparent_50%)]" />
      
      <div className="container mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Build powerful automations in minutes with our intuitive workflow builder
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -z-10" />
              )}
              
              {/* Card */}
              <div className="relative bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,212,255,0.2)] h-full">
                {/* Number badge */}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-900 text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-[var(--glow-primary)]">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="mb-4 w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
