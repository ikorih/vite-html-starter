'use strict';

import TouchDetect from './modules/_touchDetect.js';
import SmoothScroll from './modules/_smoothScroll';
import ViewportTracker from './modules/_viewportTracker.js';

// import { Splide } from '@splidejs/splide';
// import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
// import { Intersection } from '@splidejs/splide-extension-intersection';
// import 'simplebar';

const App = {};

App.config = {
  breakpoint: 990,
};

App.common = function () {
  // タッチデバイス判定
  new TouchDetect();

  // スムーススクロール
  new SmoothScroll({
    offset: '.l-header',
    duration: 500,
    noScrollClass: 'js-no-scroll',
    beforeScroll: () => {},
  });

  new ViewportTracker(['.scr'], null, {
    rootMargin: '0px 0px -10px 0px',
    threshold: 0,
    once: true,
  });
};

document.addEventListener('DOMContentLoaded', () => {
  App.common();
});
