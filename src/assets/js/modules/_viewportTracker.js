'use strict';

export default class ViewportTracker {
  constructor(els, cb, options = {}) {
    this.els = document.querySelectorAll(els);
    this.cb = cb;

    // デフォルトオプションをスプレッド構文でマージ
    const defaultOptions = {
      root: null,
      rootMargin: '0%',
      threshold: 0,
      once: true,
    };
    this.options = { ...defaultOptions, ...options };

    this.once = this.options.once;

    // 初期化
    this._init();
  }

  _init() {
    // IntersectionObserverのコールバック関数
    const callback = (entries, observer) => {
      entries.forEach((entry) => {
        const isIntersecting = entry.isIntersecting;

        // コールバック関数の実行
        this.cb(entry.target, isIntersecting);

        // `once` オプションに基づいて監視解除
        if (isIntersecting && this.once) {
          observer.unobserve(entry.target);
        }
      });
    };

    // IntersectionObserverのインスタンス作成
    this.io = new IntersectionObserver(callback, this.options);

    // ポリフィル対応（必要な場合のみ有効）
    this.io.POLL_INTERVAL = 100;

    // 各要素を監視
    this.els.forEach((el) => this.io.observe(el));
  }

  // オブザーバーの破棄
  destroy() {
    this.io.disconnect();
  }
}
