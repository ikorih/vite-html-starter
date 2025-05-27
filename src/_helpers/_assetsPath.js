import Handlebars from 'handlebars';

/**
 * {{assetsPath}} helper
 * 常に "/assets/" を返します。
 */
export function assetsPath() {
  return new Handlebars.SafeString('/assets/');
}
