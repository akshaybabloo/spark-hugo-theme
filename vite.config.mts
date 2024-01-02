import {defineConfig, loadEnv} from 'vite';
import {resolve} from 'path'

export default defineConfig(({mode}) => {
    console.log("Build mode:", mode);
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};
    return {
        define: {
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || mode),
            '__VUE_PROD_DEVTOOLS__': mode === 'development',
            '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': mode === 'development',
            '__VUE_OPTIONS_API__': true,
        },
        resolve: {
            alias: {
                'vue': resolve(__dirname, '../../node_modules/vue/dist/vue.esm-bundler.js'),
            },
        },
        build: {
            minify: mode === 'production',
            outDir: resolve(__dirname, 'static'),
            emptyOutDir: false,
            lib: {
                entry: resolve(__dirname, 'src/app.ts'),
                name: 'main',
                fileName: (format) => `main.${format}.js`
            },
            rollupOptions: {
                output: {
                    assetFileNames: (assetInfo) => {
                        let extType = assetInfo.name.split('.').at(1);
                        if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
                            extType = 'img';
                        } else if (/woff|woff2/.test(extType)) {
                            extType = "css";
                        }
                        if (assetInfo.name === 'style.css') return 'css/main.css';
                        return `${extType}/[name][extname]`;
                    },
                    chunkFileNames: 'js/[name].[format].js',
                    entryFileNames: 'js/[name].[format].js',
                }
            }
        }
    }
});
