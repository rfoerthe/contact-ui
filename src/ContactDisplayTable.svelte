<script lang="ts">
    import type {Category, ContactEntry} from './types';

    let {categories = [], contacts, cdelete, edit, editContactId = undefined} = $props();


    // Helper method to find category name by id
    function getCategoryName(id: string): string {
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

        return findCategory(categories) || 'Unknown';
    }

    // Generate the category path string
    function getCategoryPath(contact: ContactEntry): string {
        const parts = [];

        if (contact.level1) {
            parts.push(getCategoryName(contact.level1));
        }

        if (contact.level2) {
            parts.push(getCategoryName(contact.level2));
        }

        if (contact.level3) {
            parts.push(getCategoryName(contact.level3));
        }

        return parts.join(' > ') || 'Uncategorized';
    }

    function handleDelete(contact: ContactEntry) {
        const id = contact.id || ""
        cdelete(id);
    }

    function handleEdit(contact: ContactEntry) {
        edit(contact);
    }
</script>

<div class="table-container">
    <h2>Contact Entries</h2>

    {#if contacts.length === 0}
        <div class="empty-state">No contact entries yet. Use the form to add some.</div>
    {:else}
        <table>
            <thead>
            <tr>
                <th>Category</th>
                <th>Comment</th>
                <th class="actions-head">Actions</th>
            </tr>
            </thead>
            <tbody>
            {#each [...contacts].sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0)) as contact}
                <tr class:edit={editContactId === contact.id}>
                    <td class="category-path">{getCategoryPath(contact)}</td>
                    <td class="comment">{contact.comment}</td>
                    <td>
                        <div class="actions">
                            <button class="edit-btn" onclick={() => handleEdit(contact)}>Edit</button>
                            <button class="delete-btn" onclick={() => handleDelete(contact)}>Delete</button>
                        </div>
                    </td>
                </tr>
            {/each}
            </tbody>
        </table>
    {/if}
</div>


<style>
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

    th.actions-head {
        width: 110px;
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
</style>