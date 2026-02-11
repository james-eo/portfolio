import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  { ignores: ['**/.next/**', '**/node_modules/**', '**/__tests__/**'] },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // Project uses the automatic JSX runtime - importing React in scope is not required
      'react/react-in-jsx-scope': 'off',
    },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    ignores: ['**/.next/**', '**/node_modules/**'],
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
  },
]);
