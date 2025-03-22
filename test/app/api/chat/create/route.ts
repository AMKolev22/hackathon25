import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { username, name, id } = await req.json();

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const newChat = await prisma.chat.create({
      data: {
        idString: id,
        name,
        messages: [],
        userId: existingUser.id,
      },
    });

    return NextResponse.json(newChat);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

