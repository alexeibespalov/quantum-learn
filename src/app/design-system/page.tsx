import React from "react";

export default function DesignSystem() {
  return (
    <div className="min-h-screen bg-background p-8 text-foreground">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-primary">QuantumLearn Design System</h1>
          <p className="text-xl text-muted-foreground">Theme: "Wilderness Dark"</p>
          <p className="text-lg">A high-contrast, gamified dark theme designed for focus and engagement.</p>
        </div>

        {/* Color Palette */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold border-b border-border pb-2">1. Color Palette</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <ColorCard name="Primary (Teal)" token="bg-primary" hex="#6393A6" />
            <ColorCard name="Secondary (Terracotta)" token="bg-secondary" hex="#BF785E" />
            <ColorCard name="Accent (Peach)" token="bg-accent" hex="#F2CBBD" text="text-accent-foreground" />
            <ColorCard name="Muted (Rust)" token="bg-wilderness-rust" hex="#A65B4B" />
            <ColorCard name="Destructive (Maroon)" token="bg-destructive" hex="#733B36" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <ColorCard name="Background" token="bg-background" hex="#12181b" border />
            <ColorCard name="Card Surface" token="bg-card" hex="#1b2428" border />
            <ColorCard name="Input/Border" token="bg-input" hex="#Slate" />
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold border-b border-border pb-2">2. Typography</h2>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Heading 1: Quantum Physics</h1>
            <h2 className="text-3xl font-semibold">Heading 2: The Nature of Light</h2>
            <h3 className="text-2xl font-medium">Heading 3: Wave-Particle Duality</h3>
            <p className="text-base leading-relaxed text-muted-foreground">
              Body Text: This is the standard body text. It is designed for readability in low-light environments.
              The contrast ratio is optimized to reduce eye strain during long study sessions.
              <span className="text-primary font-medium"> This is highlighted text.</span>
            </p>
            <p className="text-sm text-muted-foreground">Small Text: Used for captions and metadata.</p>
          </div>
        </section>

        {/* UI Components */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold border-b border-border pb-2">3. UI Components</h2>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition">
                Primary Action
              </button>
              <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition">
                Secondary Action
              </button>
              <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition">
                Destructive
              </button>
              <button className="px-4 py-2 bg-card border border-border hover:bg-accent/10 rounded-lg transition">
                Outline / Ghost
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Cards & Content</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                <h4 className="text-xl font-semibold mb-2 text-accent">Concept Card</h4>
                <p className="text-muted-foreground mb-4">
                  Cards use the surface color with a subtle border. They stand out against the deep background.
                </p>
                <div className="h-2 w-full bg-input rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-2/3"></div>
                </div>
              </div>

              <div className="bg-primary/10 p-6 rounded-xl border border-primary/20">
                <h4 className="text-xl font-semibold mb-2 text-primary">Active State</h4>
                <p className="text-primary/80 mb-4">
                  Used for selected items or active learning sessions.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Form Elements</h3>
            <div className="max-w-md space-y-4">
              <input 
                type="text" 
                placeholder="Type something..." 
                className="w-full px-4 py-3 bg-input/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
              />
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-primary flex items-center justify-center text-primary-foreground text-xs">✓</div>
                <span className="text-muted-foreground">Custom Checkbox</span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

function ColorCard({ name, token, hex, text = "text-white", border = false }: any) {
  return (
    <div className={`p-4 rounded-xl ${token} ${border ? 'border border-border' : ''} space-y-2`}>
      <div className={`h-12 w-full rounded-lg bg-black/20`}></div>
      <div>
        <p className={`font-medium text-sm ${text}`}>{name}</p>
        <p className={`text-xs opacity-80 ${text}`}>{hex}</p>
      </div>
    </div>
  );
}
