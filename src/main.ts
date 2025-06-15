import { mount } from 'svelte'
import ContactApp from "./ContactApp.svelte";

const contactApp = mount(ContactApp, {
  target: document.getElementById('app')!,
})

export default contactApp
