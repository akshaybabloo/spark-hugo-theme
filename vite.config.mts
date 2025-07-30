import { defineConfig, loadEnv, Plugin } from 'vite'
import { resolve } from 'path'
import { execSync } from 'child_process'
import { promises as fs } from 'fs'
import tailwindcss from '@tailwindcss/vite'

const gitHash = execSync('git rev-parse --short HEAD').toString().trim()

/**
 * Preserve go comment in html file
 *
 * @returns {Plugin}
 */
function preserveGoCommentPlugin(): Plugin {
	return {
		name: 'preserve-go-comment',
		async writeBundle(options, bundle) {
			for (const fileName in bundle) {
				if (fileName.endsWith('.html') && options.dir) {
					const filePath = resolve(options.dir, fileName)
					let content = await fs.readFile(filePath, 'utf8')
					content = content.replace('{{/**/}}', '{{/*<script type="module" src="../../src/app.ts"></script>*/}}')
					const newFilePath = resolve(options.dir, '..', fileName)
					await fs.writeFile(newFilePath, content, 'utf8')
					await fs.rm(resolve(options.dir, fileName))
				}
			}
		},
	}
}

/**
 * Clean file content
 *
 * @returns {Plugin}
 */
function cleanFileContentPlugin(): Plugin {
	return {
		name: 'clean-file-content',
		transform(code, id) {
			if (id.endsWith('.html')) {
				// Extract and preserve Go-style comments
				const goComments = code.match(/{{\/\*.*?\*\/}}/gs) || []
				const newContent = goComments.join('\n')
				return {
					code: newContent,
					map: null, // if you don't have a source map, return null
				}
			}
		},
	}
}

export default defineConfig(({ mode }) => {
	console.log('Build mode:', mode)
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
	return {
		plugins: [cleanFileContentPlugin(), preserveGoCommentPlugin(), tailwindcss()],
		// esbuild: {
		//     legalComments: 'none',
		//     minify: true,
		// },
		define: {
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || mode),
			__VUE_PROD_DEVTOOLS__: mode === 'development',
			__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: mode === 'development',
			__VUE_OPTIONS_API__: true,
			__GIT_HASH__: JSON.stringify(gitHash),
		},
		resolve: {
			alias: {
				vue: resolve(__dirname, '../../node_modules/vue/dist/vue.esm-bundler.js'),
			},
		},
		build: {
			sourcemap: true,
			minify: mode === 'production',
			outDir: resolve(__dirname, 'static'),
			emptyOutDir: false,
			rollupOptions: {
				output: {
					assetFileNames: (assetInfo) => {
						let extType = assetInfo.names[0].split('.').at(1) || ''
						if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
							extType = 'img'
						} else if (/woff|woff2/.test(extType)) {
							extType = 'css'
						} else if (/css/.test(extType)) {
							extType = 'css'
						}
						return `${extType}/[name]-[hash][extname]`
					},
					chunkFileNames: 'js/[name]-[hash].[format].js',
					entryFileNames: 'js/[name]-[hash].[format].js',
					manualChunks: {
						vue: ['vue'],
						'@fortawesome/fontawesome-svg-core': ['@fortawesome/fontawesome-svg-core'],
						'@fortawesome/free-brands-svg-icons': ['@fortawesome/free-brands-svg-icons'],
						'@fortawesome/free-solid-svg-icons': ['@fortawesome/free-solid-svg-icons'],
						'@algolia/client-search': ['@algolia/client-search'],
						'@microsoft/clarity': ['@microsoft/clarity'],
					},
				},
				input: {
					app: resolve(__dirname, 'layouts/partials/main-script.html'),
				},
			},
		},
		css: {
			preprocessorOptions: {
				scss: {
					api: 'modern-compiler',
				},
			},
		},
	}
})
