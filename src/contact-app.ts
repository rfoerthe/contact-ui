import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { exampleCategories } from './example-categories';
import './contact-entry-form';
import './contact-display-table';

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

@customElement('contact-app')
export class ContactApp extends LitElement {
  static styles = css`
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
  `;

  static categories: Category[] = exampleCategories;

  @state()
  private contacts: ContactEntry[] = [];


  firstUpdated() {
    // Load contacts from localStorage
    const savedContacts = localStorage.getItem('contacts');
    if (savedContacts) {
      this.contacts = JSON.parse(savedContacts);
    }
  }

  private handleSave(e: CustomEvent) {
    const contactData = e.detail;
    const newContact: ContactEntry = {
      ...contactData,
      id: Date.now().toString(),
      timestamp: Date.now()
    };
    this.contacts = [...this.contacts, newContact];
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }

  private handleDelete(e: CustomEvent) {
    const { id } = e.detail;
    this.contacts = this.contacts.filter(contact => contact.id !== id);
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }

  private handleEdit(e: CustomEvent) {
    const { contact } = e.detail;
    // Remove the contact to be edited
    this.contacts = this.contacts.filter(c => c.id !== contact.id);
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
    // Load contact into the form
    const entryForm = this.renderRoot?.querySelector('contact-entry-form');
    entryForm?.loadContact(contact);
  }

  render() {
    return html`
      <h1>Contact Management</h1>
	  <h2 class="sub-title">Based on Lit, TypeScript and Vite</h2>
      <contact-entry-form
        .categories=${ContactApp.categories}
        @save=${this.handleSave}
      ></contact-entry-form>
      <contact-display-table
        .contacts=${this.contacts}
        .categories=${ContactApp.categories}
        @delete-contact=${this.handleDelete}
        @edit-contact=${this.handleEdit}
      ></contact-display-table>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'contact-app': ContactApp;
  }
}
