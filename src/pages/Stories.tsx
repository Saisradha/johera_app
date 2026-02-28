const Stories = () => {
  const stories = [
    {
      title: "The Draupadi Collection",
      excerpt:
        "Draupadi's unshakeable spirit in the Mahabharata inspires our flagship lehenga line — garments that refuse to unravel, much like the women who wear them.",
      theme: "Mahabharata",
    },
    {
      title: "Karna: The Outsider's Armour",
      excerpt:
        "Born to the sun, raised by earth. Karna's story of identity and defiance is woven into our streetwear — for those who wear their truth on their sleeve.",
      theme: "Mahabharata",
    },
    {
      title: "Shakuntala's Forest",
      excerpt:
        "Born of the wild, destined for thrones. Our nature-inspired prints trace Shakuntala's journey from forest floor to royal court.",
      theme: "Mythology",
    },
  ];

  return (
    <div className="animate-fade-in px-4 py-6 space-y-10">
      {/* Why Johera moved here from home */}
      <section className="border border-border bg-accent/40 px-4 py-8 rounded-2xl">
        <h1 className="mb-4 text-center font-display text-2xl font-bold">
          Why Johera?
        </h1>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-background p-5 text-center shadow-sm">
            <div className="mb-2 text-2xl">✨</div>
            <h3 className="mb-1 font-display text-sm font-semibold">
              Affordable Luxury
            </h3>
            <p className="text-xs text-muted-foreground">
              Premium designs without the premium price tag.
            </p>
          </div>
          <div className="rounded-2xl bg-background p-5 text-center shadow-sm">
            <div className="mb-2 text-2xl">🎨</div>
            <h3 className="mb-1 font-display text-sm font-semibold">
              Fusion Fashion
            </h3>
            <p className="text-xs text-muted-foreground">
              Streetwear silhouettes meet Indian heritage details.
            </p>
          </div>
          <div className="rounded-2xl bg-background p-5 text-center shadow-sm">
            <div className="mb-2 text-2xl">🌱</div>
            <h3 className="mb-1 font-display text-sm font-semibold">
              Sustainability
            </h3>
            <p className="text-xs text-muted-foreground">
              Thoughtful production and direct artisan partnerships.
            </p>
          </div>
        </div>
      </section>

      {/* Mythology stories */}
      <section>
        <h2 className="font-display text-2xl font-bold mb-2">Stories</h2>
        <p className="font-story text-lg italic text-muted-foreground mb-8">
          Discover the mythology behind every collection.
        </p>

        <div className="space-y-6">
          {stories.map((story) => (
            <article
              key={story.title}
              className="rounded-xl border border-border bg-card p-5"
            >
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-body">
                {story.theme}
              </span>
              <h3 className="font-display text-lg font-semibold mt-1 mb-2">
                {story.title}
              </h3>
              <p className="font-story text-base text-muted-foreground italic">
                {story.excerpt}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Stories;
