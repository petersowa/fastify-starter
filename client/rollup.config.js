import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import terser from '@rollup/plugin-terser';
import scssPlugin from 'rollup-plugin-scss';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import autoPreprocess from 'svelte-preprocess';
import serve from 'rollup-plugin-serve';
import { config } from 'dotenv';

const production = !process.env.ROLLUP_WATCH;

const ENV_CONFIG = config().parsed;
console.log(ENV_CONFIG);

// const replaceOpts = {
// 	'__myapp.env.isProd': JSON.stringify(production),
// 	'__myapp.env.__buildDate__': () => new Date(),
// 	'__myapp.env.TEST': ENV_CONFIG.TEST,
// 	'__myapp.env.DEV_HOST': JSON.stringify(ENV_CONFIG.DEV_HOST),
// };

const replaceOpts = {
	__myappConfig: JSON.stringify({
		env: {
			isProd: production,
			...ENV_CONFIG,
			__BUILD_DATE: new Date(),
		},
	}),
};

// console.log(JSON.stringify(replaceOpts.__myapp.env.__buildDate__()));

export default {
	input: 'src/js/main.ts',
	output: {
		sourcemap: !production,
		format: 'es',
		name: 'app',
		dir: '../public',
		entryFileNames: 'js/main.js',
		chunkFileNames: 'js/[name].js',
	},
	plugins: [
		replace({
			values: replaceOpts,
			preventAssignment: true,
		}),
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

		scssPlugin({
			fileName: 'css/main.css',
		}),
		!production &&
			serve({
				contentBase: '../public',
				verbose: true,
				port: 4999,
				host: 'localhost',
			}),
		!production && livereload('../public'),
		production && terser(),
	],
	watch: {
		clearScreen: false,
	},
};
