# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Overview

This is the source for `travel.proton.name`, a small static travel map.

- `site/` contains the public web assets served by nginx.
- `site/index.html` loads Leaflet from a CDN, `site/code.js`, `site/styles.css`, and `site/tripster_cities.json`.
- `site/tripster_cities.json` is the primary data file. Each entry is a city marker with `city_id`, titles, country names, optional `image_url`, and coordinates as `y` latitude and `x` longitude.
- `add.rb` adds one city from a map URL by reverse-geocoding coordinates with Nominatim through the `geocoder` gem.
- `json_filler.rb` merges root-level `*.json` Tripster exports into `site/tripster_cities.json`.
- `Dockerfile` copies `site/` into `nginx:alpine`.
- `helm-chart/` deploys the built image to Kubernetes.

## Local Setup

Use the Ruby version from `.ruby-version`:

```sh
bundle install
```

There is no Node, asset build, or test runner in this repo.

To serve the site locally, run any simple static server from `site/`:

```sh
cd site
ruby -run -e httpd . -p 8000
```

Then open `http://localhost:8000`.

## Common Tasks

Add a city from a map URL:

```sh
bundle exec ruby add.rb "<map-url-containing-/place/.../@lat,lng>"
```

This command uses external geocoding, so network access is required. It rewrites `site/tripster_cities.json` with pretty-printed JSON, deduplicated by `city_id`, sorted by `country_en` then `title_en`, and with Tripster-only fields removed.

Merge Tripster export files:

```sh
bundle exec ruby json_filler.rb
```

Place export JSON files in the repository root before running this command. It reads all root-level `*.json` files and rewrites `site/tripster_cities.json`.

Validate the city JSON after data edits:

```sh
ruby -rjson -e 'JSON.parse(File.read("site/tripster_cities.json"))'
```

Render Helm templates after chart edits:

```sh
helm template travel-proton-name ./helm-chart
```

Build the container image after Docker or static asset changes:

```sh
docker build .
```

## Coding Conventions

- Keep the static frontend dependency-light. The site currently has plain HTML, CSS, JavaScript, Leaflet from CDN, and JSON data.
- Preserve the existing public paths in `site/index.html`: assets are referenced from `/styles.css`, `/code.js`, `/marker.png`, and `/tripster_cities.json`.
- Keep `tripster_cities.json` pretty-printed with two-space indentation.
- For city records, preserve the existing schema and coordinate convention: `y` is latitude, `x` is longitude.
- Avoid unrelated formatting churn in the large JSON file. Data scripts may reorder the file intentionally; manual edits should be minimal and sorted consistently.
- Ruby scripts are small command-line utilities. Prefer straightforward standard-library code and existing `geocoder` usage over adding dependencies.

## Deployment Notes

Pushes to `master` trigger `.github/workflows/deploy.yml`.

The workflow:

1. Builds and pushes an image to `registry.proton.name/proton/travel.proton.name`.
2. Tags the image as `latest` and with the GitHub run id.
3. Updates `helm-chart/.argocd-source-travel.proton.name.yaml` with the run id.
4. Commits that deployment tag update back with `[skip ci]`.

Do not manually change generated deployment tag commits unless the user asks.

## Safety Notes

- `add.rb` depends on the structure of the input URL. Check the URL contains `/place/...` and `@lat,lng` before running it.
- `json_filler.rb` reads every root-level `*.json` file. Remove temporary JSON files from the root before running it unless they are intended Tripster exports.
- Networked commands may fail in restricted environments. If geocoding is unavailable, edit data manually only when the coordinates and country/title fields are known.
