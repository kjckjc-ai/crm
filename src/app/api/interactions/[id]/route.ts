import { NextRequest, NextResponse } from 'next/server';
import { getDB, Interaction, updateTimestamp } from '@/lib/db';

// GET /api/interactions/[id] - Get a specific interaction
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
    
    // Get the interaction with contact and organization details
    const result = await db.prepare(`
      SELECT 
        i.*,
        c.name as contact_name,
        o.name as organization_name,
        o.type as organization_type
      FROM interactions i
      LEFT JOIN contacts c ON i.contact_id = c.id
      LEFT JOIN organizations o ON i.organization_id = o.id
      WHERE i.id = ?
    `).bind(id).run();
    
    if (!result.results || result.results.length === 0) {
      return NextResponse.json({ error: 'Interaction not found' }, { status: 404 });
    }
    
    const interaction = result.results[0];
    
    // Get tags for this interaction
    const { results: tagResults } = await db.prepare(`
      SELECT t.name
      FROM tags t
      JOIN interaction_tags it ON t.id = it.tag_id
      WHERE it.interaction_id = ?
    `).bind(id).all();
    
    const tags = tagResults.map((tag: any) => tag.name);
    
    return NextResponse.json({ 
      interaction: {
        ...interaction,
        tags
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching interaction:', error);
    return NextResponse.json({ error: 'Failed to fetch interaction' }, { status: 500 });
  }
}

// PUT /api/interactions/[id] - Update an interaction
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
    const { title, date, notes, actions, contact_id, organization_id, tags } = body as Interaction;
    
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    
    const db = await getDB();
    
    // Start a transaction
    await db.exec('BEGIN');
    
    try {
      // Update the interaction
      const updatedInteraction = updateTimestamp({ 
        title, 
        date: date || new Date().toISOString(), 
        notes, 
        actions, 
        contact_id, 
        organization_id 
      });
      
      const result = await db.prepare(`
        UPDATE interactions 
        SET title = ?, date = ?, notes = ?, actions = ?, contact_id = ?, organization_id = ?, updated_at = ? 
        WHERE id = ? 
        RETURNING *
      `).bind(
        updatedInteraction.title,
        updatedInteraction.date,
        updatedInteraction.notes || null,
        updatedInteraction.actions || null,
        updatedInteraction.contact_id || null,
        updatedInteraction.organization_id || null,
        updatedInteraction.updated_at,
        id
      ).run();
      
      if (!result.results || result.results.length === 0) {
        await db.exec('ROLLBACK');
        return NextResponse.json({ error: 'Interaction not found' }, { status: 404 });
      }
      
      const interaction = result.results[0];
      
      // If tags are provided, update them
      if (tags) {
        // Remove existing tag relationships
        await db.prepare('DELETE FROM interaction_tags WHERE interaction_id = ?').bind(id).run();
        
        // Add new tags
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
      
      // Return the updated interaction with tags
      return NextResponse.json({ 
        interaction: {
          ...interaction,
          tags: tags || []
        }
      }, { status: 200 });
    } catch (error) {
      // Rollback in case of error
      await db.exec('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error updating interaction:', error);
    return NextResponse.json({ error: 'Failed to update interaction' }, { status: 500 });
  }
}

// DELETE /api/interactions/[id] - Delete an interaction
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
    
    // Start a transaction
    await db.exec('BEGIN');
    
    try {
      // Delete tag relationships first
      await db.prepare('DELETE FROM interaction_tags WHERE interaction_id = ?').bind(id).run();
      
      // Then delete the interaction
      const result = await db.prepare('DELETE FROM interactions WHERE id = ? RETURNING id').bind(id).run();
      
      if (!result.results || result.results.length === 0) {
        await db.exec('ROLLBACK');
        return NextResponse.json({ error: 'Interaction not found' }, { status: 404 });
      }
      
      // Commit the transaction
      await db.exec('COMMIT');
      
      return NextResponse.json({ message: 'Interaction deleted successfully' }, { status: 200 });
    } catch (error) {
      // Rollback in case of error
      await db.exec('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error deleting interaction:', error);
    return NextResponse.json({ error: 'Failed to delete interaction' }, { status: 500 });
  }
}
