import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
      const { username } = await req.json();
  
      if (!username) {
        return NextResponse.json({ error: 'Username is required' }, { status: 400 });
      }
  
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });
  
      if (existingUser) {
        return NextResponse.json({
          message: 'User already exists',
          user: existingUser,
        });
      }
  
      const newUser = await prisma.user.create({
        data: { username },
      });
  
      return NextResponse.json(newUser);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
  }



  export async function GET(req: NextRequest) {
    const username = req.nextUrl.searchParams.get('username');

    try {
      if (!username) {
        return NextResponse.json({ error: 'Usernmae is required' }, {status: 400});
      }

      const user = await prisma.user.findUnique({
          where: {
              username
          },
          include:{
            chats: true
          }
      })

      if (!user) return NextResponse.json({erorr: "User not found"}, {status : 404});
  
      
      return NextResponse.json({user: user}, {status : 200});
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Internal server error' }, {status: 500 });
    }
}
