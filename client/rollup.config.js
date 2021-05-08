import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import scssPlugin from 'rollup-plugin-scss';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import autoPreprocess from 'svelte-preprocess';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/js/main.ts',
	output: {
		sourcemap: !production,
		format: 'es',
		name: 'app',
		dir: '../public',
		// entryFileNames: 'js/main.js',
		chunkFileNames: 'js/[name].js',
	},
	plugins: [
		svelte({
			extensions: ['.svelte'],
			exclude: 'src/js/main.ts',
			emitCss: true,
			compilerOptions: {
				dev: !production,
				// css: (css) => {
				// 	css.write('css/main-svelte.css');
				// },
			},
			preprocess: autoPreprocess({ sourceMap: !production }),
		}),
		resolve({
			browser: true,
			dedupe: ['svelte'],
		}),
		commonjs(),
		typescript({ sourceMap: !production, inlineSources: !production }),

		production && terser(),
		scssPlugin({
			output: '../public/css/main.css',
		}),

		replace({
			preventAssignment: true,
			'process.env': JSON.stringify({
				isProd: production,
			}),
		}),
	],
	watch: {
		clearScreen: false,
	},
};
