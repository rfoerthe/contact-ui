import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

interface Category {
  id: string;
  name: string;
  children?: Category[];
}

@customElement('contact-entry-form')
export class ContactEntryForm extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
      color: #333;
    }

    .form-container {
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 20px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .row {
      display: flex;
      margin-bottom: 16px;
      gap: 16px;
    }

    .field {
      flex: 1;
    }

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }

    select {
      padding: 8px;
      width: 100%;
    }

    textarea {
      width: 99%;
      min-height: 100px;
      resize: vertical;
      padding: 8px 0 8px 8px;
      font-family: Arial, sans-serif;
    }

    select, textarea {
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .buttons {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }

    button {
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
    }

    .cancel {
      background-color: #f5f5f5;
      border: 1px solid #ddd;
    }

    .save {
      background-color: #4CAF50;
      color: white;
      border: none;
    }
  `;

  @property({ type: Array })
  categories: Category[] = [];

  @state()
  private selectedLevel1: string = '';

  @state()
  private selectedLevel2: string = '';

  @state()
  private selectedLevel3: string = '';

  @state()
  private comment: string = '';

  private get level2Categories(): Category[] {
    if (!this.selectedLevel1) return [];
    const level1 = this.categories.find(cat => cat.id === this.selectedLevel1);
    return level1?.children || [];
  }

  private get level3Categories(): Category[] {
    if (!this.selectedLevel2) return [];
    const level2 = this.level2Categories.find(cat => cat.id === this.selectedLevel2);
    return level2?.children || [];
  }

  private handleLevel1Change(e: Event) {
    this.selectedLevel1 = (e.target as HTMLSelectElement).value;
    this.selectedLevel2 = '';
    this.selectedLevel3 = '';
  }

  private handleLevel2Change(e: Event) {
    this.selectedLevel2 = (e.target as HTMLSelectElement).value;
    this.selectedLevel3 = '';
  }

  private handleLevel3Change(e: Event) {
    this.selectedLevel3 = (e.target as HTMLSelectElement).value;
  }

  private handleCommentChange(e: Event) {
    this.comment = (e.target as HTMLTextAreaElement).value;
  }

  public async loadContact(contact: { level1: string, level2: string, level3: string, comment: string }) {
    this.selectedLevel1 = contact.level1;
    await this.updateComplete; // Wait for Lit to update level2 options

    this.selectedLevel2 = contact.level2;
    await this.updateComplete; // Wait for Lit to update level3 options

    this.selectedLevel3 = contact.level3;
    this.comment = contact.comment;
  }


  private handleCancel() {
    this.dispatchEvent(new CustomEvent('cancel'));
    this.resetForm();
  }

  private handleSave() {
    const formData = {
      level1: this.selectedLevel1,
      level2: this.selectedLevel2,
      level3: this.selectedLevel3,
      comment: this.comment
    };

    this.dispatchEvent(new CustomEvent('save', {
      detail: formData
    }));

    this.resetForm();
  }

  private resetForm() {
    this.selectedLevel1 = '';
    this.selectedLevel2 = '';
    this.selectedLevel3 = '';
    this.comment = '';
  }

  render() {
    return html`
      <div class="form-container">
        <div class="row">
          <div class="field">
            <label for="level1">Level 1 Category</label>
            <select id="level1" @change=${this.handleLevel1Change} .value=${this.selectedLevel1}>
              <option value="">Select Category</option>
              ${this.categories.map(cat => html`
                <option value=${cat.id}>${cat.name}</option>
              `)}
            </select>
          </div>
          
          <div class="field">
            <label for="level2">Level 2 Category</label>
            <select id="level2" @change=${this.handleLevel2Change} .value=${this.selectedLevel2}
                    ?disabled=${!this.selectedLevel1 || this.level2Categories.length === 0}>
              <option value="">Select Category</option>
              ${this.level2Categories.map(cat => html`
                <option value=${cat.id}>${cat.name}</option>
              `)}
            </select>
          </div>
          
          <div class="field">
            <label for="level3">Level 3 Category</label>
            <select id="level3" @change=${this.handleLevel3Change} .value=${this.selectedLevel3}
                    ?disabled=${!this.selectedLevel2 || this.level3Categories.length === 0}>
              <option value="">Select Category</option>
              ${this.level3Categories.map(cat => html`
                <option value=${cat.id}>${cat.name}</option>
              `)}
            </select>
          </div>
        </div>
        
        <div class="row">
          <div class="field">
            <label for="comment">Comment</label>
            <textarea id="comment" @input=${this.handleCommentChange} .value=${this.comment}></textarea>
          </div>
        </div>
        
        <div class="buttons">
          <button class="cancel" @click=${this.handleCancel}>Cancel</button>
          <button class="save" @click=${this.handleSave}>Save</button>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'contact-entry-form': ContactEntryForm;
  }
}