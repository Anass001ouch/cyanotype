import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, customerName, customerPhone, customerAddress, customerCity } = body;

    if (!productId || !customerName || !customerPhone || !customerAddress || !customerCity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let order;
    let product;

    try {
      const result = await prisma.$transaction(async (tx) => {
        const prod = await tx.product.findUnique({ where: { id: productId } });
        
        if (!prod) {
          throw new Error('PRODUCT_NOT_FOUND');
        }
        if (prod.stockStatus !== 'In Stock') {
          throw new Error('OUT_OF_STOCK');
        }

        const newOrder = await tx.order.create({
          data: {
            productId,
            customerName,
            customerPhone,
            customerAddress,
            customerCity,
            status: 'Pending',
          },
        });

        await tx.product.update({
          where: { id: productId },
          data: { stockStatus: 'Out of Stock' },
        });

        return { newOrder, prod };
      });

      order = result.newOrder;
      product = result.prod;
    } catch (txError: any) {
      if (txError.message === 'OUT_OF_STOCK') {
        return NextResponse.json(
          { error: 'Sorry, this unique piece was just purchased by someone else!' },
          { status: 409 }
        );
      }
      if (txError.message === 'PRODUCT_NOT_FOUND') {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      throw txError;
    }

    try {

      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: 'Anasouch9@gmail.com',
          subject: `New Order Received - ${customerName}`,
          html: `
            <h2>New Order Details</h2>
            <p><strong>Customer:</strong> ${customerName}</p>
            <p><strong>Phone:</strong> ${customerPhone}</p>
            <p><strong>City:</strong> ${customerCity}</p>
            <p><strong>Address:</strong> ${customerAddress}</p>
            <hr />
            <h3>Product Ordered</h3>
            <p><strong>Item:</strong> ${product?.title || 'Unknown Product'}</p>
            <p><strong>Price:</strong> ${product?.price || 'N/A'} DH</p>
          `,
        };

        await transporter.sendMail(mailOptions);
      } else {
        console.warn('EMAIL_USER or EMAIL_PASS not set. Skipping email notification.');
      }
    } catch (emailErr) {
      console.error('Error sending email notification:', emailErr);
      // We don't want to fail the order creation if the email fails
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
