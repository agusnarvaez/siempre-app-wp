# siempre-app-wp

![Siempre logo](./src/assets/logos/logo-siempre.png)

[![QA](https://github.com/agusnarvaez/siempre-app-wp/actions/workflows/qa.yml/badge.svg)](https://github.com/agusnarvaez/siempre-app-wp/actions/workflows/qa.yml)
[![Codecov](https://codecov.io/gh/agusnarvaez/siempre-app-wp/branch/main/graph/badge.svg)](https://codecov.io/gh/agusnarvaez/siempre-app-wp)
[![Node.js](https://img.shields.io/badge/Node.js-22%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Playwright](https://img.shields.io/badge/E2E-Playwright-45BA63?logo=playwright&logoColor=white)](https://playwright.dev/)

Internal web app for Siempre Logistica that transforms delivery spreadsheets into operational views and WhatsApp-ready customer contact actions.

Aplicacion web interna para Siempre Logistica que transforma planillas de entregas en vistas operativas y acciones listas para contactar clientes por WhatsApp.

## Overview

### ES

La aplicacion permite cargar un archivo CSV con datos de paquetes, validar su estructura, generar mensajes y navegar entre una pantalla de carga y una tabla operativa de seguimiento.

### EN

The application lets the team upload a CSV file with package data, validate its structure, generate messages, and move between an intake screen and an operational table view.

## Stack

- React 19
- Vite
- TypeScript
- Material UI
- React Router
- React Hook Form
- Vitest + Testing Library
- Playwright

## Getting Started

```bash
npm install
npm run dev
```

The local Vite server will expose the app in development mode with hot reload.

## Main Workflow

1. Open the app.
2. Upload a UTF-8 CSV file with package data.
3. Validate the parsed result.
4. Move to the table view to trigger customer notification and after-sales actions.

Expected CSV header:

```text
Nombre,Apellido,Telefono,Direccion,Localidad,Provincia
```

Sample CSV and XLSX files are included in the repository for local testing.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run test
npm run test:watch
npm run test:coverage
npm run test:e2e
```

## Project Structure

```text
src/
  components/pages/
  context/
  data/
  services/
  utils/
e2e/
```

## Quality

- Unit and integration coverage runs with Vitest and Testing Library.
- An end-to-end smoke test runs with Playwright.
- CI validates lint, build, coverage, and the smoke path.
- Playwright output folders are now ignored to keep generated artifacts out of day-to-day repo noise.

## Operational Notes

- Keep the CSV column contract stable unless the import flow is updated end-to-end.
- Validate message generation rules together with the utility tests before changing templates.
- Prefer adding tests next to the modules that encode business rules.

## License

MIT. See [LICENSE](./LICENSE).
