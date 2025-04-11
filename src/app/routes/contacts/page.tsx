"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // This would be replaced with actual data fetching in a useEffect
  
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <Link href="/contacts/new" className="btn btn-primary">
          Add Contact
        </Link>
      </div>
      
      <div className="card">
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
                  Position
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Loading contacts...
                  </td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No contacts found. Add your first contact to get started.
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
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
                      {contact.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link href={`/contacts/${contact.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                        View
                      </Link>
                      <Link href={`/contacts/${contact.id}/edit`} className="text-green-600 hover:text-green-900">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
