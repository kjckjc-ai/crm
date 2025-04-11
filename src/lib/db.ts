// Simplified DB access for local development
export const getDB = async () => {
  // This would normally use Cloudflare's context
  // For now, we'll use a simplified approach for deployment
  return null;
};

export interface Contact {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Organization {
  id?: number;
  name: string;
  type: 'school' | 'trust' | 'organization';
  address?: string;
  website?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Interaction {
  id?: number;
  title: string;
  date: string;
  notes?: string;
  actions?: string;
  contact_id?: number;
  organization_id?: number;
  created_at?: string;
  updated_at?: string;
  tags?: string[];
  contact?: Contact;
  organization?: Organization;
}

export interface Tag {
  id?: number;
  name: string;
  created_at?: string;
}

// Helper function to format date to ISO string
export function formatDate(date: Date = new Date()): string {
  return date.toISOString();
}

// Helper function to update the updated_at timestamp
export function updateTimestamp(data: any): any {
  return {
    ...data,
    updated_at: formatDate()
  };
}
