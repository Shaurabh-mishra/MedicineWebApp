# medapp-ui (Medicine Web App UI)

A small Angular frontend for the Medicines Web API. This README explains how to set up, run, and troubleshoot the project.

## Prerequisites
- Node.js (>= 18 recommended) and npm
- (Optional) Angular CLI if you prefer `ng` commands: `npm install -g @angular/cli`

This project was developed and tested on Windows (PowerShell).

## Install dependencies
Open PowerShell in the `medapp-ui` folder and run:

```powershell
cd '..MedicineWebApp\Frontend\medapp-ui'
npm install
```

## Run (development)
- Start the dev server with the script in `package.json` (commonly `npm run start`), or use `ng serve`:

```powershell
npm run start
# or
ng serve --open
```

The app will be available at `http://localhost:4200/` by default.

## Build (production)

```powershell
npm run build
# or
ng build --configuration production
```

## Project structure (important files)
- `src/app/services/medicine.service.ts` — API client for medicines. Edit `baseUrl` here if your backend runs on a different host/port.
- `src/app/interceptors/auth.interceptor.ts` — Attaches `Authorization: Bearer <token>` header using `localStorage.getItem('token')`.
- `src/app/pages/medicines/` — `medicine-list` (inline add/edit/delete) and `medicine-form` pages.
- `src/app/pages/dashboard/` — Dashboard with user info and medicine statistics.
- `src/app/pages/about/` — Static About page.
- `src/app/pages/medicines/medicines.resolver.ts` — Resolver that preloads medicines for the `/medicines` route.

## Authentication & tokens
- The `AuthInterceptor` reads `localStorage.token` and adds it to API requests.
- The login flow stores `token`, `name`, and `email` in `localStorage` (see `src/app/pages/login/login.ts`).
- For development/testing you can manually set a token in the browser DevTools console:

```js
localStorage.setItem('token', 'your-test-token');
localStorage.setItem('name', 'Dev User');
localStorage.setItem('email', 'dev@example.com');
```

## Medicines UI behavior
- `medicine-list` uses inline add/edit rows, and calls the API through `MedicineService`.
- The list uses a cached `getAll()` observable to dedupe concurrent loads; create/update/delete clear the cache so a subsequent load fetches fresh data.
- A `MedicinesResolver` is used for the `/medicines` route so the table loads on page refresh/navigation.
- Save/update/delete flows chain the write and reload using RxJS `switchMap`, ensuring the UI refreshes automatically.

## Dashboard
- Dashboard reads `name` and `email` from `localStorage` and shows total medicines.
- The dashboard reloads its statistics on navigation end so redirects (for example after login) also trigger a stats fetch.

## Common troubleshooting
- Build warnings about `*ngIf` / `NgIf`: ensure `CommonModule` is imported in the component or the component is `standalone` and includes `CommonModule` in `imports`.
- Template errors like `TS2339: Property 'description' does not exist on type 'Medicine'`: reconcile the component template and the `Medicine` interface (`src/app/services/medicine.service.ts`) — either update template bindings or the interface.
- `NG5002: Unexpected closing tag`: check the template HTML for unbalanced tags (missing `</td>` / `</tr>`), particularly in table templates.
- If a feature appears to work server-side but you don't see UI feedback (for example toasts), check the browser console for `console.log` outputs added for debugging and verify the toast container exists in the page template.

## Developer notes
- To change the backend API host/port, edit `baseUrl` in `src/app/services/medicine.service.ts`.
- The app stores basic user info in `localStorage` — for a production app you should use a secure session or a proper auth flow with token refresh.
- Tests: run `npm test` if a `test` script exists in `package.json`.

## Useful commands (PowerShell)

```powershell
# install deps
npm install

# dev server
npm run start

# build
npm run build

# test (if configured)
npm run test
```

## Contact / author
If you need help with this UI, contact the author listed in the About page.

---
This README is a living document — feel free to ask me to expand any section or add specific setup steps for CI, Docker, or environment configuration.
# MedappUi

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
