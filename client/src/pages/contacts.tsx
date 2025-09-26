import React, { useState, useEffect } from "react";
import { Search, UserPlus, Phone, Mail, Users } from "lucide-react";

type Contact = {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
};

const mockContacts: Contact[] = [
  { id: '1', name: 'Alex Johnson', phone: '+1 (555) 123-4567', email: 'alex.johnson@example.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D' },
  { id: '2', name: 'Taylor Smith', phone: '+1 (555) 987-6543', email: 'taylor.smith@example.com', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fHVzZXJ8ZW58MHx8MHx8fDA%3D' },
  { id: '3', name: 'Jordan Williams', phone: '+1 (555) 456-7890', email: 'jordan.w@example.com', avatar: 'https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTN8fHVzZXJ8ZW58MHx8MHx8fDA%3D' },
  { id: '4', name: 'Casey Davis', phone: '+1 (555) 234-5678', email: 'casey.davis@example.com', avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHVzZXJ8ZW58MHx8MHx8fDA%3D' },
  { id: '5', name: 'Riley Brown', phone: '+1 (555) 876-5432', email: 'riley.brown@example.com', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fHVzZXJ8ZW58MHx8MHx8fDA%3D' },
  { id: '6', name: 'Morgan Lee', phone: '+1 (555) 345-6789', email: 'morgan.lee@example.com', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTd8fHVzZXJ8ZW58MHx8MHx8fDA%3D' },
  { id: '7', name: 'Jamie Miller', phone: '+1 (555) 765-4321', email: 'jamie.miller@example.com', avatar: 'https://images.unsplash.com/photo-1578445714074-946b536079aa?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fFByb2Zlc3Npb25hbCUyMGF2YXRhciUyMHdpdGglMjBnbGFzc2VzfGVufDB8fDB8fHww' },
  { id: '8', name: 'Quinn Garcia', phone: '+1 (555) 567-8901', email: 'quinn.garcia@example.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D' },
];

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(mockContacts);
  // no in-file navigation required yet

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredContacts(contacts);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredContacts(
        contacts.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.phone.includes(q) ||
            c.email.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, contacts]);

  const importContactsFromDevice = () => {
    // placeholder: real device contact import requires native permissions
    alert('Import from device would be implemented with native permissions.');
    const newContacts: Contact[] = [
      { id: '9', name: 'Sam Wilson', phone: '+1 (555) 111-2222', email: 'sam.wilson@example.com', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fHVzZXJ8ZW58MHx8MHx8fDA%3D' },
      { id: '10', name: 'Jordan Taylor', phone: '+1 (555) 333-4444', email: 'jordan.taylor@example.com', avatar: 'https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTN8fHVzZXJ8ZW58MHx8MHx8fDA%3D' },
    ];
    setContacts((prev) => [...prev, ...newContacts]);
  };

  const renderContact = (contact: Contact) => (
  <div key={contact.id} className="flex items-center p-4 bg-card rounded-xl mb-3 shadow-sm border border-border">
      <img src={contact.avatar} alt={contact.name} className="w-14 h-14 rounded-full mr-4 object-cover" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-card-foreground">{contact.name}</h3>
        </div>
  <div className="flex items-center mt-1 text-sm text-muted-foreground">
          <Phone size={14} color="#3498DB" className="mr-2" />
          <span>{contact.phone}</span>
        </div>
  <div className="flex items-center mt-1 text-sm text-muted-foreground">
          <Mail size={14} color="#3498DB" className="mr-2" />
          <span>{contact.email}</span>
        </div>
      </div>
    </div>
  );

  return (
  <div className="flex-1 bg-background min-h-screen text-foreground mobile-safe-container">
  <div className="bg-card pt-12 pb-6 px-4 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-card-foreground">Contacts</h2>
          <button
            className="bg-primary hover:bg-primary/90 rounded-full p-3"
            onClick={() => importContactsFromDevice()}
            aria-label="Import contacts"
          >
            <UserPlus size={20} className="text-primary-foreground" />
          </button>
        </div>

  <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-3">
          <Search size={20} color="#7F8C8D" className="mr-2" />
          <input
            className="flex-1 bg-transparent outline-none text-gray-700 dark:text-gray-100"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

  <div className="flex-row justify-between px-4 py-3 bg-white dark:bg-gray-800 mb-4 flex items-center">
        <div className="flex items-center">
          <Users size={18} color="#3498DB" className="mr-2" />
    <span className="text-gray-700 dark:text-gray-200">{contacts.length} contacts</span>
        </div>
  <button className="text-blue-500 dark:text-blue-300 font-medium" onClick={importContactsFromDevice}>Import from device</button>
      </div>

  <div className="px-4 pb-8">
        {filteredContacts.length > 0 ? (
          <div className="">
            {filteredContacts.map((c) => renderContact(c))}
          </div>
        ) : (
          <div className="flex-1 items-center justify-center text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No contacts found</p>
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-full px-6 py-3 text-white font-medium"
              onClick={importContactsFromDevice}
            >
              Import Contacts
            </button>
          </div>
        )}
      </div>
      {/* Safe area bottom padding */}
      <div className="pb-[env(safe-area-inset-bottom)]"></div>
    </div>
  );
}
