module.exports = {
    root: true,
    env: { node: true },
    extends: [
        'plugin:vue/vue3-recommended',
        '@vue/eslint-config-typescript/recommended',
        'plugin:prettier/recommended'
    ],
    rules: {
        'vue/multi-word-component-names': 'off',
        'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        'no-console': ['error', { allow: ['warn', 'error'] }],
        'consistent-return': 'error',
        'no-implicit-coercion': 'error',
        'eqeqeq': ['error', 'always'],
        'curly': 'error',
        'no-debugger': 'error',
    }
};
