import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // ── Service Worker strategy ─────────────────────────────────
      registerType: 'prompt',          // show our own update UI
      injectRegister: 'auto',
      // devOptions only for local testing - not needed in prod
      // devOptions: { enabled: true },

      // ── Assets to include in precache ──────────────────────────
      includeAssets: [
        'favicon.svg',
        'favicon-32x32.png',
        'favicon-96x96.png',
        'apple-touch-icon.png',
        'pwa-192x192.png',
        'pwa-512x512.png',
        'offline.html',
      ],

      // ── Web App Manifest ────────────────────────────────────────
      manifest: {
        name:             'YoYo Rooms — Hotel Booking',
        short_name:       'YoYo Rooms',
        description:      'Book budget to luxury hotels across India. Verified stays, instant confirmation, best prices guaranteed.',
        theme_color:      '#E8003D',
        background_color: '#080810',
        display:          'standalone',
        display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
        orientation:      'portrait-primary',
        start_url:        '/?source=pwa',
        scope:            '/',
        lang:             'en-IN',
        dir:              'ltr',
        categories:       ['travel', 'lifestyle', 'shopping'],

        // ── Icons ─────────────────────────────────────────────────
        icons: [
          {
            src:     '/pwa-64x64.png',
            sizes:   '64x64',
            type:    'image/png',
          },
          {
            src:     '/pwa-192x192.png',
            sizes:   '192x192',
            type:    'image/png',
          },
          {
            src:     '/pwa-512x512.png',
            sizes:   '512x512',
            type:    'image/png',
            purpose: 'any',
          },
          {
            src:     '/pwa-512x512.png',
            sizes:   '512x512',
            type:    'image/png',
            purpose: 'maskable',        // adaptive icon for Android
          },
        ],

        // ── Shortcuts (long-press on Android) ─────────────────────
        shortcuts: [
          {
            name:        'Browse Hotels',
            short_name:  'Hotels',
            description: 'Search and browse all available hotels',
            url:         '/rooms?source=pwa-shortcut',
            icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
          },
          {
            name:        'My Bookings',
            short_name:  'Bookings',
            description: 'View your current and past bookings',
            url:         '/my-bookings?source=pwa-shortcut',
            icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
          },
        ],

        // ── Screenshots (for install dialog on Chrome/Edge) ────────
        screenshots: [
          {
            src:          '/pwa-512x512.png',
            sizes:        '512x512',
            type:         'image/png',
            form_factor:  'narrow',
            label:        'YoYo Rooms home screen',
          },
        ],

        // ── Protocol handlers ──────────────────────────────────────
        protocol_handlers: [
          { protocol: 'web+yoyo', url: '/?q=%s' },
        ],

        // ── Share target (receive shared URLs/text from other apps) ─
        share_target: {
          action:  '/rooms',
          method:  'GET',
          params: { title: 'q', text: 'q', url: 'q' },
        },

        // ── Prefer native ─────────────────────────────────────────
        prefer_related_applications: false,
      },

      // ── Workbox (service worker) ─────────────────────────────────
      workbox: {
        // Precache all build output
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,webp,webmanifest}'],

        // SPA fallback - serve index.html for all app routes (NOT offline.html)
        // offline.html is only served when the network is truly unavailable
        navigateFallback: '/index.html',
        // Only apply SPA fallback to actual app routes (not API, not SW files)
        navigateFallbackAllowlist: [/^(?!\/(api|sw\.js|workbox|offline\.html|assets|pwa|favicon|apple))/],
        navigateFallbackDenylist: [/^\/(api|sw\.js|workbox)/, /\.\w+$/],

        // ── Runtime caching strategies ───────────────────────────
        runtimeCaching: [
          // Cloudinary images — cache-first, 30-day TTL
          {
            urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
            handler:    'CacheFirst',
            options: {
              cacheName:  'cloudinary-images',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },

          // Google Fonts stylesheets — stale-while-revalidate
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler:    'StaleWhileRevalidate',
            options:    { cacheName: 'google-fonts-stylesheets' },
          },

          // Google Fonts files — cache-first, 1-year TTL
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler:    'CacheFirst',
            options: {
              cacheName:  'google-fonts-webfonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },

          // API routes — network-first, 10s timeout
          {
            urlPattern: /\/api\/.*/i,
            handler:    'NetworkFirst',
            options: {
              cacheName:       'api-cache',
              networkTimeoutSeconds: 10,
              expiration:      { maxEntries: 50, maxAgeSeconds: 60 * 5 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },

          // All other same-origin — network-first with short timeout
          {
            urlPattern: ({ url }) => url.origin === self.location.origin,
            handler:    'NetworkFirst',
            options: {
              cacheName:         'app-shell',
              networkTimeoutSeconds: 5,
              expiration:        { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
        ],

        // ── Background sync for offline booking attempts ──────────
        // If user tries to book while offline, the request is queued
        // and retried automatically when connectivity is restored.
        // (requires server to handle idempotency)
      },
    }),
  ],

  // ── Build config ────────────────────────────────────────────────
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react':   ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion':  ['framer-motion'],
          'vendor-http':    ['axios'],
          'vendor-charts':  ['recharts'],
          'vendor-maps':    ['leaflet', 'react-leaflet'],
          'vendor-helmet':  ['react-helmet-async'],
        },
      },
    },
  },
})
