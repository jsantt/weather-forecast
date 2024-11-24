import { VitePWA } from 'vite-plugin-pwa';

export default {
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        id: 'saaennuste',
        name: 'saaennuste.fi',
        short_name: 'saaennuste.fi',
        orientation: 'portrait-primary',
        start_url: '/index.html',
        display: 'standalone',
        scope: '/',
        theme_color: '#1e517b',
        categories: ['weather'],
        lang: 'fi',
        background_color: '#1e517b',
        description:
          'Kännykälle optimoidusta palvelusta näet lähiajan sään yhdellä vilkaisulla ja nopeiten. Säädata tulee Ilmatieteen laitokselta.',
        icons: [
          {
            src: '/weather-icon-57x57.png',
            type: 'image/png',
            sizes: '57x57',
            purpose: 'any',
          },
          {
            src: '/weather-icon-144x144.png',
            type: 'image/png',
            sizes: '144x144',
            purpose: 'any',
          },
          {
            src: '/weather-icon-192x192.png',
            type: 'image/png',
            sizes: '192x192',
            purpose: 'any',
          },
          {
            src: '/weather-icon-maskable-192x192.png',
            type: 'image/png',
            sizes: '192x192',
            purpose: 'maskable',
          },
          {
            src: '/weather-icon-512x512.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'any',
          },
        ],
      },
    }),
  ],
};
