#!/bin/sh
set -eu

escape_js_string() {
  printf "%s" "$1" | sed "s/\\\\/\\\\\\\\/g; s/'/\\\\'/g"
}

carto_api_key="${CARTO_API_KEY:-}"
escaped_carto_api_key="$(escape_js_string "$carto_api_key")"

cat > /usr/share/nginx/html/config.js <<EOF
window.TRAVEL_MAP_CONFIG = Object.assign({}, window.TRAVEL_MAP_CONFIG, {
  cartoApiKey: '$escaped_carto_api_key'
});
EOF
