import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    let settings = await db.siteSettings.findFirst();

    if (!settings) {
      settings = await db.siteSettings.create({
        data: {
          heroImageUrl: '',
          heroEyebrow: 'HANDMADE IN MOROCCO',
          heroHeadline: 'Where Sunlight Becomes Art',
          heroDescription: 'Every cyanotype piece is exposed by sunlight, making each print completely unique.',
          promoBannerText: 'FREE SHIPPING ON ORDERS OVER 500 DH',
          whatsappNumber: '212600000000',
          storeMode: 'LIVE',
          comingSoonImageUrl: '',
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
    const heroEyebrow = formData.get('heroEyebrow') as string | null;
    const heroDescription = formData.get('heroDescription') as string | null;
    const whatsappNumber = formData.get('whatsappNumber') as string | null;
    const storeMode = formData.get('storeMode') as string | null;
    const comingSoonImageUrl = formData.get('comingSoonImageUrl') as string | null;

    const updateData: Record<string, string> = {};

    if (promoBannerText !== null) updateData.promoBannerText = promoBannerText;
    if (heroHeadline !== null) updateData.heroHeadline = heroHeadline;
    if (heroEyebrow !== null) updateData.heroEyebrow = heroEyebrow;
    if (heroDescription !== null) updateData.heroDescription = heroDescription;
    if (heroImageUrl !== null) updateData.heroImageUrl = heroImageUrl;
    if (whatsappNumber !== null) updateData.whatsappNumber = whatsappNumber;
    if (storeMode !== null) updateData.storeMode = storeMode;
    if (comingSoonImageUrl !== null) updateData.comingSoonImageUrl = comingSoonImageUrl;

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
