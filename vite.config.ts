import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';

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
        theme_color: '#323232',
        categories: ['weather'],
        lang: 'fi',
        background_color: '#323232',
        description:
          'Kännykälle optimoidusta palvelusta näet lähiajan sään yhdellä vilkaisulla ja nopeiten. Säädata tulee Ilmatieteen laitokselta.',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
    visualizer(),
  ],
};
