module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['eslint-plugin', 'prettier'],
	extends: ['eslint:recommended'],
	env: {
		browser: true,
		es6: true,
		jest: true,
		node: true,
	},
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
	},
	rules: {
		'@typescript-eslint/no-var-requires': 'off',
		'@typescript-eslint/no-use-before-define': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
	},
};
