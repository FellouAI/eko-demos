import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs',
      format: 'cjs'
    }
  ],
  external: [
    // Mark the native module as an external dependency to avoid Rollup from packaging them.
    'robotjs',
    'screenshot-desktop', 
    'canvas',
    'playwright',
    // Node.js built-in modules
    'fs',
    'path',
    'os',
    'child_process',
    'util',
    'stream',
    'events',
    'crypto',
    'url',
    'buffer',
    'zlib'
  ],
  plugins: [
    json(),
    commonjs({
      // Ignore binary files
      ignore: ['**/*.node']
    }),
    resolve({
      preferBuiltins: true,
      // Skip the parsing of the native module
      skip: ['robotjs', 'screenshot-desktop', 'canvas']
    }),
    typescript()
  ]
};