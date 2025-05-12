import React, { useEffect, useState } from "react";
import { ContactEntryForm, type Category } from "./ContactEntryForm";
import { ContactDisplayTable } from "./ContactDisplayTable";
import { exampleCategories } from "./example-categories";

export interface ContactEntry {
  level1: string;
  level2: string;
  level3: string;
  comment: string;
  id?: string;
  timestamp?: number;
}

export const ContactApp: React.FC = () => {
  const [contacts, setContacts] = useState<ContactEntry[]>(() => {
    const saved = localStorage.getItem("contacts");
    return saved ? JSON.parse(saved) : [];
  });
  const [editContact, setEditContact] = useState<ContactEntry | null>(null);
  const categories: Category[] = exampleCategories;


  // Save contacts to localStorage whenever changed
  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }, [contacts]);

  const handleSave = (contactData: Omit<ContactEntry, "id" | "timestamp">) => {
    let newContact: ContactEntry;

    // If editing an existing contact
    if (editContact) {
      newContact = {
        ...contactData,
        id: editContact.id,
        timestamp: editContact.timestamp,
      };
      setContacts(prev =>
          [ ...prev.filter(c => c.id !== newContact.id), newContact ]
      );
      setEditContact(null);
    } else {
      newContact = {
        ...contactData,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      setContacts(prev => [ ...prev, newContact ]);
    }
  };

  const handleDelete = (id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
  };

  const handleEdit = (contact: ContactEntry) => {
    setEditContact(contact);
    // Remove contact from list temporarily
    setContacts(prev => prev.filter(c => c.id !== contact.id));
  };

  const handleCancel = () => {
    setEditContact(null);
  };

  return (
      <div className="contact-app-root">
        <h1>Contact Management</h1>
        <ContactEntryForm
            categories={categories}
            onSave={handleSave}
            onCancel={handleCancel}
            initialContact={editContact || undefined}
        />
        <ContactDisplayTable
            contacts={contacts}
            categories={categories}
            onDelete={handleDelete}
            onEdit={handleEdit}
        />

        {/* Inline style block for demonstration. Move to CSS for scalability */}
        <style>
          {`
        .contact-app-root {
          display: block;
          font-family: Arial, sans-serif;
          max-width: 1024px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          color: #333;
        }
        `}
        </style>
      </div>
  );
};