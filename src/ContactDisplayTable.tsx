import React from "react";
import type {Category, ContactEntry} from "./types.ts";
import './ContactDisplayTable.css';

interface ContactDisplayTableProps {
	contacts: ContactEntry[];
	categories: Category[];
	onDelete: (id: string) => void;
	onEdit: (contact: ContactEntry) => void;
}

export const ContactDisplayTable: React.FC<ContactDisplayTableProps> = ({contacts, categories, onDelete, onEdit,}) => {
	// Helper: recursively find a category's name by id
	const getCategoryName = (id: string): string => {
		const findCategory = (cats: Category[]): string => {
			for (const cat of cats) {
				if (cat.id === id) return cat.name;
				if (cat.children && cat.children.length > 0) {
					const found = findCategory(cat.children);
					if (found) return found;
				}
			}
			return "";
		};
		return findCategory(categories) || "Unknown";
	};

	// Aggregate category path
	const getCategoryPath = (contact: ContactEntry) => {
		const parts = [];
		if (contact.level1) parts.push(getCategoryName(contact.level1));
		if (contact.level2) parts.push(getCategoryName(contact.level2));
		if (contact.level3) parts.push(getCategoryName(contact.level3));
		return parts.join(" > ") || "Uncategorized";
	};

	return (
			<div className="table-container">
				<h2>Contact Entries</h2>
				{contacts.length === 0 ? (
						<div className="empty-state">
							No contact entries yet. Use the form to add some.
						</div>
				) : (
						<table>
							<thead>
							<tr>
								<th>Category</th>
								<th>Comment</th>
								<th>Actions</th>
							</tr>
							</thead>
							<tbody>
							{contacts.map((contact) => (
									<tr key={contact.id}>
										<td className="category-path">{getCategoryPath(contact)}</td>
										<td className="comment">{contact.comment}</td>
										<td>
											<div className="actions">
												<button
														className="edit-btn"
														onClick={() => onEdit(contact)}
												>
													Edit
												</button>
												<button
														className="delete-btn"
														onClick={() => contact.id && onDelete(contact.id)}
												>
													Delete
												</button>
											</div>
										</td>
									</tr>
							))}
							</tbody>
						</table>
				)}
			</div>
	);
};