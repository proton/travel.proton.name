## Peter Savichev (proton)'s travel web-site

http://travel.proton.name

### CARTO API key

The site reads the CARTO basemaps API key from `/config.js`. In production the
nginx container generates that file from the `CARTO_API_KEY` environment
variable on startup.

Deployment is managed by ArgoCD, so the real key should live outside this Git
repository. Create the Secret in the same namespace as the application:

```sh
kubectl -n travel-proton-name create secret generic carto-basemaps \
  --from-literal=api-key='YOUR_CARTO_KEY'
```

The Helm chart references that Secret through `carto.apiKey.existingSecret` in
`helm-chart/values.yaml`. The reference is optional, so the pod can still start
before the Secret exists. If the Secret value changes or is created after the pod
has already started, restart the Deployment so the container regenerates
`/config.js` with the new environment variable.
