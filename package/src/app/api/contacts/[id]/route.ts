import { NextRequest, NextResponse } from 'next/server';
import { getDB, Contact, updateTimestamp } from '@/lib/db';

// GET /api/contacts/[id] - Get a specific contact
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const db = await getDB();
    const result = await db.prepare('SELECT * FROM contacts WHERE id = ?').bind(id).run();
    
    if (!result.results || result.results.length === 0) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }
    
    return NextResponse.json({ contact: result.results[0] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching contact:', error);
    return NextResponse.json({ error: 'Failed to fetch contact' }, { status: 500 });
  }
}

// PUT /api/contacts/[id] - Update a contact
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    
    const body = await request.json();
    const { name, email, phone, position } = body as Contact;
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    
    const db = await getDB();
    const updatedContact = updateTimestamp({ name, email, phone, position });
    
    const result = await db.prepare(
      'UPDATE contacts SET name = ?, email = ?, phone = ?, position = ?, updated_at = ? WHERE id = ? RETURNING *'
    ).bind(
      updatedContact.name,
      updatedContact.email || null,
      updatedContact.phone || null,
      updatedContact.position || null,
      updatedContact.updated_at,
      id
    ).run();
    
    if (!result.results || result.results.length === 0) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }
    
    return NextResponse.json({ contact: result.results[0] }, { status: 200 });
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
  }
}

// DELETE /api/contacts/[id] - Delete a contact
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    
    const db = await getDB();
    const result = await db.prepare('DELETE FROM contacts WHERE id = ? RETURNING id').bind(id).run();
    
    if (!result.results || result.results.length === 0) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Contact deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
  }
}
