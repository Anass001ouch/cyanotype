'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  price: number;
}

interface CheckoutDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutDialog({ product, isOpen, onClose }: CheckoutDialogProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    customerCity: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!product) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          ...formData,
        }),
      });

      if (!res.ok) {
        let errorMessage = 'Failed to create order';
        try {
          const errData = await res.json();
          if (errData.error) errorMessage = errData.error;
        } catch (e) {}
        throw new Error(errorMessage);
      }

      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
      toast({
        title: 'Order Failed',
        description: err.message || 'There was an issue submitting your order. Please try again.',
        variant: 'destructive',
      });
      
      // Close dialog if it was already purchased
      if (err.message && err.message.includes('purchased by someone else')) {
        setTimeout(() => onClose(), 1500);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset state after dialog animation finishes
    setTimeout(() => {
      setIsSuccess(false);
      setFormData({
        customerName: '',
        customerPhone: '',
        customerAddress: '',
        customerCity: '',
      });
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            {isSuccess ? 'Order Confirmed!' : `Complete Your Order`}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isSuccess
              ? 'Thank you for your purchase.'
              : `You are ordering "${product.title}" for ${Math.round(product.price)} DH`}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-6 space-y-4 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground text-lg">We've received your info!</h3>
            <p className="text-sm text-muted-foreground">
              Our team will contact you via <strong>WhatsApp</strong> shortly to confirm your order.
            </p>
            <div className="bg-muted/50 p-4 rounded-lg text-sm text-left space-y-2 text-foreground">
              <p><strong>Payment Terms:</strong></p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>Half of the price is sent via Bank Transfer.</li>
                <li>The remaining half is paid Cash on Delivery.</li>
              </ul>
            </div>
            <Button onClick={handleClose} className="w-full mt-4">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-1">
              <label htmlFor="customerName" className="text-sm font-medium text-foreground">
                Full Name
              </label>
              <input
                id="customerName"
                name="customerName"
                type="text"
                required
                value={formData.customerName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="customerPhone" className="text-sm font-medium text-foreground">
                WhatsApp Phone Number
              </label>
              <input
                id="customerPhone"
                name="customerPhone"
                type="tel"
                required
                value={formData.customerPhone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="+212 6XX-XXXXXX"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="customerCity" className="text-sm font-medium text-foreground">
                City
              </label>
              <input
                id="customerCity"
                name="customerCity"
                type="text"
                required
                value={formData.customerCity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Casablanca"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="customerAddress" className="text-sm font-medium text-foreground">
                Delivery Address
              </label>
              <textarea
                id="customerAddress"
                name="customerAddress"
                required
                rows={3}
                value={formData.customerAddress}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="123 Street Name, Apartment 4"
              />
            </div>
            
            <div className="pt-2">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Confirm Order - Cash on Delivery`
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
