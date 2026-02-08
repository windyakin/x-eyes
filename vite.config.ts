import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import webExtension from '@samrum/vite-plugin-web-extension'
import { resolve } from 'path'
import { readFileSync } from 'fs'

const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'))

export default defineConfig({
  plugins: [
    vue(),
    webExtension({
      manifest: {
        manifest_version: 3,
        name: 'X Eyes',
        version: pkg.version,
        description: 'View tweets cleanly without X\'s interface',
        browser_specific_settings: {
          gecko: {
            id: 'x-eyes@example.com',
            strict_min_version: '142.0',
            data_collection_permissions: {
              required: ['none']
            }
          }
        },
        permissions: ['webRequest', 'webRequestBlocking', 'webNavigation', 'tabs', 'storage'],
        host_permissions: [
          '*://x.com/*',
          '*://twitter.com/*',
          'https://api.fxtwitter.com/*',
          'https://pbs.twimg.com/*',
          'https://video.twimg.com/*'
        ],
        background: {
          scripts: ['src/background/index.ts'],
          type: 'module' as const
        },
        icons: {
          48: 'icons/icon-48.png',
          96: 'icons/icon-96.png'
        },
        web_accessible_resources: [
          {
            resources: ['x-eyes.html', 'twemoji/*'],
            matches: ['*://x.com/*', '*://twitter.com/*']
          }
        ]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: 'dist',
    emptyDirFirst: true,
    rollupOptions: {
      input: {
        'x-eyes': resolve(__dirname, 'x-eyes.html')
      }
    }
  }
})
