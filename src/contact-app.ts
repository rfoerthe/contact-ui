import {html, LitElement} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {exampleCategories} from './example-categories';
import './contact-entry-form';
import './contact-display-table';
import type {Category, ContactEntry} from "./types";
import {contactAppStyles} from "./contact-app-styles";

@customElement('contact-app')
export class ContactApp extends LitElement {
  static styles = contactAppStyles;

  static categories: Category[] = exampleCategories;

  @state()
  private contacts: ContactEntry[] = [];

  @state()
  private editContact: ContactEntry | undefined = undefined;

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
      // handling save after editing existing entry
      newContact = {...contactData};
    } else {
      newContact = {
        ...contactData,
        id: Date.now().toString(),
        timestamp: Date.now()
      };
    }
    this.editContact = undefined;
    this.contacts = [...this.contacts.filter(contact => contact.id !== newContact.id), newContact];
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }

  private handleCancel() {
    this.editContact = undefined;
  }

  private handleDelete(e: CustomEvent) {
    const id = e.detail;
    this.contacts = this.contacts.filter(contact => contact.id !== id);
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }

  private handleEdit(e: CustomEvent) {
    this.editContact = e.detail;
  }

  render() {
    return html`
      <h1>Contact Management</h1>
	  <h2 class="sub-title">Based on Lit, TypeScript and Vite</h2>
      <contact-entry-form
        .categories=${ContactApp.categories}
        .contact=${this.editContact}
        @save=${this.handleSave}
        @cancel=${this.handleCancel}
      ></contact-entry-form>
      <contact-display-table
        .contacts=${this.contacts}
        .categories=${ContactApp.categories}
        .editContactId=${this.editContact?.id}
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
