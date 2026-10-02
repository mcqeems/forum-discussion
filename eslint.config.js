import { createRequire } from 'module';
import reactPlugin from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import cypressPlugin from 'eslint-plugin-cypress';

const require = createRequire(import.meta.url);
const dicoding = require('eslint-config-dicodingacademy');

export default [
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      react: reactPlugin,
      import: importPlugin,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...dicoding.rules,
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-vars': 'error',
      'react/prop-types': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['cypress/**/*.js'],
    plugins: {
      cypress: cypressPlugin,
    },
    rules: {
      ...cypressPlugin.configs.recommended.rules,
    },
  },
];
