import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { idString, role, content } = await req.json();

    // Validate the input data
    if (!idString || !role || !content) {
      return NextResponse.json({ error: "idString, role, and content are required" }, { status: 400 });
    }

    // Find the chat by idString
    const chat = await prisma.chat.findUnique({
      where: { idString },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const updatedMessages = [
      ...(chat.messages || []),
      { content, role },
    ];

    const updatedChat = await prisma.chat.update({
      where: { idString },
      data: {
        messages: updatedMessages,
      },
    });

    return NextResponse.json(updatedChat, { status: 200 });
  } catch (error) {
    console.error("Error updating chat messages:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}