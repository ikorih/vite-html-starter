module.exports = {
  disableEmoji: true,
  format: '{type}{scope}: {emoji}{subject}',
  list: ['mod', 'feat', 'fix', 'chore', 'add', 'docs', 'refactor', 'style', 'ci', 'perf', 'test'],
  maxMessageLength: 64,
  minMessageLength: 3,
  questions: ['type', 'scope', 'subject', 'body', 'breaking', 'issues', 'lerna'],
  scopes: ['', 'frontend', 'backend', '開発環境', '設定ファイル'],
  types: {
    chore: {
      description: 'ビルドプロセスや補助ツールの変更（例：viteの設定変更）',
      emoji: '🤖',
      value: 'chore',
    },
    ci: {
      description: 'CI（継続的インテグレーション）関連の変更。これには、ビルドプロセスの自動化、テストの実行、デプロイプロセスの設定、CIサービス（例：GitHub Actions, Travis CI, GitLab CI）の設定ファイルの追加や更新などが含まれます。',
      emoji: '🎡',
      value: 'ci',
    },
    docs: {
      description: 'ドキュメントのみの変更（例：README.mdの更新）',
      emoji: '✏️',
      value: 'docs',
    },
    feat: {
      description: '新しい機能の追加（例：新しいAPIの実装）',
      emoji: '🎸',
      value: 'feat',
    },
    fix: {
      description: 'バグ修正（例：ユーザーインターフェースの不具合修正）',
      emoji: '🐛',
      value: 'fix',
    },
    perf: {
      description: 'パフォーマンスを向上させるコード変更（例：画像読み込み処理の最適化）',
      emoji: '⚡️',
      value: 'perf',
    },
    refactor: {
      description: 'バグ修正や機能追加を含まないコード変更（コード構造の改善など）',
      emoji: '💡',
      value: 'refactor',
    },
    style: {
      description: 'マークアップ、空白、フォーマット、セミコロンの欠如などのスタイル変更',
      emoji: '💄',
      value: 'style',
    },
    test: {
      description: 'テスト追加（例：新しい機能テストの追加）',
      emoji: '💍',
      value: 'test',
    },
    mod: {
      description: '既存の機能やコードの変更や改良（例：ユーザーインターフェイスの微調整）',
      emoji: '🛠',
      value: 'mod',
    },
    add: {
      description: '新しいファイルやリソースの追加（例：画像やフォントファイルの追加）',
      emoji: '➕',
      value: 'add',
    },
  },
};
