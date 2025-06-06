import {html, LitElement, type PropertyValues} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import type {ContactEntry} from "./types";
import {contactEntryFormStyles} from "./contact-entry-form-styles";

interface Category {
	id: string;
	name: string;
	children?: Category[];
}

@customElement('contact-entry-form')
export class ContactEntryForm extends LitElement {
	static styles = contactEntryFormStyles;

	@property({type: Array})
	categories: Category[] = [];

	@property({type: Object})
	contact: ContactEntry | null = null;

	willUpdate(changedProperties: PropertyValues) {
		if (changedProperties.has('contact') && this.contact) {
			this.updateFormFromContact();
		}
	}

	@state()
	private selectedLevel1: string = '';

	@state()
	private selectedLevel2: string = '';

	@state()
	private selectedLevel3: string = '';

	@state()
	private comment: string = '';

	@state()
	private contactId: string | undefined = undefined;

	@state()
	private timestamp: number | undefined = undefined;

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

	private async updateFormFromContact() {
		if (!this.contact) return;

		this.selectedLevel1 = this.contact.level1;
		await this.updateComplete; // Wait for Lit to update level2 options

		this.selectedLevel2 = this.contact.level2;
		await this.updateComplete; // Wait for Lit to update level3 options

		this.selectedLevel3 = this.contact.level3;
		this.comment = this.contact.comment;
		this.contactId = this.contact.id;
		this.timestamp = this.contact.timestamp;
	}


	private handleCancel() {
		this.dispatchEvent(new CustomEvent('cancel'));
		this.resetForm();
	}

	private handleSave() {
		const formData: ContactEntry = {
			level1: this.selectedLevel1,
			level2: this.selectedLevel2,
			level3: this.selectedLevel3,
			comment: this.comment,
			id: this.contactId,
			timestamp: this.timestamp
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
		this.contactId = undefined;
		this.timestamp = undefined;
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