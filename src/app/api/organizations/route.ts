import { NextRequest, NextResponse } from 'next/server';
import { getDB, Organization, updateTimestamp } from '@/lib/db';

// GET /api/organizations - Get all organizations
export async function GET(request: NextRequest) {
  try {
    const db = await getDB();
    const { results } = await db.prepare('SELECT * FROM organizations ORDER BY name').all();
    
    return NextResponse.json({ organizations: results }, { status: 200 });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 });
  }
}

// POST /api/organizations - Create a new organization
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, address, website } = body as Organization;
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    
    if (!type || !['school', 'trust', 'organization'].includes(type)) {
      return NextResponse.json({ error: 'Valid type is required (school, trust, or organization)' }, { status: 400 });
    }
    
    const db = await getDB();
    const result = await db.prepare(
      'INSERT INTO organizations (name, type, address, website) VALUES (?, ?, ?, ?) RETURNING *'
    ).bind(name, type, address || null, website || null).run();
    
    return NextResponse.json({ organization: result.results[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating organization:', error);
    return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 });
  }
}
