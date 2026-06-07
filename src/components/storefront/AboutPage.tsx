import React from 'react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
      <h1 className="text-4xl font-bold tracking-tight mb-8">About CYNA</h1>
      
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed">
            CYNA was born from a passion for bridging the gap between traditional photographic techniques and modern sustainable fashion. Based in Morocco, we create unique, handcrafted garments that tell a story. Every piece is an original artwork, sun-printed using the historical cyanotype process.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">The Process</h2>
          <p className="text-muted-foreground leading-relaxed">
            Cyanotype is a 19th-century photographic printing process that produces a cyan-blue print. We coat natural fabrics with light-sensitive chemicals, arrange botanicals, negatives, or objects on the surface, and expose them to the Moroccan sun. Once washed, the striking blue background is revealed, leaving the silhouettes of the objects in the original color of the fabric. Because it relies on natural sunlight and hand-coating, no two pieces are ever exactly alike.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We love hearing from our customers! If you have any questions about our process, custom orders, or collaborations, feel free to reach out.
          </p>
          <p className="text-muted-foreground">
            <strong>Email:</strong> Anasouch9@gmail.com<br />
            <strong>Location:</strong> Morocco
          </p>
        </section>
      </div>
    </div>
  );
}
