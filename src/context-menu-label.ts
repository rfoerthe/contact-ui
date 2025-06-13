import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

interface MenuPosition {
    x: number;
    y: number;
}

@customElement('context-menu-label')
export class ContextMenuLabel extends LitElement {
    @property({ type: String, attribute: 'label-text'})
    labelText = 'Klick mich';

    @property({ type: Array })
    menuItems: string[] = ['Option 1', 'Option 2', 'Option 3'];

    @state()
    private showMenu = false;

    @state()
    private menuPosition: MenuPosition = { x: 0, y: 0 };

    static styles = css`
    :host {
      position: relative;
      display: inline-block;
    }

    .label {
      padding: 8px 16px;
      background-color: #f0f0f0;
      border: 1px solid #ccc;
      border-radius: 4px;
      cursor: pointer;
      user-select: none;
      transition: background-color 0.2s;
    }

    .label:hover {
      background-color: #e0e0e0;
    }

    .label:active {
      background-color: #d0d0d0;
    }

    .context-menu {
      position: fixed;
      background: white;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      width: 200px;
      padding: 4px 0;
    }

    .menu-item {
      padding: 8px 16px;
      cursor: pointer;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      font-size: 14px;
      transition: background-color 0.2s;
    }

    .menu-item:hover {
      background-color: #f0f0f0;
    }

    .menu-item:focus {
      outline: none;
      background-color: #e0e0e0;
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 999;
    }
  `;

    private handleLabelClick(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        // Wenn nur ein Menü-Item vorhanden ist, direkt das Event auslösen
        if (this.menuItems.length === 1) {
            this.dispatchEvent(new CustomEvent('menu-item-selected', {
                detail: { selectedItem: this.menuItems[0] },
                bubbles: true,
                composed: true
            }));
            return;
        }

        const rect = (event.target as HTMLElement).getBoundingClientRect();

        // Position das Menü rechts neben dem Label
        this.menuPosition = {
            x: rect.right + 5,
            y: rect.top
        };

        this.showMenu = true;

        // Event Listener für das Schließen des Menüs hinzufügen
        setTimeout(() => {
            document.addEventListener('click', this.handleDocumentClick);
            document.addEventListener('keydown', this.handleKeyDown);
        }, 0);
    }

    private handleDocumentClick = (event: Event) => {
        // Prüfen ob der Klick außerhalb des Menüs war
        const target = event.target as HTMLElement;
        if (!this.contains(target)) {
            this.closeMenu();
        }
    };

    private handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            this.closeMenu();
        }
    };

    private handleMenuItemClick(item: string, event: MouseEvent) {
        event.stopPropagation();

        // Custom Event für Menü-Item-Auswahl dispatchen
        this.dispatchEvent(new CustomEvent('menu-item-selected', {
            detail: { selectedItem: item },
            bubbles: true,
            composed: true
        }));

        this.closeMenu();
    }

    private closeMenu() {
        this.showMenu = false;
        document.removeEventListener('click', this.handleDocumentClick);
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    private renderMenu() {
        if (!this.showMenu) return null;

        return html`
      <div class="overlay" @click=${this.closeMenu}></div>
      <div 
        class="context-menu"
        style="left: ${this.menuPosition.x}px; top: ${this.menuPosition.y}px;"
      >
        ${this.menuItems.map(item => html`
          <button 
            class="menu-item"
            @click=${(e: MouseEvent) => this.handleMenuItemClick(item, e)}
          >
            ${item}
          </button>
        `)}
      </div>
    `;
    }

    render() {
        return html`
      <div 
        class="label" 
        @click=${this.handleLabelClick}
      >
        ${this.labelText}
      </div>
      ${this.renderMenu()}
    `;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        // Event Listener beim Entfernen der Komponente aufräumen
        document.removeEventListener('click', this.handleDocumentClick);
        document.removeEventListener('keydown', this.handleKeyDown);
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'context-menu-label': ContextMenuLabel;
    }
}