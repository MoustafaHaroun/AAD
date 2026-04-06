/**
 * Fetches the OpenAPI spec from the running app and writes:
 *   - swagger.json  (OpenAPI JSON spec)
 *   - swagger.html  (self-contained Swagger UI page)
 *
 * Usage:
 *   npm run swagger:generate
 *
 * The app must be running with SWAGGER_ENABLED=true (default in dev).
 * Override the base URL with: BASE_URL=http://localhost:80 npm run swagger:generate
 */

import { writeFileSync } from 'fs';
import { get } from 'http';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:80';
const JSON_URL = `${BASE_URL}/documentation-json`;

function fetch(url) {
  return new Promise((resolve, reject) => {
    get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

function buildHtml(spec) {
  const escaped = JSON.stringify(spec)
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${spec.info?.title ?? 'API'} — Swagger UI</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({
      spec: ${escaped},
      dom_id: '#swagger-ui',
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
      layout: 'BaseLayout',
      deepLinking: true,
    });
  </script>
</body>
</html>`;
}

async function main() {
  console.log(`Fetching spec from ${JSON_URL} ...`);

  let res;
  try {
    res = await fetch(JSON_URL);
  } catch (err) {
    console.error(`Could not reach ${JSON_URL}`);
    console.error('Make sure the app is running with SWAGGER_ENABLED=true');
    process.exit(1);
  }

  if (res.status !== 200) {
    console.error(`Got HTTP ${res.status}. Is SWAGGER_ENABLED=true set?`);
    process.exit(1);
  }

  const spec = JSON.parse(res.body);

  writeFileSync('swagger.json', JSON.stringify(spec, null, 2));
  console.log('✔ swagger.json written');

  writeFileSync('swagger.html', buildHtml(spec));
  console.log('✔ swagger.html written');
}

main();
