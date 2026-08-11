import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import sonarjs from 'eslint-plugin-sonarjs';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  sonarjs.configs.recommended,
  {
    rules: {
      // --- Complexity ---
      'sonarjs/cognitive-complexity': ['warn', 15],
      'complexity': ['warn', { max: 12 }],
      'max-depth': ['warn', 3],

      // --- Early return / guard clauses ---
      'no-else-return': ['warn', { allowElseIf: false }],
      'no-lonely-if': 'warn',
      'consistent-return': 'warn',

      // --- Nested ifs / redundant conditionals ---
      'no-nested-ternary': 'error',
      'sonarjs/no-collapsible-if': 'warn',
      'sonarjs/no-identical-conditions': 'error',
      'sonarjs/no-all-duplicated-branches': 'error',
      'sonarjs/no-duplicated-branches': 'warn',

      // --- Loops ---
      'no-unmodified-loop-condition': 'error',
      'for-direction': 'error',

      // --- Duplicated Strings ---
      'sonarjs/no-duplicate-string': ['error', { threshold: 3 }],

      // --- Unsafe type assertions ---
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSAsExpression > TSNeverKeyword',
          message: '"as never" is forbidden. Use a proper type cast like "as (key: string) => string" or a type guard instead.',
        },
        {
          selector: 'TSAsExpression > TSUnknownKeyword',
          message: '"as unknown" intermediate casts are forbidden. Use a type guard or a direct type-safe cast instead.',
        },
      ],
    },
  },
);
