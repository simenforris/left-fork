// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  server: {
    host: true,
  },

  output: 'server',

  integrations: [vue(), react()],
});
