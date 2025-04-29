import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import handlebars from 'vite-plugin-handlebars';
import tailwindcss from '@tailwindcss/vite';
import viteImagemin from 'vite-plugin-imagemin';
import siteDataJson from './src/_data/siteData.json';
import pageDataJson from './src/_data/pageData.json';

// PostCSS プラグインをインポート
import postcssImport from 'postcss-import';
import postcssMixins from 'postcss-mixins';
import postcssNested from 'postcss-nested';
import postcssEach from 'postcss-each';
import postcssConditionals from 'postcss-conditionals';
import postcssCustomMedia from 'postcss-custom-media';
import postcssCustomProperties from 'postcss-custom-properties';
import postcssGlobalData from '@csstools/postcss-global-data';

export default defineConfig({
  // base: '/src', //ルートパスの設定
  root: 'src', // ソースフォルダを "src" に設定
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, './src/_components'), //コンポーネントの格納ディレクトリを指定
      context(pagePath) {
        return {
          siteData: siteDataJson,
          pageData: pageDataJson[pagePath], //各ページ情報の読み込み
        };
      },
      helpers: {
        html: (contents) => {
          // 変数内のhtmlタグを描画する
          // ローカルにおくので外部から悪意のあるコードを差し込まれる可能性などは考慮しない
          const str = contents;
          return str;
        },
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
  ],
  build: {
    outDir: '../dist', // 出力先ディレクトリを "dist" に設定
    emptyOutDir: true, // 出力先ディレクトリを空にする
    rollupOptions: {
      output: {
        // JS は js/ フォルダへ
        entryFileNames: 'assets/js/[name].js',
        chunkFileNames: 'assets/js/[name].js',

        // 画像・フォント・CSS などその他アセットは assetFileNames で振り分け
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
    modules: {
      // 必要に応じて CSS Modules を有効化
      scopeBehaviour: 'local',
      localsConvention: 'camelCaseOnly',
    },
    postcss: {
      plugins: [
        postcssImport(),
        postcssGlobalData({
          files: [resolve(__dirname, 'src/assets/css/_config/_custom-media.css')],
        }),
        postcssMixins(),
        postcssNested(),
        postcssEach(),
        postcssConditionals(),
        postcssCustomMedia(),
        postcssCustomProperties({
          preserve: true,
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
