'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ComingSoonPageProps {
  onAdminClick: () => void;
  backgroundImageUrl?: string;
}

export default function ComingSoonPage({ onAdminClick, backgroundImageUrl }: ComingSoonPageProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error('Failed to subscribe');

      setIsSuccess(true);
      setEmail('');
      toast({
        title: 'Subscribed Successfully!',
        description: 'You will be notified as soon as the drop is live.',
      });
    } catch (err) {
      console.error(err);
      toast({
        title: 'Subscription Failed',
        description: 'There was an error saving your email. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen text-foreground flex flex-col justify-between relative overflow-hidden" 
      style={{ fontFamily: 'var(--font-geist-sans)' }}
    >
      {/* Background Image Setup */}
      {backgroundImageUrl ? (
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        />
      ) : (
        <div className="absolute inset-0 z-0 bg-background" />
      )}
      
      {/* Dark overlay so text is readable */}
      <div className="absolute inset-0 z-0 bg-background/60 backdrop-blur-sm" />

      {/* Spacer for top */}
      <div className="p-8 relative z-10">
        <h1 className="text-2xl font-bold tracking-widest text-center">CYNA</h1>
        <img 
          src="/cyna-logo.png" 
          alt="CYNA Logo" 
          className="h-10 sm:h-12 w-auto object-contain mx-auto mt-3"
        />
      </div>

      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <motion.div 
          className="max-w-md w-full space-y-8 text-center -mt-12 sm:-mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter">
              DROP COMING SOON
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base px-4">
              Our 1-of-1 cyanotype pieces are currently being crafted. 
              Leave your email to get exclusive early access before the public release.
            </p>
          </div>

          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-primary/10 border border-primary/20 rounded-lg p-6"
            >
              <h3 className="text-primary font-semibold mb-2">You're on the list</h3>
              <p className="text-sm text-muted-foreground">Keep an eye on your inbox. We'll let you know the moment the drop is live.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 px-4">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="h-12 bg-muted/30 border-muted focus-visible:ring-1 focus-visible:ring-primary text-base"
              />
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="h-12 px-6 bg-foreground text-background hover:bg-foreground/90 font-medium tracking-wide w-full sm:w-auto"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    Notify Me
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          )}
        </motion.div>
      </main>

      <footer className="p-6 text-center text-xs text-muted-foreground relative z-10">
        <p>&copy; {new Date().getFullYear()} CYNA. All rights reserved.</p>
        
        {/* Hidden Admin Trigger */}
        <button
          onClick={onAdminClick}
          className="absolute bottom-6 right-6 opacity-20 hover:opacity-100 transition-opacity p-2"
          aria-label="Admin panel"
        >
          ⚙
        </button>
      </footer>
    </div>
  );
}
