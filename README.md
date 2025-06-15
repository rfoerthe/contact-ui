# contact-ui

A contact management proof of concept app built in four configurations:
* with vanilla [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
  (Branch: vanilla-webcomponents)
* with [Lit](https://lit.dev/)
  (Branches: master, lit-webcomponents)
* with [React](https://react.dev),
  (Branch: react-components)
* with [Svelte](https://svelte.dev),
  (Branch: svelte-components)

and TypeScript featuring project setup and build processes managed by [Vite](https://vitejs.dev/).

## Project Structure

    contact-ui/ 
    ├── public/ # Public static assets 
    ├── src/ # Application source code (TypeScript, CSS, TSX) 
    ├── index.html # Main entry point of the application 
    ├── package.json # Project and dependency definitions 
    ├── package-lock.json # Exact dependency versions 
    ├── tsconfig.json # TypeScript configuration

## Prerequisites

- [Node.js](https://nodejs.org/) (Recommended: version 18 or later)
- [npm](https://www.npmjs.com/) (included with Node.js)

## Setup & Installation

1. **Clone the repository**

   ```bash
   git clone <REPOSITORY_URL>
   cd contact-ui
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

## Build Process

- **Start development server**

  Launches a local server with hot-reload at [http://localhost:5173](http://localhost:5173):

   ```bash
   npm run dev
   ```

- **Create production build**

  Generates optimized production code in the `dist/` directory:

   ```bash
   npm run build
   ```

- **Preview the production build**

  Test the final build on a local server:

   ```bash
   npm run preview
   ```

## Indentation Style

- TypeScript & JavaScript: **2 spaces per indentation level** (default in Vite & Lit projects)
- CSS: **2 spaces** per indentation level

Indentation is automatically handled by most modern editors. Alternatively, you can add an `.editorconfig` file in VSCode.

## Further Resources

- [Vite Documentation](https://vitejs.dev/guide/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
- [Lit Documentation](https://lit.dev/docs/)
- [React Documentation](https://react.dev/)
- [Svelte](https://svelte.dev)
---

> For questions or issues, please open an issue in the repository.
