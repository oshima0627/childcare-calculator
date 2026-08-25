/**
 * 育児休業給付金シミュレーターは育休ナビへ統合した。
 * 全パスを育休ナビの計算ページへ 301 で送る。
 */
const TARGET = 'https://ikunavi.nexeed-lab.com/calculator';

export default {
  fetch(): Response {
    return Response.redirect(TARGET, 301);
  },
};
