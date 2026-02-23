const Index = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-6 py-20 text-center bg-accent">
        <span className="font-story text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">
          Where Mythology Meets Fashion
        </span>
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground mb-4">
          JOHERA
        </h1>
        <p className="font-body text-base text-muted-foreground max-w-sm mb-8">
          Contemporary silhouettes inspired by Indian epics — for the modern woman who wears her heritage with pride.
        </p>
        <a
          href="/products"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Explore Collections
        </a>
      </section>

      {/* Category Cards */}
      <section className="px-4 py-10">
        <h2 className="font-display text-2xl font-semibold mb-6 text-center">Shop by Style</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: "Lehengas", href: "/products/lehengas", emoji: "👗" },
            { name: "Co-ord Sets", href: "/products/coord-sets", emoji: "✨" },
            { name: "Streetwear", href: "/products/streetwear", emoji: "🔥" },
            { name: "New Arrivals", href: "/products", emoji: "🆕" },
          ].map((cat) => (
            <a
              key={cat.name}
              href={cat.href}
              className="flex flex-col items-center justify-center gap-2 rounded-xl bg-card border border-border p-6 text-center transition-shadow hover:shadow-md"
            >
              <span className="text-3xl">{cat.emoji}</span>
              <span className="font-body text-sm font-medium text-card-foreground">{cat.name}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Featured Story Teaser */}
      <section className="px-4 py-10 bg-accent">
        <h2 className="font-display text-2xl font-semibold mb-2 text-center">The Story Behind the Stitch</h2>
        <p className="font-story text-base italic text-muted-foreground text-center max-w-md mx-auto mb-6">
          "Every garment carries a verse from the Mahabharata — woven into fabric, worn as armour."
        </p>
        <div className="text-center">
          <a
            href="/stories"
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            Read Our Stories →
          </a>
        </div>
      </section>
    </div>
  );
};

export default Index;
