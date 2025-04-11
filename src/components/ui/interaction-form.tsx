"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function InteractionForm({ interaction = null }) {
  const [formData, setFormData] = useState({
    title: interaction?.title || '',
    date: interaction?.date ? new Date(interaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    notes: interaction?.notes || '',
    actions: interaction?.actions || '',
    contact_id: interaction?.contact_id || '',
    organization_id: interaction?.organization_id || '',
    tags: interaction?.tags?.join(', ') || '',
  });
  
  const [contacts, setContacts] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // This would be replaced with actual data fetching in a useEffect
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Process tags from comma-separated string to array
      const processedData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      // This would be replaced with actual API call
      console.log('Submitting:', processedData);
      
      // Redirect to interactions list after successful submission
      // window.location.href = '/interactions';
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="label">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`input ${errors.title ? 'border-red-500' : ''}`}
          placeholder="Enter interaction title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="date" className="label">
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="input"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact_id" className="label">
            Contact
          </label>
          <select
            id="contact_id"
            name="contact_id"
            value={formData.contact_id}
            onChange={handleChange}
            className="input"
          >
            <option value="">Select a contact</option>
            {contacts.map(contact => (
              <option key={contact.id} value={contact.id}>
                {contact.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="organization_id" className="label">
            Organization
          </label>
          <select
            id="organization_id"
            name="organization_id"
            value={formData.organization_id}
            onChange={handleChange}
            className="input"
          >
            <option value="">Select an organization</option>
            {organizations.map(org => (
              <option key={org.id} value={org.id}>
                {org.name} ({org.type})
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="tags" className="label">
          Related to (comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="input"
          placeholder="Enter comma-separated tags (e.g., meeting, follow-up, project)"
        />
      </div>
      
      <div>
        <label htmlFor="notes" className="label">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="input"
          placeholder="Enter detailed notes"
          rows={5}
        />
      </div>
      
      <div>
        <label htmlFor="actions" className="label">
          Actions
        </label>
        <textarea
          id="actions"
          name="actions"
          value={formData.actions}
          onChange={handleChange}
          className="input"
          placeholder="Enter follow-up actions"
          rows={3}
        />
      </div>
      
      <div className="flex justify-end space-x-3">
        <Link href="/interactions" className="btn btn-secondary">
          Cancel
        </Link>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : interaction ? 'Update Interaction' : 'Create Interaction'}
        </button>
      </div>
    </form>
  );
}
