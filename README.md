# BagygoFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.3.

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





bagygo-frontend/src/
├── index.html
├── main.ts
├── styles.scss                          ✅ done
│
└── app/
    ├── app.ts                           ✅ done
    ├── app.config.ts                    ✅ done
    ├── app.routes.ts                    ✅ done
    │
    ├── core/                            — singleton services, used app-wide
    │   ├── models/
    │   │   └── index.ts                 ✅ done (all interfaces & types)
    │   ├── services/
    │   │   ├── auth.service.ts          ✅ done
    │   │   ├── baggage-request.service.ts   ⬜ to build
    │   │   ├── trip.service.ts              ⬜ to build
    │   │   ├── offer.service.ts             ⬜ to build
    │   │   ├── message.service.ts           ⬜ to build
    │   │   └── rating.service.ts            ⬜ to build
    │   ├── guards/
    │   │   └── auth.guard.ts            ✅ done
    │   └── interceptors/
    │       └── auth.interceptor.ts      ✅ done
    │
    ├── shared/                          — reusable components used across features
    │   └── components/
    │       ├── navbar/                      ⬜ (landing page navbar)
    │       ├── avatar/                      ⬜ (user avatar with initials)
    │       ├── rating-stars/                ⬜ (star display/input)
    │       ├── status-badge/                ⬜ (request/trip status chip)
    │       └── confirm-dialog/              ⬜ (reusable modal)
    │
    └── features/                        — one folder per page/feature area
        │
        ├── landing/                         ⬜ to build
        │   └── landing.component
        │       (.ts / .html / .scss)
        │
        ├── auth/                        ✅ done
        │   ├── auth-layout.component.ts
        │   ├── login.component.*
        │   └── register.component.*
        │
        └── dashboard/
            ├── dashboard-layout.component.*  ✅ done
            │
            ├── sender/
            │   ├── sender-home.component.*           ✅ done (sender-dashboard)
            │   ├── /my-requests
            │   │   ├── request-list.component.*       ⬜
            │   │   ├── request-detail.component.*     ⬜
            │   │   └── create-request.component.*     ⬜
            │   └── browse-trips/
            │       └── trip-list.component.*          ⬜
            │
            ├── transporter/
            │   ├── transporter-home.component.*       ⬜
            │   ├── my-trips/
            │   │   ├── trip-list.component.*          ⬜
            │   │   └── create-trip.component.*        ⬜
            │   └── browse-requests/
            │       ├── request-list.component.*       ⬜
            │       └── offer-form.component.*         ⬜
            │
            ├── messages/
            │   └── messages.component.*               ⬜
            │
            ├── tracking/
            │   └── tracking.component.*               ⬜
            │
            ├── ratings/
            │   └── ratings.component.*                ⬜
            │
            └── settings/
                └── settings.component.*               ⬜
