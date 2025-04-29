import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import handlebars from 'vite-plugin-handlebars';
import tailwindcss from '@tailwindcss/vite';
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
  ],
  build: {
    outDir: '../dist', // 出力先ディレクトリを "dist" に設定
    emptyOutDir: true, // 出力先ディレクトリを空にする
    rollupOptions: {},
    manifest: true, // マニフェストファイルを生成
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
});
