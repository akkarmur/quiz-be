import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import { defineConfig } from 'eslint-define-config'
import autofix from 'eslint-plugin-autofix'
import deprecationPlugin from 'eslint-plugin-deprecation'
import importPlugin from 'eslint-plugin-import'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'

export default defineConfig({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: tsParser,
    parserOptions: {
      project: './tsconfig.json',
    },
    globals: {
      ...globals.node,
      ...globals.es2021,
      ...globals.jest,
    },
  },
  plugins: {
    deprecation: deprecationPlugin,
    '@typescript-eslint': tsPlugin,
    import: importPlugin,
    'simple-import-sort': simpleImportSort,
    'unused-imports': unusedImports,
    autofix,
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
    'unused-imports/no-unused-imports': 'warn',
    'autofix/no-unused-vars': 'warn',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts', '.js'],
      },
    },
  },
  ignores: [
    'node_modules', // Ignore node_modules
    'dist', // Ignore dist directory
    'build', // Ignore build directory
  ],
})
