"use client";

import { useState } from 'react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // This would be replaced with actual API call
      // const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      // const data = await response.json();
      // setResults(data.results);
      
      // Placeholder for now
      setResults({
        contacts: [],
        organizations: [],
        interactions: []
      });
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col space-y-6">
      <h1 className="text-2xl font-bold">Search</h1>
      
      <div className="card">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input flex-grow"
            placeholder="Search for contacts, organizations, or interactions..."
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
        
        <div className="text-sm text-gray-500 mt-2">
          Search by name, email, organization, or tags
        </div>
      </div>
      
      {results && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Contacts</h2>
            {results.contacts.length === 0 ? (
              <p className="text-gray-500">No contacts found matching your search.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.contacts.map((contact) => (
                      <tr key={contact.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {contact.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {contact.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {contact.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <a href={`/contacts/${contact.id}`} className="text-blue-600 hover:text-blue-900">
                            View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Organizations</h2>
            {results.organizations.length === 0 ? (
              <p className="text-gray-500">No organizations found matching your search.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.organizations.map((org) => (
                      <tr key={org.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {org.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {org.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <a href={`/organizations/${org.id}`} className="text-blue-600 hover:text-blue-900">
                            View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Interactions</h2>
            {results.interactions.length === 0 ? (
              <p className="text-gray-500">No interactions found matching your search.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact/Organization
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.interactions.map((interaction) => (
                      <tr key={interaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {interaction.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(interaction.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {interaction.contact_name || ''} 
                          {interaction.contact_name && interaction.organization_name ? ' / ' : ''}
                          {interaction.organization_name || ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <a href={`/interactions/${interaction.id}`} className="text-blue-600 hover:text-blue-900">
                            View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
