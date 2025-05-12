import React, {useEffect, useState} from "react";
import {ContactEntryForm} from "./ContactEntryForm";
import {ContactDisplayTable} from "./ContactDisplayTable";
import {exampleCategories} from "./example-categories";
import type {Category, ContactEntry} from "./types.ts";
import './ContactApp.css';

export const ContactApp: React.FC = () => {
	const [contacts, setContacts] = useState<ContactEntry[]>(() => {
		const saved = localStorage.getItem("contacts");
		return saved ? JSON.parse(saved) : [];
	});
	const categories: Category[] = exampleCategories;

	// form state
	const [level1, setLevel1] = useState<string>("");
	const [level2, setLevel2] = useState<string>("");
	const [level3, setLevel3] = useState<string>("");
	const [comment, setComment] = useState<string>("");

	const [editContact, setEditContact] = useState<ContactEntry | null>(null);

	const clearContactEntryState = (): void => {
		setLevel1("");
		setLevel2("");
		setLevel3("");
		setComment("");
	}

	// copy values, when entering edit mode
	React.useEffect(() => {
		if (editContact) {
			setLevel1(editContact.level1 || "");
			setLevel2(editContact.level2 || "");
			setLevel3(editContact.level3 || "");
			setComment(editContact.comment || "");
		} else {
			clearContactEntryState();
		}
	}, [editContact]);


	// Save contacts to localStorage whenever changed
	useEffect(() => {
		localStorage.setItem("contacts", JSON.stringify(contacts));
	}, [contacts]);

	const handleSave = () => {
		let newContact: ContactEntry;
		if (editContact) {
			newContact = {
				level1, level2, level3, comment,
				id: editContact.id,
				timestamp: editContact.timestamp,
			};
			setContacts(prev =>
					[...prev.filter(c => c.id !== newContact.id), newContact]
			);
			setEditContact(null);
		} else {
			newContact = {
				level1, level2, level3, comment,
				id: Date.now().toString(),
				timestamp: Date.now(),
			};
			setContacts(prev => [...prev, newContact]);
		}
		clearContactEntryState();
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
		setEditContact(null);
	};

	return (
			<div className="contact-app-root">
				<h1>Contact Management</h1>
				<ContactEntryForm
						categories={categories}
						level1={level1}
						setLevel1={setLevel1}
						level2={level2}
						setLevel2={setLevel2}
						level3={level3}
						setLevel3={setLevel3}
						comment={comment}
						setComment={setComment}
						onSave={handleSave}
						onCancel={handleCancel}
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