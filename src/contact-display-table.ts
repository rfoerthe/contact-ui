// Vanilla Web Component version of contact-display-table.ts

interface Category {
	id: string;
	name: string;
	children?: Category[];
}

interface ContactEntry {
	level1: string;
	level2: string;
	level3: string;
	comment: string;
	id?: string;
	timestamp?: number;
}

class ContactDisplayTable extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.handleDelete = this.handleDelete.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
	}

	private _contacts: ContactEntry[] = [];

	get contacts(): ContactEntry[] {
		return this._contacts;
	}

	set contacts(value: ContactEntry[]) {
		this._contacts = value;
		this.render();
	}

	private _categories: Category[] = [];

	get categories(): Category[] {
		return this._categories;
	}

	set categories(value: Category[]) {
		this._categories = value;
		this.render();
	}

	connectedCallback() {
		this.render();
	}

	render() {
		if (!this.shadowRoot) return;
		this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
          color: #333;
        }
        
        .table-container {
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 20px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          margin-top: 20px;
        }
        
        h2 {
          margin-top: 0;
          margin-bottom: 16px;
          color: #444;
          font-size: 18px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
        
        th {
          text-align: left;
          background-color: #f5f5f5;
          padding: 10px;
          font-weight: bold;
          border-bottom: 2px solid #ddd;
        }
        
        td {
          padding: 10px;
          border-bottom: 1px solid #ddd;
          vertical-align: top;
        }
        
        .category-path {
          font-weight: bold;
        }
        
        .comment {
          white-space: pre-wrap;
          color: #555;
        }
        
        .empty-state {
          text-align: center;
          padding: 40px;
          color: #888;
          font-style: italic;
        }
        
        .actions {
          display: flex;
          gap: 8px;
        }
        
        button {
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }
        
        .delete-btn {
          background-color: #f44336;
          color: white;
          border: none;
        }
        
        .edit-btn {
          background-color: #2196F3;
          color: white;
          border: none;
        }
      </style>
      <div class="table-container">
        <h2>Contact Entries</h2>
        ${this.contacts.length === 0
				? `<div class="empty-state">No contact entries yet. Use the form to add some.</div>`
				: `
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Comment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${this.contacts.map((contact, idx) => `
                <tr>
                  <td class="category-path">${this.getCategoryPath(contact)}</td>
                  <td class="comment">${contact.comment || ""}</td>
                  <td>
                    <div class="actions">
                      <button class="edit-btn" type="button" data-idx="${idx}">Edit</button>
                      <button class="delete-btn" type="button" data-idx="${idx}">Delete</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `}
      </div>
    `;

		// Attach event listeners for edit/delete buttons
		const shadow = this.shadowRoot;
		shadow?.querySelectorAll('.edit-btn').forEach(btn =>
				btn.addEventListener('click', this.handleEdit));
		shadow?.querySelectorAll('.delete-btn').forEach(btn =>
				btn.addEventListener('click', this.handleDelete));
	}

	private getCategoryName(id: string): string {
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

	private getCategoryPath(contact: ContactEntry): string {
		const parts = [];
		if (contact.level1) parts.push(this.getCategoryName(contact.level1));
		if (contact.level2) parts.push(this.getCategoryName(contact.level2));
		if (contact.level3) parts.push(this.getCategoryName(contact.level3));
		return parts.join(' > ') || 'Uncategorized';
	}

	private handleDelete(e: Event) {
		const idx = (e.target as HTMLButtonElement).dataset.idx;
		if (idx === undefined) return;
		const contact = this.contacts[Number(idx)];
		const id = contact?.id || "";
		this.dispatchEvent(new CustomEvent('delete-contact', {
			detail: {id},
			bubbles: true,
			composed: true
		}));
	}

	private handleEdit(e: Event) {
		const idx = (e.target as HTMLButtonElement).dataset.idx;
		if (idx === undefined) return;
		const contact = this.contacts[Number(idx)];
		if (!contact) return;
		this.dispatchEvent(new CustomEvent('edit-contact', {
			detail: {contact},
			bubbles: true,
			composed: true
		}));
	}
}

customElements.define('contact-display-table', ContactDisplayTable);

declare global {
	interface HTMLElementTagNameMap {
		'contact-display-table': ContactDisplayTable;
	}
}