import { NextRequest, NextResponse } from 'next/server';
import { getDB, Organization, updateTimestamp } from '@/lib/db';

// GET /api/organizations/[id] - Get a specific organization
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
    const result = await db.prepare('SELECT * FROM organizations WHERE id = ?').bind(id).run();
    
    if (!result.results || result.results.length === 0) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }
    
    return NextResponse.json({ organization: result.results[0] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching organization:', error);
    return NextResponse.json({ error: 'Failed to fetch organization' }, { status: 500 });
  }
}

// PUT /api/organizations/[id] - Update an organization
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
    const { name, type, address, website } = body as Organization;
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    
    if (!type || !['school', 'trust', 'organization'].includes(type)) {
      return NextResponse.json({ error: 'Valid type is required (school, trust, or organization)' }, { status: 400 });
    }
    
    const db = await getDB();
    const updatedOrg = updateTimestamp({ name, type, address, website });
    
    const result = await db.prepare(
      'UPDATE organizations SET name = ?, type = ?, address = ?, website = ?, updated_at = ? WHERE id = ? RETURNING *'
    ).bind(
      updatedOrg.name,
      updatedOrg.type,
      updatedOrg.address || null,
      updatedOrg.website || null,
      updatedOrg.updated_at,
      id
    ).run();
    
    if (!result.results || result.results.length === 0) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }
    
    return NextResponse.json({ organization: result.results[0] }, { status: 200 });
  } catch (error) {
    console.error('Error updating organization:', error);
    return NextResponse.json({ error: 'Failed to update organization' }, { status: 500 });
  }
}

// DELETE /api/organizations/[id] - Delete an organization
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
    const result = await db.prepare('DELETE FROM organizations WHERE id = ? RETURNING id').bind(id).run();
    
    if (!result.results || result.results.length === 0) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Organization deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting organization:', error);
    return NextResponse.json({ error: 'Failed to delete organization' }, { status: 500 });
  }
}
