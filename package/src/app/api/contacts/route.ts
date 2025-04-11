import { NextRequest, NextResponse } from 'next/server';
import { getDB, Contact, updateTimestamp } from '@/lib/db';

// GET /api/contacts - Get all contacts
export async function GET(request: NextRequest) {
  try {
    const db = await getDB();
    const { results } = await db.prepare('SELECT * FROM contacts ORDER BY name').all();
    
    return NextResponse.json({ contacts: results }, { status: 200 });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

// POST /api/contacts - Create a new contact
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, position } = body as Contact;
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    
    const db = await getDB();
    const result = await db.prepare(
      'INSERT INTO contacts (name, email, phone, position) VALUES (?, ?, ?, ?) RETURNING *'
    ).bind(name, email || null, phone || null, position || null).run();
    
    return NextResponse.json({ contact: result.results[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });
  }
}
