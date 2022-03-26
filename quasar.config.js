/* eslint-env node */
const { configure } = require('quasar/wrappers')
const path = require('path')

module.exports = configure(function (/* ctx */) {
  return {
    eslint: {
      warnings: true,
      errors: true
    },
    boot: [
      'i18n',
      'axios'
    ],

    css: [
      'app.sass'
    ],

    extras: [
      'roboto-font',
      'material-icons',
      'mdi-v5'
    ],

    build: {
      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node16'
      },

      vueRouterMode: 'hash',
      vitePlugins: [
        ['@intlify/vite-plugin-vue-i18n', {
          include: path.resolve(__dirname, './src/i18n/**')
        }]
      ]
    },

    devServer: {
      open: true,
      port: 8000,
      proxy: {
        '/bk': {
          target: 'http://localhost:9000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/bk/, '')
        }
      }
    },

    framework: {
      config: {},
      plugins: ['Dialog', 'LocalStorage']
    },

    animations: []
  }
})
