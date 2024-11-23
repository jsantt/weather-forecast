import { VitePWA } from 'vite-plugin-pwa';

export default {
  plugins: [
    VitePWA({
      manifest: {
        name: 'saaennuste.fi',
        short_name: 'saaennuste.fi',
        description:
          'Kännykälle optimoidusta palvelusta näet lähiajan sään yhdellä vilkaisulla ja nopeiten. Säädata tulee Ilmatieteen laitokselta.',
        icons: [
          {
            src: 'image/weather-icon-57x57.png',
            type: 'image/png',
            sizes: '57x57',
          },
          {
            src: 'image/weather-icon-144x144.png',
            type: 'image/png',
            sizes: '144x144',
          },
          {
            src: 'image/weather-icon-192x192.png',
            type: 'image/png',
            sizes: '192x192',
          },
          {
            src: 'image/weather-icon-maskable-192x192.png',
            type: 'image/png',
            sizes: '192x192',
            purpose: 'any maskable',
          },
          {
            src: 'image/weather-icon-512x512.png',
            type: 'image/png',
            sizes: '512x512',
          },
        ],
        start_url: '../../index.html',
        display: 'standalone',
        scope: '/',
        theme_color: '#1e517b',
        background_color: '#1e517b',
      },
    }),
  ],
};
