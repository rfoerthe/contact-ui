// Vanilla Web Component version of contact-app.ts
import {exampleCategories} from './example-categories';
import './contact-entry-form.ts'
import './contact-display-table.ts'

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

class ContactApp extends HTMLElement {
	private contacts: ContactEntry[] = [];
	private categories: Category[] = exampleCategories;

	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.handleSave = this.handleSave.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
	}

	connectedCallback() {
		this.loadContacts();
		this.render();
		this.attachEvents();
	}

	render() {
		if (!this.shadowRoot) return;
		this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
          max-width: 1024px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
    		color: #333;
    		margin-bottom: 10px;
		}
		h2.sub-title {
			color: #333;
			font-size: 14px;
			font-style: italic;
		}
      </style>
      <h1>Contact Management</h1>
      <h2 class="sub-title">Based on vanilla Web Components, TypeScript and Vite</h2>

      <contact-entry-form></contact-entry-form>
      <contact-display-table></contact-display-table>
    `;

		// Pass categories and contacts to the forms/tables (ensure web components receive data)
		const form = this.shadowRoot.querySelector('contact-entry-form') as any;
		if (form) form.categories = this.categories;

		const table = this.shadowRoot.querySelector('contact-display-table') as any;
		if (table) {
			table.contacts = this.contacts;
			table.categories = this.categories;
		}
	}

	private loadContacts() {
		const saved = localStorage.getItem('contacts');
		if (saved) {
			try {
				this.contacts = JSON.parse(saved);
			} catch {
				this.contacts = [];
			}
		} else {
			this.contacts = [];
		}
	}

	private saveContacts() {
		localStorage.setItem('contacts', JSON.stringify(this.contacts));
		this.render();
		this.attachEvents();
	}

	private handleSave(e: Event) {
		const customEvent = e as CustomEvent;
		const contactData = customEvent.detail;
		const newContact: ContactEntry = {
			...contactData,
			id: Date.now().toString(),
			timestamp: Date.now()
		};
		this.contacts = [...this.contacts, newContact];
		this.saveContacts();
	}

	private handleDelete(e: Event) {
		const customEvent = e as CustomEvent;
		const {id} = customEvent.detail;
		this.contacts = this.contacts.filter(contact => contact.id !== id);
		this.saveContacts();
	}

	private handleEdit(e: Event) {
		const customEvent = e as CustomEvent;
		const {contact} = customEvent.detail;
		this.contacts = this.contacts.filter(c => c.id !== contact.id);
		this.saveContacts();
		// Load contact into the form
		const form = (this.shadowRoot?.querySelector('contact-entry-form') as any);
		if (form && typeof form.loadContact === 'function') {
			form.loadContact(contact);
		}
	}

	private attachEvents() {
		const form = this.shadowRoot?.querySelector('contact-entry-form');
		const table = this.shadowRoot?.querySelector('contact-display-table');
		form?.removeEventListener('save', this.handleSave); // Prevent double binding
		form?.addEventListener('save', this.handleSave);

		table?.removeEventListener('delete-contact', this.handleDelete);
		table?.removeEventListener('edit-contact', this.handleEdit);
		table?.addEventListener('delete-contact', this.handleDelete);
		table?.addEventListener('edit-contact', this.handleEdit);
	}
}

customElements.define('contact-app', ContactApp);

declare global {
	interface HTMLElementTagNameMap {
		'contact-app': ContactApp;
	}
}