import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

// GET /api/search - Search across contacts, organizations, and interactions
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    
    if (!query || query.trim() === '') {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }
    
    const db = await getDB();
    const searchTerm = `%${query}%`;
    
    // Search contacts
    const { results: contactResults } = await db.prepare(`
      SELECT id, name, email, phone, position, 'contact' as type
      FROM contacts
      WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? OR position LIKE ?
    `).bind(searchTerm, searchTerm, searchTerm, searchTerm).all();
    
    // Search organizations
    const { results: organizationResults } = await db.prepare(`
      SELECT id, name, type, address, website, 'organization' as result_type
      FROM organizations
      WHERE name LIKE ? OR address LIKE ? OR website LIKE ?
    `).bind(searchTerm, searchTerm, searchTerm).all();
    
    // Search interactions
    const { results: interactionResults } = await db.prepare(`
      SELECT 
        i.id, 
        i.title, 
        i.date, 
        i.notes, 
        i.actions,
        c.name as contact_name,
        o.name as organization_name,
        'interaction' as result_type
      FROM interactions i
      LEFT JOIN contacts c ON i.contact_id = c.id
      LEFT JOIN organizations o ON i.organization_id = o.id
      WHERE i.title LIKE ? OR i.notes LIKE ? OR i.actions LIKE ?
      OR c.name LIKE ? OR o.name LIKE ?
    `).bind(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm).all();
    
    // Search tags
    const { results: tagResults } = await db.prepare(`
      SELECT 
        i.id, 
        i.title, 
        i.date, 
        i.notes, 
        i.actions,
        c.name as contact_name,
        o.name as organization_name,
        t.name as tag_name,
        'tag' as result_type
      FROM interactions i
      JOIN interaction_tags it ON i.id = it.interaction_id
      JOIN tags t ON it.tag_id = t.id
      LEFT JOIN contacts c ON i.contact_id = c.id
      LEFT JOIN organizations o ON i.organization_id = o.id
      WHERE t.name LIKE ?
    `).bind(searchTerm).all();
    
    // Combine and deduplicate results
    const interactionIds = new Set();
    const combinedInteractions = [...interactionResults, ...tagResults].filter(item => {
      if (interactionIds.has(item.id)) {
        return false;
      }
      interactionIds.add(item.id);
      return true;
    });
    
    return NextResponse.json({
      results: {
        contacts: contactResults,
        organizations: organizationResults,
        interactions: combinedInteractions
      },
      count: {
        contacts: contactResults.length,
        organizations: organizationResults.length,
        interactions: combinedInteractions.length,
        total: contactResults.length + organizationResults.length + combinedInteractions.length
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error performing search:', error);
    return NextResponse.json({ error: 'Failed to perform search' }, { status: 500 });
  }
}
