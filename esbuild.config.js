import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['src/index.ts'],
  outfile: 'build/server.cjs',
  bundle: true,
  platform: 'node',
  format: 'iife',
  alias: { '~': 'src' },
  external: ['bcrypt'],
  plugins: [],
})
