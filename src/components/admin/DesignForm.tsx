'use client';

import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, ImagePlus, Save } from 'lucide-react';

interface SiteSettings {
  id: string;
  heroImageUrl: string;
  heroEyebrow: string;
  heroHeadline: string;
  heroDescription: string;
  promoBannerText: string;
  whatsappNumber: string;
  storeMode: string;
  comingSoonImageUrl: string;
}

interface DesignFormProps {
  settings: SiteSettings | null;
  onSave: (formData: FormData) => Promise<void>;
  isSaving: boolean;
}

export default function DesignForm({ settings, onSave, isSaving }: DesignFormProps) {
  const [promoBannerText, setPromoBannerText] = useState(settings?.promoBannerText || '');
  const [heroEyebrow, setHeroEyebrow] = useState(settings?.heroEyebrow || 'HANDMADE IN MOROCCO');
  const [heroHeadline, setHeroHeadline] = useState(settings?.heroHeadline || '');
  const [heroDescription, setHeroDescription] = useState(settings?.heroDescription || '');
  const [whatsappNumber, setWhatsappNumber] = useState(settings?.whatsappNumber || '');
  const [storeMode, setStoreMode] = useState(settings?.storeMode || 'LIVE');
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState(settings?.heroImageUrl || '');
  const [comingSoonImageFile, setComingSoonImageFile] = useState<File | null>(null);
  const [comingSoonImagePreview, setComingSoonImagePreview] = useState(settings?.comingSoonImageUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const comingSoonFileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleComingSoonImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setComingSoonImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setComingSoonImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('promoBannerText', promoBannerText);
    formData.append('heroEyebrow', heroEyebrow);
    formData.append('heroHeadline', heroHeadline);
    formData.append('heroDescription', heroDescription);
    formData.append('whatsappNumber', whatsappNumber);
    formData.append('storeMode', storeMode);

    // Upload hero image first if a new file was selected
    if (heroImageFile) {
      const uploadFormData = new FormData();
      uploadFormData.append('file', heroImageFile);
      try {
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.url) {
          formData.append('heroImageUrl', uploadData.url);
        }
      } catch (err) {
        console.error('Image upload failed:', err);
      }
      } else if (settings?.heroImageUrl) {
        formData.append('heroImageUrl', settings.heroImageUrl);
      }

      // Upload coming soon image if a new file was selected
      if (comingSoonImageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', comingSoonImageFile);
        try {
          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: uploadFormData,
          });
          const uploadData = await uploadRes.json();
          if (uploadData.url) {
            formData.append('comingSoonImageUrl', uploadData.url);
          }
        } catch (err) {
          console.error('Image upload failed:', err);
        }
      } else if (settings?.comingSoonImageUrl) {
        formData.append('comingSoonImageUrl', settings.comingSoonImageUrl);
      }

      await onSave(formData);
    };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      {/* Promo Banner Text */}
      <div className="space-y-2">
        <Label htmlFor="promoText">Top Promo Bar Text</Label>
        <Input
          id="promoText"
          value={promoBannerText}
          onChange={(e) => setPromoBannerText(e.target.value)}
          placeholder="e.g. FREE SHIPPING ON ORDERS OVER 500 DH"
        />
      </div>

      {/* Hero Content */}
      <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/20">
        <h3 className="text-base font-semibold">Hero Content</h3>
        
        <div className="space-y-2">
          <Label htmlFor="heroEyebrow">Eyebrow (Small text above headline)</Label>
          <Input
            id="heroEyebrow"
            value={heroEyebrow}
            onChange={(e) => setHeroEyebrow(e.target.value)}
            placeholder="e.g. HANDMADE IN MOROCCO"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="heroHeadline">Hero Headline</Label>
          <Input
            id="heroHeadline"
            value={heroHeadline}
            onChange={(e) => setHeroHeadline(e.target.value)}
            placeholder="e.g. Where Sunlight Becomes Art"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="heroDescription">Hero Description</Label>
          <textarea
            id="heroDescription"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={heroDescription}
            onChange={(e) => setHeroDescription(e.target.value)}
            placeholder="e.g. Every cyanotype piece is exposed by sunlight..."
          />
        </div>
      </div>

      {/* WhatsApp Number */}
      <div className="space-y-2">
        <Label htmlFor="whatsappNumber">WhatsApp Support Number</Label>
        <Input
          id="whatsappNumber"
          value={whatsappNumber}
          onChange={(e) => setWhatsappNumber(e.target.value)}
          placeholder="e.g. 212600000000"
        />
        <p className="text-xs text-muted-foreground">Include country code without the plus (e.g. 212 for Morocco).</p>
      </div>

      {/* Store Mode */}
      <div className="space-y-2 p-4 border border-border rounded-lg bg-muted/20">
        <Label className="text-base">Store Mode</Label>
        <p className="text-xs text-muted-foreground mb-3">
          When set to "Coming Soon", the storefront is hidden and users will only see a drop announcement subscription page.
        </p>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="storeMode"
              value="LIVE"
              checked={storeMode === 'LIVE'}
              onChange={() => setStoreMode('LIVE')}
              className="accent-primary"
            />
            <span className="text-sm">Live (Normal)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="storeMode"
              value="COMING_SOON"
              checked={storeMode === 'COMING_SOON'}
              onChange={() => setStoreMode('COMING_SOON')}
              className="accent-primary"
            />
            <span className="text-sm font-medium text-primary">Coming Soon (Drop Mode)</span>
          </label>
        </div>
      </div>

      {/* Hero Image */}
      <div className="space-y-2">
        <Label>Hero Banner Image</Label>
        <div
          className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          {heroImagePreview ? (
            <div className="space-y-3">
              <img
                src={heroImagePreview}
                alt="Hero preview"
                className="w-full h-40 object-cover rounded-md"
              />
              <p className="text-sm text-muted-foreground">Click to change the hero image</p>
            </div>
          ) : (
            <div className="py-6">
              <ImagePlus className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload a hero banner image</p>
              <p className="text-xs text-muted-foreground mt-1">Recommended: 1600×700px</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Coming Soon Background Image */}
      <div className="space-y-2">
        <Label>Coming Soon Background Image</Label>
        <div
          className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer"
          onClick={() => comingSoonFileInputRef.current?.click()}
        >
          {comingSoonImagePreview ? (
            <div className="space-y-3">
              <img
                src={comingSoonImagePreview}
                alt="Coming Soon preview"
                className="w-full h-40 object-cover rounded-md"
              />
              <p className="text-sm text-muted-foreground">Click to change the coming soon image</p>
            </div>
          ) : (
            <div className="py-6">
              <ImagePlus className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload an image for Drop mode</p>
              <p className="text-xs text-muted-foreground mt-1">Recommended: 1600×900px</p>
            </div>
          )}
          <input
            ref={comingSoonFileInputRef}
            type="file"
            accept="image/*"
            onChange={handleComingSoonImageChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Save Button */}
      <Button
        type="submit"
        disabled={isSaving}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {isSaving ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : (
          <Save className="w-4 h-4 mr-2" />
        )}
        Save Changes
      </Button>
    </form>
  );
}
