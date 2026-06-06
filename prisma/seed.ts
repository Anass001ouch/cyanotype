import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed site settings
  const settings = await prisma.siteSettings.upsert({
    where: { id: 'site-settings-1' },
    update: {},
    create: {
      id: 'site-settings-1',
      heroImageUrl: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1600&h=700&fit=crop',
      heroHeadline: 'Where Chemistry Meets Fashion',
      promoBannerText: 'FREE SHIPPING ON ORDERS OVER 500 DH',
    },
  })

  // Seed products
  const products = [
    {
      title: 'Indigo Wave T-Shirt',
      description: 'Hand-pressed cyanotype print on organic cotton. Each piece is unique due to the chemical reaction process.',
      price: 350,
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
      category: 'Tops',
      technique: 'Cyanotype',
      stockStatus: 'In Stock',
    },
    {
      title: 'Midnight Fern Hoodie',
      description: 'Real botanical specimens exposed using UV-sensitive chemicals on heavyweight fleece.',
      price: 650,
      imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop',
      category: 'Tops',
      technique: 'Cyanotype',
      stockStatus: 'In Stock',
    },
    {
      title: 'Solar Flare Bandana',
      description: 'Sun-exposed chemical print on soft cotton bandana. No two are alike.',
      price: 120,
      imageUrl: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc64?w=600&h=600&fit=crop',
      category: 'Accessories',
      technique: 'Cyanotype',
      stockStatus: 'In Stock',
    },
    {
      title: 'Blueprint Tote Bag',
      description: 'Classic cyanotype blue on canvas tote. Chemically bonded, wash-resistant.',
      price: 280,
      imageUrl: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=600&h=600&fit=crop',
      category: 'Bags',
      technique: 'Cyanotype',
      stockStatus: 'Sold Out',
    },
    {
      title: 'Reactive Dye Tee — Ochre',
      description: 'Fiber-reactive dye technique for permanent color penetration into the fabric.',
      price: 300,
      imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=600&fit=crop',
      category: 'Tops',
      technique: 'Reactive Dye',
      stockStatus: 'In Stock',
    },
    {
      title: 'Discharge Print Tank',
      description: 'Chemical discharge process removes original dye and replaces with custom print.',
      price: 275,
      imageUrl: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&h=600&fit=crop',
      category: 'Tops',
      technique: 'Discharge',
      stockStatus: 'Sold Out',
    },
  ]

  for (const product of products) {
    await prisma.product.create({ data: product })
  }

  console.log('Seed data created successfully')
  console.log('Settings:', settings.id)
  console.log('Products created:', products.length)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
