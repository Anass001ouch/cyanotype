'use client';

import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, ImagePlus, Save } from 'lucide-react';

interface SiteSettings {
  id: string;
  heroImageUrl: string;
  heroHeadline: string;
  promoBannerText: string;
}

interface DesignFormProps {
  settings: SiteSettings | null;
  onSave: (formData: FormData) => Promise<void>;
  isSaving: boolean;
}

export default function DesignForm({ settings, onSave, isSaving }: DesignFormProps) {
  const [promoBannerText, setPromoBannerText] = useState(settings?.promoBannerText || '');
  const [heroHeadline, setHeroHeadline] = useState(settings?.heroHeadline || '');
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState(settings?.heroImageUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('promoBannerText', promoBannerText);
    formData.append('heroHeadline', heroHeadline);

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

      {/* Hero Headline */}
      <div className="space-y-2">
        <Label htmlFor="heroHeadline">Hero Headline</Label>
        <Input
          id="heroHeadline"
          value={heroHeadline}
          onChange={(e) => setHeroHeadline(e.target.value)}
          placeholder="e.g. Where Chemistry Meets Fashion"
        />
      </div>

      {/* Hero Image */}
      <div className="space-y-2">
        <Label>Hero Banner Image</Label>
        <div
          className="border-2 border-dashed border-[#e5e5e5] rounded-lg p-4 text-center hover:border-[#2d5a7b] transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          {heroImagePreview ? (
            <div className="space-y-3">
              <img
                src={heroImagePreview}
                alt="Hero preview"
                className="w-full h-40 object-cover rounded-md"
              />
              <p className="text-sm text-[#6b7280]">Click to change the hero image</p>
            </div>
          ) : (
            <div className="py-6">
              <ImagePlus className="w-10 h-10 mx-auto text-[#6b7280] mb-2" />
              <p className="text-sm text-[#6b7280]">Click to upload a hero banner image</p>
              <p className="text-xs text-[#6b7280] mt-1">Recommended: 1600×700px</p>
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

      {/* Save Button */}
      <Button
        type="submit"
        disabled={isSaving}
        className="bg-[#1a2b4c] hover:bg-[#2d5a7b] text-white"
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
