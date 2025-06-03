import { createServer } from 'vite';
import { resolveClientPath } from './resolve-path';

import type { ViteDevServer } from 'vite';

let viteDevServer: ViteDevServer;

/**
 * get vite server
 * @param opts options
 * @param opts.force create vite server forcibly
 * @returns instance of vite server
 */
export async function getViteServer({ force } = { force: false }) {
  if (!viteDevServer || force) {
    viteDevServer = await createServer({
      root: resolveClientPath(),
      publicDir: resolveClientPath('public'),
      server: {
        middlewareMode: true,
      },
      appType: 'custom',
    });
  }

  return viteDevServer;
}
