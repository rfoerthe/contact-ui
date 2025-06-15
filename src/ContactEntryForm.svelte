<script lang="ts">
    import type {Category, ContactEntry} from './types';

    let { categories = [], contact = undefined, save, cancel } = $props();

    let selectedLevel1 : string | undefined= $state();
    let selectedLevel2 : string | undefined= $state();
    let selectedLevel3 : string | undefined= $state();
    let comment : string | undefined= $state();

    let contactId: string | undefined = $state(undefined);
    let timestamp: number | undefined = $state(undefined);

    $effect(() => {
        updateFormFromContact();
    })


    function updateFormFromContact() {
        if (!contact) return;

        selectedLevel1 = contact.level1;
        selectedLevel2 = contact.level2;
        selectedLevel3 = contact.level3;
        comment = contact.comment;
        contactId = contact.id;
        timestamp = contact.timestamp;
    }


    function level2Categories(): Category[] {
        if (!selectedLevel1) return [];
        const level1 = categories.find(cat => cat.id === selectedLevel1);
        return level1?.children || [];
    }

    function level3Categories(): Category[] {
        if (!selectedLevel2) return [];
        const level2 = level2Categories().find(cat => cat.id === selectedLevel2);
        return level2?.children || [];
    }

    function handleLevel1Change(e: Event) {
        selectedLevel1 = (e.target as HTMLSelectElement).value;
        selectedLevel2 = '';
        selectedLevel3 = '';
    }

    function handleLevel2Change(e: Event) {
        selectedLevel2 = (e.target as HTMLSelectElement).value;
        selectedLevel3 = '';
    }

    function handleLevel3Change(e: Event) {
        selectedLevel3 = (e.target as HTMLSelectElement).value;
    }

    function handleCancel() {
        resetForm();
        cancel();
    }

    function handleSave() {
        const formData: ContactEntry = {
            level1: selectedLevel1 || "",
            level2: selectedLevel2 || "",
            level3: selectedLevel3 || "",
            comment: comment || "",
            id: contactId,
            timestamp: timestamp
        };

        resetForm();
        save(formData)
    }

    function resetForm() {
        selectedLevel1 = '';
        selectedLevel2 = '';
        selectedLevel3 = '';
        comment = '';
        contactId = undefined;
        timestamp = undefined;
    }



</script>

<div class="form-container">
    <div class="row">
        <div class="field">
            <label for="level1">Level 1 Category</label>
            <select id="level1" onchange={handleLevel1Change} bind:value={selectedLevel1}>
                <option value="">Select Category</option>
                {#each categories as cat}
                    <option value={cat.id}>{cat.name}</option>
                {/each}
            </select>
        </div>

        <div class="field">
            <label for="level2">Level 2 Category</label>
            <select id="level2" onchange={handleLevel2Change} bind:value={selectedLevel2}
                    disabled={!selectedLevel1 || level2Categories().length === 0}>
                <option value="">Select Category</option>
                {#each level2Categories() as cat}
                    <option value={cat.id}>{cat.name}</option>
                {/each}
            </select>
        </div>

        <div class="field">
            <label for="level3">Level 3 Category</label>
            <select id="level3" onchange={handleLevel3Change} bind:value={selectedLevel3}
                    disabled={!selectedLevel2 || level3Categories().length === 0}>
                <option value="">Select Category</option>
                {#each level3Categories() as cat}
                    <option value={cat.id}>{cat.name}</option>
                {/each}
            </select>
        </div>
    </div>

    <div class="row">
        <div class="field">
            <label for="comment">Comment</label>
            <textarea id="comment" bind:value={comment}></textarea>
        </div>
    </div>

    <div class="buttons">
        <button class="cancel" onclick={() => handleCancel()}>Cancel</button>
        <button class="save" onclick={() => handleSave()}>Save</button>
    </div>
</div>

<style>
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
</style>