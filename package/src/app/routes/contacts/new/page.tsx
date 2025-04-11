import Link from 'next/link';
import ContactForm from '@/components/ui/contact-form';

export default function NewContactPage() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center">
        <Link href="/contacts" className="text-blue-600 hover:text-blue-800 mr-2">
          &larr; Back to Contacts
        </Link>
        <h1 className="text-2xl font-bold">Add New Contact</h1>
      </div>
      
      <div className="card">
        <ContactForm />
      </div>
    </div>
  );
}
