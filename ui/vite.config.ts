import {defineConfig, PluginOption} from 'vite'
import vue from '@vitejs/plugin-vue'
import {treatAsCommonjs} from 'vite-plugin-treat-umd-as-commonjs'
// @ts-ignore
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
	define: {
		'process.env': {}
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@use "design-system/src/assets/tokens/ods.scss" as *;`,
			},
		},
	},
	plugins: [
		cssInjectedByJsPlugin(),
		treatAsCommonjs() as any as PluginOption, // treatAsCommonjs currently returns a Plugin_2 instance
		vue({
			template: {
				compilerOptions: {
					whitespace: 'preserve'
				}
			}
		}),
	],
	resolve: {
		dedupe: ['vue3-gettext'],
		alias: {
			buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
			path: 'rollup-plugin-node-polyfills/polyfills/path',

			// owncloud-sdk // sax
			stream: 'rollup-plugin-node-polyfills/polyfills/stream',
			util: 'rollup-plugin-node-polyfills/polyfills/util',
			string_decoder: 'rollup-plugin-node-polyfills/polyfills/string-decoder',
			process: 'rollup-plugin-node-polyfills/polyfills/process-es6',
			events: 'rollup-plugin-node-polyfills/polyfills/events'
		}
	},
	build: {
		lib: {
			name: 'arcade',
			fileName: 'arcade',
			entry: './src/index.ts',
			formats: ['umd']
		},
		rollupOptions: {
			external: ['vue', 'vue3-gettext'],
			output: {
				globals: {
					vue: 'Vue',
					'vue3-gettext': 'vue3Gettext' //??
				},
			},
		},
	}
})
