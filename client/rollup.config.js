import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import autoPreprocess from 'svelte-preprocess';
import scssPlugin from 'rollup-plugin-scss';
import replace from '@rollup/plugin-replace';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/js/main.ts',
	output: {
		sourcemap: true,
		format: 'es',
		name: 'app',
		dir: '../public/js',
		chunkFileNames: '[name].js',
	},
	plugins: [
		svelte({
			dev: !production,
			extensions: ['.svelte'],
			css: (css) => {
				css.write('../public/css/main-svelte.css');
			},
			preprocess: autoPreprocess({
				sourceMap: !production,
			}),
		}),
		resolve({
			browser: true,
			dedupe: ['svelte'],
		}),
		commonjs(),

		production && terser(),
		scssPlugin({
			output: '../public/css/main.css',
		}),

		replace({
			process: JSON.stringify({
				env: {
					isProd: production,
				},
			}),
		}),
	],
	watch: {
		clearScreen: false,
	},
};
