'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Loader2 } from 'lucide-react';

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

interface InventoryTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  isDeleting: string | null;
}

export default function InventoryTable({ products, onEdit, onDelete, isDeleting }: InventoryTableProps) {
  return (
    <div className="border border-[#e5e5e5] rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#f8f9fa]">
            <TableHead className="w-[70px]">Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="hidden sm:table-cell">Price</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="hidden md:table-cell">Technique</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-[#6b7280]">
                No products yet. Add your first product above.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-[#f0efec] rounded flex items-center justify-center text-[10px] text-[#6b7280]">
                      N/A
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium text-[#1a2b4c] max-w-[200px] truncate">
                  {product.title}
                </TableCell>
                <TableCell className="hidden sm:table-cell font-medium">
                  {Math.round(product.price)} DH
                </TableCell>
                <TableCell className="hidden md:table-cell text-[#6b7280]">
                  {product.category}
                </TableCell>
                <TableCell className="hidden md:table-cell text-[#6b7280]">
                  {product.technique}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={product.stockStatus === 'In Stock' ? 'default' : 'secondary'}
                    className={
                      product.stockStatus === 'In Stock'
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-100 border-0'
                    }
                  >
                    {product.stockStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(product)}
                      className="h-8 w-8 text-[#2d5a7b] hover:text-[#1a2b4c]"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(product.id)}
                      disabled={isDeleting === product.id}
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      {isDeleting === product.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
