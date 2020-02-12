import { Configuration } from '@nuxt/types'
import TerserPlugin from 'terser-webpack-plugin'

const modules: any[] = ['@nuxtjs/pwa']

if (process.env.NODE_ENV !== 'production') {
  modules.push(['@nuxtjs/dotenv', { path: './' }])
}

const config: Configuration = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [{ src: 'https://apis.google.com/js/api.js' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/country-emoji-frag.client.ts'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxt/typescript-build',
    '@nuxtjs/tailwindcss'
  ],
  /*
   ** Nuxt.js modules
   */
  modules,
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, { isClient }): void {
      if (!config.optimization || !isClient) return

      if (!config.optimization.minimizer) {
        config.optimization.minimizer = []
      }

      config.optimization.minimizer.push(
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: process.env.NODE_ENV === 'production'
            }
          }
        })
      )
    }
  },
  srcDir: 'src',
  router: {
    base: '/'
  }
}

export default config
