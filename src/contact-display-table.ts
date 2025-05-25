import { LitElement, html, css } from 'lit';
import {customElement, property, state} from 'lit/decorators.js';


interface ContactEntry {
  level1: string;
  level2: string;
  level3: string;
  comment: string;
  id?: string; // Optional unique identifier
  timestamp?: number; // Optional timestamp
}

interface Category {
  id: string;
  name: string;
  children?: Category[];
}

@customElement('contact-display-table')
export class ContactDisplayTable extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
      color: #333;
    }

    .table-container {
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 20px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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

    .edit {
      background-color: #f6e0b6;
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
  `;

  @property({ type: Array })
  contacts: ContactEntry[] = [];

  @property({ type: Array })
  categories: Category[] = [];

  @state()
  editContactId: string | undefined = undefined;

  public async resetEdit() {
    this.editContactId = undefined;
  }

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
      detail: { id }
    }));
  }

  private handleEdit(contact: ContactEntry) {
    this.editContactId = contact.id;
    this.dispatchEvent(new CustomEvent('edit-contact', {
      detail: { contact }
    }));
  }

  render() {
    return html`
      <div class="table-container">
        <h2>Contact Entries</h2>
        
        ${this.contacts.length === 0 
          ? html`<div class="empty-state">No contact entries yet. Use the form to add some.</div>`
          : html`
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Comment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${[...this.contacts]
                    .sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0))
                    .map(contact => html`
                  <tr class="${this.editContactId === contact.id ? "edit": ""}">
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