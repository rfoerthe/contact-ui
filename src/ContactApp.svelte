<script lang="ts">
  import type { ContactEntry } from "./types";
  import ContactEntryForm from "./ContactEntryForm.svelte";
  import ContactDisplayTable from "./ContactDisplayTable.svelte";
  import { onMount } from "svelte";
  import { exampleCategories } from "./example-categories";

  const categories = exampleCategories;

  let contacts: ContactEntry[] = $state([]);

  let editContact: ContactEntry | undefined = $state(undefined);

  onMount(() => {
    const savedContacts = localStorage.getItem("contacts");
    if (savedContacts) {
      contacts = JSON.parse(savedContacts);
    }
  });

  function handleSave(contactData: ContactEntry) {
    let newContact: ContactEntry;
    if (contactData.id) {
      // handling save after editing existing entry
      newContact = { ...contactData };
    } else {
      newContact = {
        ...contactData,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
    }
    editContact = undefined;
    contacts = [...contacts.filter((contact) => contact.id !== newContact.id), newContact];
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }

  function handleCancel() {
    editContact = undefined;
  }

  function handleDelete(id: string) {
    contacts = contacts.filter((contact) => contact.id !== id);
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }

  function handleEdit(contact: ContactEntry) {
    editContact = contact;
  }
</script>

<div class="component-root">
  <h1>Contact Management</h1>
  <h2 class="sub-title">Based on Svelte 5, TypeScript and Vite</h2>
  <ContactEntryForm 
    {categories} 
    contact={editContact} 
    save={handleSave} 
    cancel={handleCancel}>
  </ContactEntryForm>
  <ContactDisplayTable 
    {contacts} 
    {categories} 
    editContactId={editContact?.id} 
    cdelete={handleDelete} 
    edit={handleEdit}
  ></ContactDisplayTable>
</div>

<style>
  .component-root {
    display: block;
    font-family: Arial, sans-serif;
    max-width: 1024px;
    margin: 0 auto;
    padding: 20px;
    color: #333;
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
</style>
