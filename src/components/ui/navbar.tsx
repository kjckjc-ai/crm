import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Personal CRM
          </Link>
          <div className="flex space-x-1 md:space-x-4">
            <Link href="/contacts" className="btn btn-secondary text-sm md:text-base">
              Contacts
            </Link>
            <Link href="/organizations" className="btn btn-secondary text-sm md:text-base">
              Organizations
            </Link>
            <Link href="/interactions" className="btn btn-secondary text-sm md:text-base">
              Interactions
            </Link>
            <Link href="/search" className="btn btn-primary text-sm md:text-base">
              Search
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
