-- Migration number: 0001 	 2025-04-11
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS organizations;
DROP TABLE IF EXISTS interactions;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS interaction_tags;

-- Contacts table to store individual contact information
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  position TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Organizations table to store school/trust/organization information
CREATE TABLE IF NOT EXISTS organizations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'school', 'trust', or 'organization'
  address TEXT,
  website TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Interactions table to store meetings, calls, emails, etc.
CREATE TABLE IF NOT EXISTS interactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  actions TEXT,
  contact_id INTEGER,
  organization_id INTEGER,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contact_id) REFERENCES contacts(id),
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- Tags table for storing related_to values
CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Junction table for many-to-many relationship between interactions and tags
CREATE TABLE IF NOT EXISTS interaction_tags (
  interaction_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (interaction_id, tag_id),
  FOREIGN KEY (interaction_id) REFERENCES interactions(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Create indexes for faster searching
CREATE INDEX idx_contacts_name ON contacts(name);
CREATE INDEX idx_organizations_name ON organizations(name);
CREATE INDEX idx_organizations_type ON organizations(type);
CREATE INDEX idx_interactions_date ON interactions(date);
CREATE INDEX idx_interactions_contact_id ON interactions(contact_id);
CREATE INDEX idx_interactions_organization_id ON interactions(organization_id);
CREATE INDEX idx_tags_name ON tags(name);
