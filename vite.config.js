import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import handlebarsPlugin from 'vite-plugin-handlebars';
import Handlebars from 'handlebars';
import layouts from 'handlebars-layouts';
import tailwindcss from '@tailwindcss/vite';
import eslintPlugin from 'vite-plugin-eslint';
import { MLEngine } from 'markuplint';
import viteImagemin from 'vite-plugin-imagemin';
import siteDataJson from './src/_data/siteData.json';
import pageDataJson from './src/_data/pageData.json';

import { assetsPath } from './src/_helpers/_assetsPath.js';

import postcssPresetEnv from 'postcss-preset-env';

Handlebars.registerHelper(layouts(Handlebars)); // Handlebars に layouts ヘルパー群を登録

export default defineConfig({
  root: 'src',
  plugins: [
    handlebarsPlugin({
      partialDirectory: resolve(__dirname, './src/_components'),
      handlebars: Handlebars,
      context(pagePath) {
        const cwd = process.cwd(); // プロジェクトルート
        const fullPath = resolve(cwd, 'src', pagePath);
        return {
          siteData: siteDataJson,
          pageData: pageDataJson[pagePath], //各ページ情報の読み込み
          file: {
            cwd,
            path: fullPath,
          },
        };
      },
      helpers: {
        assetsPath,
      },
    }),
    tailwindcss(),
    viteImagemin({
      // JPG/PNG → WebP に変換
      webp: {
        quality: 75,
      },
      // それ以外（SVG, ICO, PNG, JPG）の圧縮設定
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 75,
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4,
      },
      svgo: {
        plugins: [
          // 「viewBox を削除する」プラグインを無効化
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false,
              },
            },
          },
        ],
      },
      // 開発サーバ中は実行不要なら以下を追加してビルド時のみ有効化
      // apply: 'build',
    }),
    eslintPlugin({
      // save 時だけ走らせる
      emitWarning: true,
      emitError: false,
      failOnError: false,
      // キャッシュ有効化で 2 回目以降は速い
      cache: true,
    }),
    {
      name: 'vite-plugin-markuplint-custom',
      enforce: 'pre',

      // index.html を処理するフック
      transformIndexHtml: {
        // order: 'pre', // 必要なら
        async handler(html, ctx) {
          const relPath = ctx.path.replace(/^\//, '');
          const filePath = resolve(process.cwd(), 'src', relPath);

          const mlFile = await MLEngine.toMLFile(filePath);
          const engine = new MLEngine(mlFile);
          const result = await engine.exec();
          if (result) {
            for (const v of result.violations) {
              const msg = `${filePath}:${v.line}:${v.column} ${v.message}`;
              // dev サーバー起動時は Vite のロガーを使う
              if (ctx.server) {
                ctx.server.config.logger.warn(msg);
              } else {
                // build 時やサーバーがない場合は普通にコンソールへ
                console.warn(msg);
              }
            }
          }
          return html;
        },
      },

      // Nunjucks 等のテンプレート（.njk/.hbs）向け
      async transform(code, id) {
        const clean = id.split('?')[0];
        if (!/\.(njk|hbs)$/.test(clean)) return null;
        const rel = clean.replace(/^\//, '');
        const filePath = resolve(process.cwd(), 'src', rel);

        const mlFile = await MLEngine.toMLFile(filePath);
        const engine = new MLEngine(mlFile);
        const result = await engine.exec();
        if (result) {
          for (const v of result.violations) {
            // こちらは transform フックなので this.warn が使えます
            this.warn(`${filePath}:${v.line}:${v.column} ${v.message}`);
          }
        }
        return null;
      },
    },
  ],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/js/[name].js',
        chunkFileNames: 'assets/js/[name].js',

        assetFileNames: (assetInfo) => {
          const ext = assetInfo.name?.split('.').pop();

          // 画像ファイルは img/ フォルダに
          if (ext && /(png|jpe?g|svg|gif|webp|ico)$/.test(ext)) {
            return 'assets/img/[name][extname]';
          }

          // CSS ファイルは css/ フォルダに
          if (ext === 'css') {
            return 'assets/css/[name][extname]';
          }

          // そのほか（フォントなど）は assets/ フォルダなどに
          return 'assets/[name][extname]';
        },
      },
    },
    manifest: false, // マニフェストファイルを生成するかどうか
  },
  css: {
    devSourcemap: true,
    postcss: {
      plugins: [
        postcssPresetEnv({
          features: {
            'cascade-layers': false,
          },
        }),
      ],
    },
  },
  server: {
    port: 3000, // 開発サーバーのポート番号
    open: true, // 開発サーバー起動時にブラウザを自動で開く
    host: true, // ホスト名を自動で解決
  },
  optimizeDeps: {
    include: ['gsap'],
  },
});
