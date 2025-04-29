import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    // JS系ファイルすべてに適用
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],

    // ← ここにルールを追加
    rules: {
      // 行末のセミコロンは必須
      semi: ['error', 'always'],
      // インデントは2スペース
      indent: ['error', 2, { SwitchCase: 1 }],
      // 行末のスペースを禁止
      'no-trailing-spaces': ['error'],
      // 文字列リテラルはシングルコーテーションで囲む
      quotes: ['error', 'single'],
      // キーワードの前後にはスペースが必要
      'keyword-spacing': ['error'],
      // 変数名はcamelCaseで
      camelcase: ['error'],
      // 括弧スタイルは one true brace style (1tbs)
      'brace-style': ['error', '1tbs'],
      // if, while, try-catchなどでは必ずブロックを使う
      curly: ['error'],
      // 比較は必ず ===, !== を使う
      eqeqeq: ['error', 'always'],
      // with文は使わない
      'no-with': ['error'],
      // evalは使わない
      'no-eval': ['error'],
      // String, Number, Boolean はnewしない
      'no-new-wrappers': ['error'],
      // new Array(...), Array(...) を使わない
      'no-array-constructor': ['error'],
      // new Object() を使わない
      'no-new-object': ['error'],
      // コンストラクタ関数名はUpperCamelで
      'new-cap': ['error'],
      // this を代入する変数名は that とする
      'consistent-this': ['error', 'that'],
      // console関数は使わない（警告）
      'no-console': ['warn'],
    },
  },
  {
    // ブラウザグローバルを許可
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: { globals: globals.browser },
  },
]);
