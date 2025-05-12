// Vanilla Web Component version of contact-entry-form.ts

interface Category {
	id: string;
	name: string;
	children?: Category[];
}

class ContactEntryForm extends HTMLElement {
	private selectedLevel1: string = '';
	private selectedLevel2: string = '';
	private selectedLevel3: string = '';
	private comment: string = '';

	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.handleLevel1Change = this.handleLevel1Change.bind(this);
		this.handleLevel2Change = this.handleLevel2Change.bind(this);
		this.handleLevel3Change = this.handleLevel3Change.bind(this);
		this.handleCommentChange = this.handleCommentChange.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.resetForm = this.resetForm.bind(this);
	}

	static get observedAttributes() {
		return ["categories"];
	}

	private _categories: Category[] = [];

	get categories(): Category[] {
		return this._categories;
	}

	set categories(value: Category[]) {
		this._categories = value;
		this.render();
	}

	get level2Categories(): Category[] {
		if (!this.selectedLevel1) return [];
		const level1 = this.categories.find(cat => cat.id === this.selectedLevel1);
		return level1?.children || [];
	}

	get level3Categories(): Category[] {
		if (!this.selectedLevel2) return [];
		const level2 = this.level2Categories.find(cat => cat.id === this.selectedLevel2);
		return level2?.children || [];
	}

	attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
		if (name === "categories") {
			try {
				this.categories = JSON.parse(newValue);
			} catch {
			}
		}
	}

	connectedCallback() {
		this.render();
	}

	handleLevel1Change(e: Event) {
		const value = (e.target as HTMLSelectElement).value;
		this.selectedLevel1 = value;
		this.selectedLevel2 = '';
		this.selectedLevel3 = '';
		this.render();
	}

	handleLevel2Change(e: Event) {
		const value = (e.target as HTMLSelectElement).value;
		this.selectedLevel2 = value;
		this.selectedLevel3 = '';
		this.render();
	}

	handleLevel3Change(e: Event) {
		const value = (e.target as HTMLSelectElement).value;
		this.selectedLevel3 = value;
		this.render();
	}

	handleCommentChange(e: Event) {
		this.comment = (e.target as HTMLTextAreaElement).value;
	}

	async loadContact(contact: { level1: string, level2: string, level3: string, comment: string }) {
		this.selectedLevel1 = contact.level1;
		this.selectedLevel2 = contact.level2;
		this.selectedLevel3 = contact.level3;
		this.comment = contact.comment;
		this.render();
	}

	handleCancel() {
		this.dispatchEvent(new CustomEvent('cancel', {bubbles: true, composed: true}));
		this.resetForm();
	}

	handleSave() {
		const formData = {
			level1: this.selectedLevel1,
			level2: this.selectedLevel2,
			level3: this.selectedLevel3,
			comment: this.comment
		};
		this.dispatchEvent(new CustomEvent('save', {
			detail: formData,
			bubbles: true, composed: true,
		}));
		this.resetForm();
	}

	resetForm() {
		this.selectedLevel1 = '';
		this.selectedLevel2 = '';
		this.selectedLevel3 = '';
		this.comment = '';
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
      .field { flex: 1; }
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
    </style>
    <div class="form-container">
      <div class="row">
        <div class="field">
          <label for="level1">Level 1 Category</label>
          <select id="level1">
            <option value="">Select Category</option>
            ${this.categories.map(cat =>
				`<option value="${cat.id}" ${cat.id === this.selectedLevel1 ? 'selected' : ''}>${cat.name}</option>`
		).join('')}
          </select>
        </div>
        <div class="field">
          <label for="level2">Level 2 Category</label>
          <select id="level2" ${!this.selectedLevel1 || this.level2Categories.length === 0 ? 'disabled' : ''}>
            <option value="">Select Category</option>
            ${this.level2Categories.map(cat =>
				`<option value="${cat.id}" ${cat.id === this.selectedLevel2 ? 'selected' : ''}>${cat.name}</option>`
		).join('')}
          </select>
        </div>
        <div class="field">
          <label for="level3">Level 3 Category</label>
          <select id="level3" ${!this.selectedLevel2 || this.level3Categories.length === 0 ? 'disabled' : ''}>
            <option value="">Select Category</option>
            ${this.level3Categories.map(cat =>
				`<option value="${cat.id}" ${cat.id === this.selectedLevel3 ? 'selected' : ''}>${cat.name}</option>`
		).join('')}
          </select>
        </div>
      </div>
      <div class="row">
        <div class="field">
          <label for="comment">Comment</label>
          <textarea id="comment">${this.comment || ""}</textarea>
        </div>
      </div>
      <div class="buttons">
        <button type="button" class="cancel">Cancel</button>
        <button type="button" class="save">Save</button>
      </div>
    </div>
    `;

		// Events (re-add after render)
		const shadow = this.shadowRoot;
		if (!shadow) return;

		shadow.getElementById('level1')?.addEventListener('change', this.handleLevel1Change);
		shadow.getElementById('level2')?.addEventListener('change', this.handleLevel2Change);
		shadow.getElementById('level3')?.addEventListener('change', this.handleLevel3Change);
		shadow.getElementById('comment')?.addEventListener('input', this.handleCommentChange);
		shadow.querySelector('.cancel')?.addEventListener('click', this.handleCancel);
		shadow.querySelector('.save')?.addEventListener('click', this.handleSave);
	}
}

customElements.define('contact-entry-form', ContactEntryForm);

declare global {
	interface HTMLElementTagNameMap {
		'contact-entry-form': ContactEntryForm;
	}
}