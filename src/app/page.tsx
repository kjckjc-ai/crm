import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col space-y-8">
      <div className="card">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">Personal CRM Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/contacts" className="card bg-blue-50 hover:bg-blue-100 transition-colors p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Contacts</h2>
            <p className="text-gray-600">Manage your personal and professional contacts</p>
          </Link>
          
          <Link href="/organizations" className="card bg-green-50 hover:bg-green-100 transition-colors p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Organizations</h2>
            <p className="text-gray-600">Track schools, trusts, and other organizations</p>
          </Link>
          
          <Link href="/interactions" className="card bg-purple-50 hover:bg-purple-100 transition-colors p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Interactions</h2>
            <p className="text-gray-600">Record meetings, calls, and other interactions</p>
          </Link>
        </div>
      </div>
      
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Quick Search</h2>
        <div className="flex">
          <input 
            type="text" 
            placeholder="Search contacts, organizations, or interactions..." 
            className="input flex-grow"
          />
          <Link href="/search" className="btn btn-primary ml-2">
            Search
          </Link>
        </div>
      </div>
      
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-500 italic">No recent activity to display.</p>
      </div>
    </div>
  );
}
