# contact-ui

A contact management proof of concept app built in three configurations:
* with vanilla Web Components
* with [Lit](https://lit.dev/)
* with React

and TypeScript featuring project setup and build processes managed by [Rsbuild](https://rsbuild.dev/).

## Project Structure

    contact-ui/ 
    ├── public/ # Public static assets 
    ├── src/ # Application source code (TypeScript, CSS, TSX) 
    ├── src/index.tsx # Application entry point 
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

  Launches a local server with hot-reload at [http://localhost:3000](http://localhost:3000):

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

- [Lit Documentation](https://lit.dev/docs/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Rsbuild Documentation](https://rsbuild.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)

---

> For questions or issues, please open an issue in the repository.
