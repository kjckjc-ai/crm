"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function ContactForm({ contact = null }) {
  const [formData, setFormData] = useState({
    name: contact?.name || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    position: contact?.position || '',
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
      
      // Redirect to contacts list after successful submission
      // window.location.href = '/contacts';
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
          placeholder="Enter contact name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="email" className="label">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="input"
          placeholder="Enter email address"
        />
      </div>
      
      <div>
        <label htmlFor="phone" className="label">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="input"
          placeholder="Enter phone number"
        />
      </div>
      
      <div>
        <label htmlFor="position" className="label">
          Position
        </label>
        <input
          type="text"
          id="position"
          name="position"
          value={formData.position}
          onChange={handleChange}
          className="input"
          placeholder="Enter position or role"
        />
      </div>
      
      <div className="flex justify-end space-x-3">
        <Link href="/contacts" className="btn btn-secondary">
          Cancel
        </Link>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : contact ? 'Update Contact' : 'Create Contact'}
        </button>
      </div>
    </form>
  );
}
