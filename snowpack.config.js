/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
  },
  plugins: ['@snowpack/plugin-typescript', '@snowpack/plugin-postcss'],
  optimize: {
    bundle: true,
    target: 'es2020',
    minify: true,
    treeshake: true,
  },
  devOptions: {
    open: 'none',
  },
}
