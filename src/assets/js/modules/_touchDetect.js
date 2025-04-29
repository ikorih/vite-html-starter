'use strict';

/**
 * TouchDetect Class
 * This class detects touch interactions on specified elements and updates the body class
 * to indicate whether the device is being used with touch or mouse input.
 * It also adds a 'touched' class to elements when touched.
 *
 * Options:
 * - selector: Selector for the elements to detect touch interactions (default: 'a').
 *
 * Methods:
 * - destroy: Removes event listeners and cleans up the instance.
 *
 * Example usage:
 * const touchDetect = new TouchDetect('button');
 */

export default class TouchDetect {
  constructor(selector = 'a') {
    this.selector = selector;
    this.els = document.querySelectorAll(this.selector);
    this._init();
  }

  _init() {
    const passiveOpts = { passive: true };
    this.touchStartHandler = this._touched.bind(this);
    this.touchEndHandler = this._touchRemoved.bind(this);
    this.mouseMoveHandler = this._onMouseMove.bind(this);
    this.touchStartDocHandler = this._onTouchStart.bind(this);

    this.els.forEach((el) => {
      el.addEventListener('touchstart', this.touchStartHandler, passiveOpts);
      el.addEventListener('touchend', this.touchEndHandler, passiveOpts);
    });

    document.addEventListener('mousemove', this.mouseMoveHandler);
    document.addEventListener('touchstart', this.touchStartDocHandler, passiveOpts);
  }

  _touched(event) {
    event.currentTarget.classList.add('touched');
  }

  _touchRemoved(event) {
    event.currentTarget.classList.remove('touched');
  }

  _onTouchStart() {
    this._removeDocumentListeners();
    document.body.classList.add('touch-is-active');
    document.body.classList.remove('mouse-is-active');

    // 再度リスナーを追加して、両方のデバイスの入力を考慮する
    document.addEventListener('mousemove', this.mouseMoveHandler);
  }

  _onMouseMove() {
    this._removeDocumentListeners();
    document.body.classList.remove('touch-is-active');
    document.body.classList.add('mouse-is-active');

    // 再度リスナーを追加して、両方のデバイスの入力を考慮する
    document.addEventListener('touchstart', this.touchStartDocHandler);
  }

  _removeDocumentListeners() {
    document.removeEventListener('mousemove', this.mouseMoveHandler);
    document.removeEventListener('touchstart', this.touchStartDocHandler);
  }

  destroy() {
    this.els.forEach((el) => {
      el.removeEventListener('touchstart', this.touchStartHandler);
      el.removeEventListener('touchend', this.touchEndHandler);
    });
    this._removeDocumentListeners();
  }
}
