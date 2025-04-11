import { NextRequest, NextResponse } from 'next/server';
import { getDB, Interaction, Tag, updateTimestamp } from '@/lib/db';

// GET /api/interactions - Get all interactions
export async function GET(request: NextRequest) {
  try {
    const db = await getDB();
    
    // Get all interactions with contact and organization details
    const { results } = await db.prepare(`
      SELECT 
        i.*,
        c.name as contact_name,
        o.name as organization_name,
        o.type as organization_type
      FROM interactions i
      LEFT JOIN contacts c ON i.contact_id = c.id
      LEFT JOIN organizations o ON i.organization_id = o.id
      ORDER BY i.date DESC
    `).all();
    
    // For each interaction, get its tags
    const interactions = await Promise.all(results.map(async (interaction: any) => {
      const { results: tagResults } = await db.prepare(`
        SELECT t.name
        FROM tags t
        JOIN interaction_tags it ON t.id = it.tag_id
        WHERE it.interaction_id = ?
      `).bind(interaction.id).all();
      
      const tags = tagResults.map((tag: any) => tag.name);
      
      return {
        ...interaction,
        tags
      };
    }));
    
    return NextResponse.json({ interactions }, { status: 200 });
  } catch (error) {
    console.error('Error fetching interactions:', error);
    return NextResponse.json({ error: 'Failed to fetch interactions' }, { status: 500 });
  }
}

// POST /api/interactions - Create a new interaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, date, notes, actions, contact_id, organization_id, tags } = body as Interaction;
    
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    
    const db = await getDB();
    
    // Start a transaction
    await db.exec('BEGIN');
    
    try {
      // Insert the interaction
      const interactionDate = date || new Date().toISOString();
      const result = await db.prepare(
        'INSERT INTO interactions (title, date, notes, actions, contact_id, organization_id) VALUES (?, ?, ?, ?, ?, ?) RETURNING *'
      ).bind(
        title,
        interactionDate,
        notes || null,
        actions || null,
        contact_id || null,
        organization_id || null
      ).run();
      
      const interaction = result.results[0];
      
      // Process tags if provided
      if (tags && tags.length > 0) {
        for (const tagName of tags) {
          // Check if tag exists, if not create it
          let tagResult = await db.prepare('SELECT id FROM tags WHERE name = ?').bind(tagName).run();
          let tagId;
          
          if (!tagResult.results || tagResult.results.length === 0) {
            // Create new tag
            const newTagResult = await db.prepare('INSERT INTO tags (name) VALUES (?) RETURNING id').bind(tagName).run();
            tagId = newTagResult.results[0].id;
          } else {
            tagId = tagResult.results[0].id;
          }
          
          // Create relationship between interaction and tag
          await db.prepare('INSERT INTO interaction_tags (interaction_id, tag_id) VALUES (?, ?)').bind(interaction.id, tagId).run();
        }
      }
      
      // Commit the transaction
      await db.exec('COMMIT');
      
      // Return the created interaction with tags
      return NextResponse.json({ 
        interaction: {
          ...interaction,
          tags: tags || []
        }
      }, { status: 201 });
    } catch (error) {
      // Rollback in case of error
      await db.exec('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error creating interaction:', error);
    return NextResponse.json({ error: 'Failed to create interaction' }, { status: 500 });
  }
}
