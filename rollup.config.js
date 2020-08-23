import merge from 'deepmerge';
// use createSpaConfig for bundling a Single Page App
import { createSpaConfig } from '@open-wc/building-rollup';

import analyze from 'rollup-plugin-analyzer';
import copy from 'rollup-plugin-copy';

const limitBytes = 1140000;

const onAnalysis = ({ bundleSize }) => {
  // eslint-disable-next-line no-console
  console.log(`Bundle size is ${bundleSize} bytes`);

  if (bundleSize > limitBytes) {
    // eslint-disable-next-line no-console
    console.log(`Bundle size exceeds ${limitBytes} bytes: ${bundleSize} bytes`);
    process.exit(1);
  }
};

// use createBasicConfig to do regular JS to JS bundling
// import { createBasicConfig } from '@open-wc/building-rollup';

const baseConfig = createSpaConfig({
  // use the outputdir option to modify where files are output
  // outputDir: 'dist',

  // if you need to support older browsers, such as IE11, set the legacyBuild
  // option to generate an additional build just for this browser
  // legacyBuild: true,

  // development mode creates a non-minified build for debugging or development
  developmentMode: process.env.ROLLUP_WATCH === 'true',

  // set to true to inject the service worker registration into your index.html
  injectServiceWorker: true,
});

export default merge(baseConfig, {
  // if you use createSpaConfig, you can use your index.html as entrypoint,
  // any <script type="module"> inside will be bundled by rollup
  input: './index.html',
  plugins: [
    copy({
      targets: [{ src: './assets/**/*', dest: './dist/' }],
      // set flatten to false to preserve folder structure
      flatten: false,
    }),
    copy({
      targets: [{ src: './robots.txt', dest: './dist/' }],
    }),
    analyze({ onAnalysis, summaryOnly: false }),
  ],

  // alternatively, you can use your JS as entrypoint for rollup and
  // optionally set a HTML template manually
  // input: './app.js',
});
