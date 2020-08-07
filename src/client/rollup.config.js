import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import scssPlugin from 'rollup-plugin-scss';
import typescript from '@rollup/plugin-typescript';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'js/test.js',
	output: {
		sourcemap: true,
		format: 'es',
		name: 'app',
		dir: '../../public/js',
		chunkFileNames: '[name].js',
	},
	plugins: [
		typescript({ sourceMap: !production }),
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: (css) => {
				css.write('../../public/css/main-svelte.css');
			},
			preprocess: sveltePreprocess({
				sourceMap: !production,
			}),
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte'],
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		// !production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		// !production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),
		scssPlugin({
			output: '../../public/css/main.css',
		}),
	],
	watch: {
		clearScreen: false,
	},
};

function typeCheck() {
	return {
		writeBundle() {
			require('child_process').spawn('svelte-check', {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true,
			});
		},
	};
}

// function serve() {
// 	let started = false;

// 	return {
// 		writeBundle() {
// 			if (!started) {
// 				started = true;

// 				require('child_process').spawn(
// 					'npm',
// 					['run', 'start', '--', '--dev'],
// 					{
// 						stdio: ['ignore', 'inherit', 'inherit'],
// 						shell: true,
// 					}
// 				);
// 			}
// 		},
// 	};
// }
