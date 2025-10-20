import { Database, Mail, MessageSquare, Calendar, FileText, ShoppingCart, Share2, Cloud } from "lucide-react";

const integrations = [
  { icon: Database, name: "Databases", color: "text-blue-400" },
  { icon: Mail, name: "Email", color: "text-red-400" },
  { icon: MessageSquare, name: "Messaging", color: "text-green-400" },
  { icon: Calendar, name: "Calendar", color: "text-purple-400" },
  { icon: FileText, name: "Documents", color: "text-yellow-400" },
  { icon: ShoppingCart, name: "E-commerce", color: "text-pink-400" },
  { icon: Share2, name: "Social Media", color: "text-cyan-400" },
  { icon: Cloud, name: "Cloud Storage", color: "text-indigo-400" },
];

export default function Integrations() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(0,212,255,0.05),transparent_50%)]" />
      
      <div className="container mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Connect Everything
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Integrate with your favorite tools and services seamlessly
          </p>
        </div>

        {/* Integration cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {integrations.map((integration, index) => (
            <div
              key={index}
              className="group relative bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,212,255,0.15)] hover:-translate-y-1"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Icon */}
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-all group-hover:scale-110 duration-300">
                  <integration.icon className={`w-8 h-8 ${integration.color}`} />
                </div>
              </div>

              {/* Name */}
              <h3 className="text-center font-semibold">{integration.name}</h3>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            And <span className="text-primary font-semibold">5000+</span> more integrations available
          </p>
        </div>
      </div>
    </section>
  );
}
