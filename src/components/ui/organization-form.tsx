"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function OrganizationForm({ organization = null }) {
  const [formData, setFormData] = useState({
    name: organization?.name || '',
    type: organization?.type || 'school',
    address: organization?.address || '',
    website: organization?.website || '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!['school', 'trust', 'organization'].includes(formData.type)) {
      newErrors.type = 'Please select a valid type';
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
      // This would be replaced with actual API call
      console.log('Submitting:', formData);
      
      // Redirect to organizations list after successful submission
      // window.location.href = '/organizations';
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="label">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`input ${errors.name ? 'border-red-500' : ''}`}
          placeholder="Enter organization name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="type" className="label">
          Type <span className="text-red-500">*</span>
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className={`input ${errors.type ? 'border-red-500' : ''}`}
        >
          <option value="school">School</option>
          <option value="trust">Trust</option>
          <option value="organization">Organization</option>
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="address" className="label">
          Address
        </label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="input"
          placeholder="Enter address"
          rows={3}
        />
      </div>
      
      <div>
        <label htmlFor="website" className="label">
          Website
        </label>
        <input
          type="url"
          id="website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          className="input"
          placeholder="Enter website URL"
        />
      </div>
      
      <div className="flex justify-end space-x-3">
        <Link href="/organizations" className="btn btn-secondary">
          Cancel
        </Link>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : organization ? 'Update Organization' : 'Create Organization'}
        </button>
      </div>
    </form>
  );
}
