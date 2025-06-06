import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import type {Category, ContactEntry} from "./types.ts";
import {contactDisplayTableStyles} from "./contact-display-table-styles.ts";

@customElement('contact-display-table')
export class ContactDisplayTable extends LitElement {
	static styles = contactDisplayTableStyles;

	@property({type: Array})
	contacts: ContactEntry[] = [];

	@property({type: Array})
	categories: Category[] = [];

	@property({type: String})
	editContactId?: string;

	// Helper method to find category name by id
	private getCategoryName(id: string): string {
		// Recursive function to search through all category levels
		const findCategory = (cats: Category[]): string => {
			for (const cat of cats) {
				if (cat.id === id) return cat.name;
				if (cat.children && cat.children.length > 0) {
					const found = findCategory(cat.children);
					if (found) return found;
				}
			}
			return '';
		};

		return findCategory(this.categories) || 'Unknown';
	}

	// Generate the category path string
	private getCategoryPath(contact: ContactEntry): string {
		const parts = [];

		if (contact.level1) {
			parts.push(this.getCategoryName(contact.level1));
		}

		if (contact.level2) {
			parts.push(this.getCategoryName(contact.level2));
		}

		if (contact.level3) {
			parts.push(this.getCategoryName(contact.level3));
		}

		return parts.join(' > ') || 'Uncategorized';
	}

	private handleDelete(contact: ContactEntry) {
		const id = contact.id || ""
		this.dispatchEvent(new CustomEvent('delete-contact', {
			detail: id
		}));
	}

	private handleEdit(contact: ContactEntry) {
		this.dispatchEvent(new CustomEvent('edit-contact', {
			detail: contact
		}));
	}

	render() {
		return html`
			<div class="table-container">
				<h2>Contact Entries</h2>

				${this.contacts.length === 0
								? html`
									<div class="empty-state">No contact entries yet. Use the form to add some.</div>`
								: html`
									<table>
										<thead>
										<tr>
											<th>Category</th>
											<th>Comment</th>
											<th class="actions-head">Actions</th>
										</tr>
										</thead>
										<tbody>
										${[...this.contacts]
														.sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0))
														.map(contact => html`
															<tr class="${this.editContactId === contact.id ? "edit" : ""}">
																<td class="category-path">${this.getCategoryPath(contact)}</td>
																<td class="comment">${contact.comment}</td>
																<td>
																	<div class="actions">
																		<button class="edit-btn" @click=${() => this.handleEdit(contact)}>Edit</button>
																		<button class="delete-btn" @click=${() => this.handleDelete(contact)}>Delete</button>
																	</div>
																</td>
															</tr>
														`)}
										</tbody>
									</table>
								`}
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'contact-display-table': ContactDisplayTable;
	}
}