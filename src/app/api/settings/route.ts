import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    let settings = await db.siteSettings.findFirst();

    if (!settings) {
      settings = await db.siteSettings.create({
        data: {
          heroHeadline: 'Handcrafted Cyanotype Fashion',
          promoBannerText: 'FREE SHIPPING ON ORDERS OVER 500 DH',
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('GET settings error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();

    const promoBannerText = formData.get('promoBannerText') as string | null;
    const heroHeadline = formData.get('heroHeadline') as string | null;
    const heroImageUrl = formData.get('heroImageUrl') as string | null;

    const updateData: Record<string, string> = {};

    if (promoBannerText !== null) updateData.promoBannerText = promoBannerText;
    if (heroHeadline !== null) updateData.heroHeadline = heroHeadline;
    if (heroImageUrl !== null) updateData.heroImageUrl = heroImageUrl;

    let settings = await db.siteSettings.findFirst();

    if (!settings) {
      settings = await db.siteSettings.create({ data: updateData });
    } else {
      settings = await db.siteSettings.update({
        where: { id: settings.id },
        data: updateData,
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('PUT settings error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
