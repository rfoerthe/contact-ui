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

  @state()
  private editContactId?: string = undefined;

  firstUpdated() {
    // Load contacts from localStorage
    const savedContacts = localStorage.getItem('contacts');
    if (savedContacts) {
      this.contacts = JSON.parse(savedContacts);
    }
  }

  private handleSave(e: CustomEvent) {
    const contactData = e.detail;
    let newContact: ContactEntry;
    if (contactData.id) {
      newContact = {...contactData};
    } else {
      newContact = {
        ...contactData,
        id: Date.now().toString(),
        timestamp: Date.now()
      };
    }
    this.editContactId = undefined;
    this.contacts = [...this.contacts.filter(contact => contact.id !== newContact.id), newContact];
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }

  private handleCancel() {
    this.editContactId = undefined;
  }


  private handleDelete(e: CustomEvent) {
    const id = e.detail;
    this.contacts = this.contacts.filter(contact => contact.id !== id);
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }

  private handleEdit(e: CustomEvent) {
    const contact = e.detail;
    // Load contact into the form
    const entryForm = this.renderRoot?.querySelector('contact-entry-form');
    entryForm?.loadContact(contact);
    this.editContactId = contact.id;
  }

  render() {
    return html`
      <h1>Contact Management</h1>
	  <h2 class="sub-title">Based on Lit, TypeScript and Vite</h2>
      <contact-entry-form
        .categories=${ContactApp.categories}
        @save=${this.handleSave}
        @cancel=${this.handleCancel}
      ></contact-entry-form>
      <contact-display-table
        .contacts=${this.contacts}
        .categories=${ContactApp.categories}
        .editContactId=${this.editContactId}
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
