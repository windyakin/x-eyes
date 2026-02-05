export default {
  sourceDir: './dist',
  artifactsDir: './web-ext-artifacts',
  ignoreFiles: [
    '*.map'
  ],
  run: {
    startUrl: ['https://x.com/jack/status/20'],
    browserConsole: true
  },
  build: {
    overwriteDest: true
  }
}
