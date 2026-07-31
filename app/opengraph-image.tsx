import { ImageResponse } from 'next/og'

// output: 'export'（静的エクスポート）ではビルド時にPNGを生成する
export const dynamic = 'force-static'
export const alt ='育児休業給付金シミュレーター | 手取り額を簡単計算'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1565C0 0%, #2196F3 60%, #42A5F5 100%)',
          fontFamily: 'sans-serif',
          padding: '60px 80px',
          gap: '0px',
        }}
      >
        {/* バッジ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '30px',
            padding: '10px 28px',
            marginBottom: '36px',
            border: '1px solid rgba(255,255,255,0.4)',
          }}
        >
          <span style={{ color: '#ffffff', fontSize: '22px', fontWeight: 600, display: 'flex' }}>
            育休 · 手取り計算ツール
          </span>
        </div>

        {/* タイトル1行目 */}
        <div
          style={{
            display: 'flex',
            fontSize: '76px',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.2,
            marginBottom: '4px',
          }}
        >
          育児休業給付金
        </div>

        {/* タイトル2行目 */}
        <div
          style={{
            display: 'flex',
            fontSize: '76px',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.2,
            marginBottom: '32px',
          }}
        >
          シミュレーター
        </div>

        {/* サブタイトル */}
        <div
          style={{
            display: 'flex',
            fontSize: '28px',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '44px',
          }}
        >
          月額給与を入力するだけ。育休中の手取り額を自動計算。
        </div>

        {/* 特徴バッジ（.map()を使わずハードコード） */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '8px',
              padding: '12px 20px',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            <span style={{ color: '#ffffff', fontSize: '18px', display: 'flex' }}>
              ✓ 67%・50%の給付率を計算
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '8px',
              padding: '12px 20px',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            <span style={{ color: '#ffffff', fontSize: '18px', display: 'flex' }}>
              ✓ 12ヶ月分の詳細表示
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '8px',
              padding: '12px 20px',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            <span style={{ color: '#ffffff', fontSize: '18px', display: 'flex' }}>
              ✓ 社会保険料・税金も考慮
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
