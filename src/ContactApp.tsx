import React, {useEffect, useState} from "react";
import {ContactEntryForm} from "./ContactEntryForm";
import {ContactDisplayTable} from "./ContactDisplayTable";
import {exampleCategories} from "./example-categories";
import type {Category, ContactEntry} from "./types";
import './ContactApp.css';

export const ContactApp: React.FC = () => {
	const [contacts, setContacts] = useState<ContactEntry[]>(() => {
		const saved = localStorage.getItem("contacts");
		return saved ? JSON.parse(saved) : [];
	});

	const categories: Category[] = exampleCategories;

	const [editContact, setEditContact] = useState<ContactEntry | null>(null);

	// Save contacts to localStorage whenever changed
	useEffect(() => {
		localStorage.setItem("contacts", JSON.stringify(contacts));
	}, [contacts]);

	const handleSave = (contactEntry: ContactEntry) => {
		let newContact: ContactEntry;
		if (editContact) {
			newContact = {
				...contactEntry,
				id: editContact.id,
				timestamp: editContact.timestamp,
			};
			setContacts(prev =>
					[...prev.filter(c => c.id !== newContact.id), newContact]
			);
			setEditContact(null);
		} else {
			newContact = {
				...contactEntry,
				id: Date.now().toString(),
				timestamp: Date.now(),
			};
			setContacts(prev => [...prev, newContact]);
		}
	};

	const handleEdit = (contact: ContactEntry) => {
		setEditContact(contact);
		// Remove contact
		setContacts(prev => prev.filter(c => c.id !== contact.id));
	};

	const handleDelete = (id: string) => {
		setContacts(prev => prev.filter(contact => contact.id !== id));
	};

	const handleCancel = () => {
		if (editContact) {
			// add contact again (unchanged)
			setContacts(prev =>
				[...prev.filter(c => c.id !== editContact.id), editContact]
			);
		}
		setEditContact(null);
	};

	return (
			<div className="contact-app-root">
				<h1>Contact Management</h1>
				<h2 className="sub-title">Based on React, TypeScript and Vite</h2>
				<ContactEntryForm
						categories={categories}
						onSave={handleSave}
						onCancel={handleCancel}
						editContact={editContact}
				/>
				<ContactDisplayTable
						contacts={contacts}
						categories={categories}
						onDelete={handleDelete}
						onEdit={handleEdit}
				/>
			</div>
	);
};