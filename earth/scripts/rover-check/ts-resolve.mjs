// Lets Node run the app's TypeScript modules for these checks (Node strips the types): extensionless relative imports resolve to .ts/.tsx,
// and src/config.ts (which reads Vite's import.meta.env) is replaced by constants. Use: node --import ./scripts/rover-check/ts-resolve.mjs <script>
import { register } from 'node:module';
register('./ts-hooks.mjs', import.meta.url);
