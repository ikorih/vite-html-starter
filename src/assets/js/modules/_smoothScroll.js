'use strict';

export default class SmoothScroll {
  /**
   * コンストラクタ
   * @param {Object} options - 初期化オプション
   */
  constructor(options = {}) {
    const defaultOptions = {
      offset: 0,
      duration: 500,
      noScrollClass: 'js-no-scroll', // 発動を無視するクラス名のデフォルト
      headerClass: null, // headerのクラス名（高さを自動取得するオプション）
      beforeScroll: null, // スクロール開始前のコールバック関数
      afterScroll: null, // スクロール完了後のコールバック関数
    };

    // デフォルトオプションと引数で渡されたオプションをマージ
    this.options = Object.assign({}, defaultOptions, options);

    // イージング関数をオプションに追加
    this.options.ease = {
      easeInOut: function (t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      },
    };

    // `#`を含むすべてのリンクを取得
    this.triggers = Array.from(document.querySelectorAll('a[href*="#"]'));
    this._eventHandlers = []; // イベントハンドラを保存する配列

    // オフセットを動的に設定
    this._setDynamicOffset();
    this._init();
  }

  /**
   * ヘッダー要素の高さを取得してオフセットに設定
   */
  _setDynamicOffset() {
    if (typeof this.options.offset === 'string') {
      const headerElement = document.querySelector(this.options.offset);
      if (headerElement) {
        this.options.offset = headerElement.offsetHeight;
      } else {
        this.options.offset = 0;
      }
    }
  }

  /**
   * 初期化処理
   */
  _init() {
    this.triggers.forEach((trigger) => {
      const clickHandler = (e) => {
        // noScrollClassがある場合はスムーズスクロールを無効に
        if (trigger.classList.contains(this.options.noScrollClass)) {
          return;
        }

        const href = trigger.getAttribute('href');
        const hashIndex = href.indexOf('#');
        if (hashIndex === -1) {
          return; // ハッシュが含まれないリンクは無視
        }

        const currentUrl = new URL(window.location.href);
        const targetUrl = new URL(href, window.location.origin);

        if (
          hashIndex === 0 || // ハッシュのみの場合は許可
          (currentUrl.pathname === targetUrl.pathname && currentUrl.search === targetUrl.search) // 同一ページの場合は許可
        ) {
          // ハッシュリンクが現在のページに対応していれば、SmoothScrollを発火
          const targetId = href.slice(hashIndex + 1);
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            e.preventDefault();
            e.stopPropagation();
            const customOffset = trigger.dataset.offset ? this._getOffsetValue(trigger.dataset.offset) : null;
            this.scrollToElement(targetElement, customOffset);
          }
        } else {
          // SmoothScrollを無効化
          return;
        }
      };

      // イベントを追加し、ハンドラを保存
      trigger.addEventListener('click', clickHandler);
      this._eventHandlers.push({ trigger, handler: clickHandler });
    });
  }

  /**
   * 指定した要素にスムーズスクロール
   * @param {HTMLElement} targetElement - スクロール先の要素
   * @param {number|null} customOffset - （オプション）data-offset の値をピクセルに変換したもの。存在すれば this.options.offset を上書きする。
   */
  scrollToElement(targetElement, customOffset = null) {
    const effectiveOffset = customOffset !== null ? customOffset : this.options.offset;
    const currentPosition = window.pageYOffset || document.documentElement.scrollTop;
    const targetPosition = targetElement.getBoundingClientRect().top + currentPosition - effectiveOffset;
    const startTime = performance.now();

    // スクロール開始前のコールバック
    if (typeof this.options.beforeScroll === 'function') {
      this.options.beforeScroll(targetElement);
    }

    const loop = (nowTime) => {
      const time = nowTime - startTime;
      const normalizedTime = time / this.options.duration;
      if (normalizedTime < 1) {
        window.scrollTo(0, currentPosition + (targetPosition - currentPosition) * this.options.ease.easeInOut(normalizedTime));
        requestAnimationFrame(loop);
      } else {
        window.scrollTo(0, targetPosition);

        // フォーカスをターゲット要素に設定
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus({ preventScroll: true });
        targetElement.removeAttribute('tabindex');

        // スクロール完了後のコールバック
        if (typeof this.options.afterScroll === 'function') {
          this.options.afterScroll(targetElement);
        }
      }
    };
    requestAnimationFrame(loop);
  }

  /**
   * animateScroll メソッド - 外部から要素を指定してスクロール
   * @param {string | HTMLElement} target - スクロール先のセレクタまたは要素
   */
  animateScroll(target) {
    let targetElement = null;

    // セレクタまたは要素を処理
    if (typeof target === 'string') {
      targetElement = document.querySelector(target);
    } else if (target instanceof HTMLElement) {
      targetElement = target;
    }

    // ターゲットが存在する場合にスクロールを実行
    if (targetElement) {
      this.scrollToElement(targetElement);
    }
  }

  _getOffsetValue(offsetStr) {
    if (!offsetStr) {
      return 0;
    }
    if (offsetStr.endsWith('rem')) {
      const remValue = parseFloat(offsetStr);
      const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      return remValue * rootFontSize;
    } else if (offsetStr.endsWith('px')) {
      return parseFloat(offsetStr);
    }
    return parseFloat(offsetStr);
  }

  /**
   * イベントハンドラを解除し、インスタンスを破棄
   */
  destroy() {
    this._eventHandlers.forEach(({ trigger, handler }) => {
      trigger.removeEventListener('click', handler);
    });
    this._eventHandlers = [];
  }
}
