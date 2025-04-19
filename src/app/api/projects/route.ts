import { NextResponse } from 'next/server';
import { projects } from '@/data/projects/data';

export async function GET() {
  try {
    return NextResponse.json(
      { 
        projects, 
        count: projects.length,
        success: true 
      }, 
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Failed to fetch projects:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch projects', 
        success: false 
      }, 
      { status: 500 }
    );
  }
}