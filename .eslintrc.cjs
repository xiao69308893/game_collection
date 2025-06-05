/* eslint-env node */
module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        'eslint:recommended',
        '@vue/eslint-config-typescript',
        'plugin:vue/vue3-essential'
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
        ecmaVersion: 'latest',
        parser: '@typescript-eslint/parser',
        sourceType: 'module'
    },
    plugins: [
        '@typescript-eslint',
        'vue'
    ],
    rules: {
        // Vue特定规则
        'vue/multi-word-component-names': 'off',
        'vue/no-unused-vars': 'error',
        'vue/no-unused-components': 'warn',
        'vue/component-definition-name-casing': ['error', 'PascalCase'],
        'vue/component-name-in-template-casing': ['error', 'PascalCase'],
        'vue/custom-event-name-casing': ['error', 'camelCase'],
        'vue/define-macros-order': ['error', {
            order: ['defineProps', 'defineEmits']
        }],
        'vue/html-self-closing': ['error', {
            html: {
                void: 'always',
                normal: 'always',
                component: 'always'
            },
            svg: 'always',
            math: 'always'
        }],
        'vue/max-attributes-per-line': ['error', {
            singleline: { max: 1 },
            multiline: { max: 1 }
        }],
        'vue/first-attribute-linebreak': ['error', {
            singleline: 'ignore',
            multiline: 'below'
        }],
        'vue/html-closing-bracket-newline': ['error', {
            singleline: 'never',
            multiline: 'always'
        }],
        'vue/order-in-components': ['error', {
            order: [
                'el',
                'name',
                'key',
                'parent',
                'functional',
                ['delimiters', 'comments'],
                ['components', 'directives', 'filters'],
                'extends',
                'mixins',
                ['provide', 'inject'],
                'ROUTER_GUARDS',
                'layout',
                'middleware',
                'validate',
                'scrollToTop',
                'transition',
                'loading',
                'inheritAttrs',
                'model',
                ['props', 'propsData'],
                'emits',
                'setup',
                'data',
                'computed',
                'watch',
                'watchQuery',
                'LIFECYCLE_HOOKS',
                'methods',
                ['template', 'render'],
                'renderError'
            ]
        }],

        // TypeScript特定规则
        '@typescript-eslint/no-unused-vars': ['error', {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_'
        }],
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'warn',
        '@typescript-eslint/prefer-optional-chain': 'error',
        '@typescript-eslint/prefer-nullish-coalescing': 'error',
        '@typescript-eslint/no-unnecessary-type-assertion': 'error',
        '@typescript-eslint/no-empty-interface': 'warn',

        // 通用JavaScript/TypeScript规则
        'indent': ['error', 2, { SwitchCase: 1 }],
        'linebreak-style': ['error', 'unix'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'never'],
        'comma-dangle': ['error', 'never'],
        'no-trailing-spaces': 'error',
        'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
        'eol-last': ['error', 'always'],
        'object-curly-spacing': ['error', 'always'],
        'array-bracket-spacing': ['error', 'never'],
        'computed-property-spacing': ['error', 'never'],
        'space-before-function-paren': ['error', 'never'],
        'keyword-spacing': ['error', { before: true, after: true }],
        'space-infix-ops': 'error',
        'comma-spacing': ['error', { before: false, after: true }],
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-var': 'error',
        'prefer-const': 'error',
        'prefer-arrow-callback': 'error',
        'arrow-spacing': 'error',
        'no-duplicate-imports': 'error',
        'no-useless-rename': 'error',
        'object-shorthand': 'error',
        'prefer-template': 'error',
        'template-curly-spacing': ['error', 'never'],

        // 最佳实践
        'curly': ['error', 'all'],
        'eqeqeq': ['error', 'always'],
        'no-eval': 'error',
        'no-implied-eval': 'error',
        'no-new-wrappers': 'error',
        'no-throw-literal': 'error',
        'no-undef-init': 'error',
        'no-unused-expressions': 'error',
        'prefer-promise-reject-errors': 'error',

        // 可能的错误
        'no-await-in-loop': 'warn',
        'no-constant-condition': 'warn',
        'no-duplicate-case': 'error',
        'no-empty': 'error',
        'no-extra-boolean-cast': 'error',
        'no-extra-semi': 'error',
        'no-func-assign': 'error',
        'no-irregular-whitespace': 'error',
        'no-unreachable': 'error',
        'valid-typeof': 'error'
    },
    globals: {
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly'
    },
    overrides: [
        {
            files: ['*.vue'],
            rules: {
                // Vue文件中的特殊规则
                'indent': 'off',
                'vue/script-indent': ['error', 2, { baseIndent: 0 }]
            }
        },
        {
            files: ['src/types/**/*.ts'],
            rules: {
                // 类型定义文件允许空接口
                '@typescript-eslint/no-empty-interface': 'off'
            }
        },
        {
            files: ['src/games/**/*.ts'],
            rules: {
                // 游戏文件允许使用any类型
                '@typescript-eslint/no-explicit-any': 'off'
            }
        },
        {
            files: ['vite.config.*', '*.config.*'],
            rules: {
                // 配置文件允许使用console
                'no-console': 'off'
            }
        }
    ]
}
