'use client';

import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, Loader2, ImagePlus } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  technique: string;
  stockStatus: string;
}

interface InventoryFormProps {
  product: Product | null;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function InventoryForm({ product, onSubmit, onCancel, isSubmitting }: InventoryFormProps) {
  const [title, setTitle] = useState(product?.title || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [category, setCategory] = useState(product?.category || 'Tops');
  const [technique, setTechnique] = useState(product?.technique || 'Cyanotype');
  const [inStock, setInStock] = useState(product?.stockStatus !== 'Sold Out');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(product?.imageUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!product;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if (isEditing && product) {
      formData.append('id', product.id);
    }
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('technique', technique);
    formData.append('stockStatus', inStock ? 'In Stock' : 'Sold Out');

    // Upload image first if a new file was selected
    if (imageFile) {
      const uploadFormData = new FormData();
      uploadFormData.append('file', imageFile);
      try {
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.url) {
          formData.append('imageUrl', uploadData.url);
        }
      } catch (err) {
        console.error('Image upload failed:', err);
      }
    } else if (product?.imageUrl) {
      formData.append('imageUrl', product.imageUrl);
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Title */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Product title"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Product description"
            rows={3}
          />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price">Price (DH)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
            required
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tops">Tops</SelectItem>
              <SelectItem value="T-shirts">T-shirts</SelectItem>
              <SelectItem value="Bags">Bags</SelectItem>
              <SelectItem value="Accessories">Accessories</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Technique */}
        <div className="space-y-2">
          <Label>Technique</Label>
          <Select value={technique} onValueChange={setTechnique}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cyanotype">Cyanotype</SelectItem>
              <SelectItem value="Reactive Dye">Reactive Dye</SelectItem>
              <SelectItem value="Discharge">Discharge</SelectItem>
              <SelectItem value="DTG">DTG</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stock Status */}
        <div className="space-y-2">
          <Label>Stock Status</Label>
          <div className="flex items-center gap-3 h-9">
            <Switch
              checked={inStock}
              onCheckedChange={setInStock}
              id="stock-switch"
            />
            <span className="text-sm text-[#1a2b4c]">
              {inStock ? 'In Stock' : 'Sold Out'}
            </span>
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-2 sm:col-span-2">
          <Label>Product Image</Label>
          <div
            className="border-2 border-dashed border-[#e5e5e5] rounded-lg p-4 text-center hover:border-[#2d5a7b] transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <div className="flex items-center gap-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="text-left">
                  <p className="text-sm text-[#1a2b4c] font-medium">Click to change image</p>
                  <p className="text-xs text-[#6b7280]">JPG, PNG, WebP supported</p>
                </div>
              </div>
            ) : (
              <div className="py-4">
                <ImagePlus className="w-8 h-8 mx-auto text-[#6b7280] mb-2" />
                <p className="text-sm text-[#6b7280]">Click to upload an image</p>
                <p className="text-xs text-[#6b7280] mt-1">JPG, PNG, WebP supported</p>
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
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#1a2b4c] hover:bg-[#2d5a7b] text-white"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          {isEditing ? 'Update Product' : 'Add Product'}
        </Button>
        {isEditing && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
