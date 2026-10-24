# 0022. Publish to Azure App Service on one Basic plan

- Status: Accepted
- Date: 2026-10-24

## Context

Coop had a CI workflow but no deployment. The co-operative needs the admin
site at `app.esplanade.technology`, the public site at
`own.esplanade.technology`, and the API behind them, on the cheapest plan
that is still fit for production: always on, HTTPS on the custom domains,
and the SQLite file kept between deployments. The subscription has reached
its quota of Free Static Web Apps, so the two Angular apps could not be
published there without paying for the Standard tier or removing other
sites.

## Decision

- One Linux App Service plan, `coop-plan` (B1, Canada Central, resource
  group `Coop`), hosts three web apps at no extra cost per app:
  `coop-esplanade-api` (.NET 10), `coop-esplanade-app` (admin) and
  `coop-esplanade-own` (public). B1 is the cheapest tier that includes
  Always On, custom domains and App Service managed certificates.
- The two Angular apps are static builds served by Node's `pm2 serve
  /home/site/wwwroot --no-daemon --spa`, the App Service pattern for
  single-page apps, so deep links fall back to `index.html`.
- The API keeps SQLite, at `/home/coop.db`, which App Service persists
  across deployments and restarts. The JWT key and the CORS origins are
  app settings; `Cors:AllowedOrigins` is read from configuration and
  defaults to the local dev servers. The custom domains and the
  `azurewebsites.net` hostnames of the two apps are the allowed origins.
- The frontends read the API address from `src/environments/environment.ts`
  (production, the API's `azurewebsites.net` address). The `development`
  and `testing` build configurations replace it with
  `environment.development.ts` (`http://localhost:5000/api`), which `ng
  serve` and the Playwright suite use.
- `.github/workflows/deploy.yml` runs on every push to `main` (and on
  demand): it publishes the API and builds the frontend once, then deploys
  each web app with `azure/webapps-deploy` and that app's publish profile,
  stored as a repository secret. `ci.yml` is unchanged and still gates pull
  requests.
- DNS stays at Namecheap: `app` and `own` are CNAME records to the two web
  apps' default hostnames, with `asuid.app` and `asuid.own` TXT records
  carrying the subscription's domain verification id. The API is reached
  on its `azurewebsites.net` hostname; it has no custom domain.

## Consequences

- Cost is one B1 plan, about CAD 20 a month, for all three apps.
- Scaling or isolating the apps later means moving a web app to its own
  plan; nothing in the code changes.
- The API still creates and seeds the database on startup (ADR 0012), so
  the first deployment seeds the fictional demo users on the production
  database. Resetting or replacing that data is `Coop.Cli`'s job.
- Rotating a publish profile means downloading it again and updating the
  secret; the workflow does not use federated credentials.
