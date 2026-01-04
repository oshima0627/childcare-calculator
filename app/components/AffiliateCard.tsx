/**
 * アフィリエイトカードコンポーネント
 * A8.netのバナー広告を表示
 */

import './AffiliateCard.css'

export default function AffiliateCard() {
  return (
    <div className="affiliate-card">
      <div className="affiliate-label">PR</div>
      <div className="affiliate-content">
        <a
          href="https://px.a8.net/svt/ejp?a8mat=4AUXWS+FT6F3M+1IRY+1TK1F5"
          rel="nofollow noopener noreferrer"
          target="_blank"
          className="affiliate-link"
        >
          <img
            src="https://www22.a8.net/svt/bgt?aid=260104492956&wid=001&eno=01&mid=s00000007099011011000&mc=1"
            alt="保険見直し本舗"
            width="336"
            height="280"
            className="affiliate-banner"
          />
        </a>
        <img
          src="https://www12.a8.net/0.gif?a8mat=4AUXWS+FT6F3M+1IRY+1TK1F5"
          alt=""
          width="1"
          height="1"
          className="affiliate-tracking"
        />
      </div>
    </div>
  )
}
