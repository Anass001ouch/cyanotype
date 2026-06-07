import React from 'react';

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Help & Support</h1>
      
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Shipping & Delivery</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              We currently offer delivery exclusively within <strong>Morocco</strong>. 
            </p>
            <p>
              <strong>Cash on Delivery (COD) & Bank Transfer:</strong><br/>
              To secure your order, we require half of the payment upfront via bank transfer. The remaining half is paid in cash when the item is delivered to your door.
            </p>
            <p>
              Once your order is placed, our team will contact you via WhatsApp to provide the bank details and confirm your delivery address.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Cyanotype Care Guide</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
            <li><strong>Washing:</strong> Hand wash gently in cold water using a pH-neutral, non-phosphate detergent. Phosphates and high alkalinity will bleach the cyanotype blue.</li>
            <li><strong>Drying:</strong> Air dry in the shade. Extended exposure to direct, harsh sunlight while wet can cause the image to fade over time.</li>
            <li><strong>Fading:</strong> If your print fades due to sun exposure, washing it and letting it rest in a dark place can actually help the Prussian blue oxidize and regain some of its depth!</li>
            <li><strong>Ironing:</strong> Iron inside out on a low setting. Do not use bleach or harsh stain removers.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-foreground mb-1">Are all items unique?</h3>
              <p className="text-muted-foreground text-sm">Yes! Because the cyanotype process relies on natural UV light and hand-placed objects, every single print is one-of-a-kind. The item you see in the photos might have slight variations when remade.</p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">Do you accept returns?</h3>
              <p className="text-muted-foreground text-sm">Due to the custom, handcrafted nature of our garments, we do not currently accept returns unless the item arrives damaged. Please check the sizing charts carefully before ordering.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
