import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const products = await db.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('GET products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = (formData.get('description') as string) || '';
    const price = parseFloat(formData.get('price') as string);
    const category = (formData.get('category') as string) || 'Tops';
    const technique = (formData.get('technique') as string) || 'Cyanotype';
    const stockStatus = (formData.get('stockStatus') as string) || 'In Stock';
    const imageUrl = (formData.get('imageUrl') as string) || '';

    if (!title || isNaN(price)) {
      return NextResponse.json({ error: 'Title and price are required' }, { status: 400 });
    }

    const product = await db.product.create({
      data: {
        title,
        description,
        price,
        imageUrl,
        category,
        technique,
        stockStatus,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('POST product error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const id = formData.get('id') as string;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};

    const title = formData.get('title') as string | null;
    const description = formData.get('description') as string | null;
    const price = formData.get('price') as string | null;
    const category = formData.get('category') as string | null;
    const technique = formData.get('technique') as string | null;
    const stockStatus = formData.get('stockStatus') as string | null;
    const imageUrl = formData.get('imageUrl') as string | null;

    if (title !== null) updateData.title = title;
    if (description !== null) updateData.description = description;
    if (price !== null) updateData.price = parseFloat(price);
    if (category !== null) updateData.category = category;
    if (technique !== null) updateData.technique = technique;
    if (stockStatus !== null) updateData.stockStatus = stockStatus;
    if (imageUrl !== null) updateData.imageUrl = imageUrl;

    const product = await db.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('PUT product error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await db.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE product error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
