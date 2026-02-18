import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = '育児休業給付金シミュレーター | 手取り額を簡単計算'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const fontData = await fetch(
    'https://fonts.gstatic.com/s/notosansjp/v53/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEj75s.woff2'
  ).then((res) => res.arrayBuffer())

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
          background: 'linear-gradient(135deg, #1565C0 0%, #2196F3 50%, #42A5F5 100%)',
          position: 'relative',
          fontFamily: '"Noto Sans JP", sans-serif',
        }}
      >
        {/* 背景の装飾サークル */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-60px',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            display: 'flex',
          }}
        />

        {/* メインコンテンツ */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 80px',
            gap: '0px',
            zIndex: 1,
          }}
        >
          {/* バッジ */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '30px',
              padding: '8px 24px',
              marginBottom: '32px',
              border: '1px solid rgba(255,255,255,0.35)',
            }}
          >
            <span style={{ color: '#fff', fontSize: '20px', fontWeight: 600 }}>
              育休 · 手取り計算ツール
            </span>
          </div>

          {/* タイトル */}
          <div
            style={{
              fontSize: '72px',
              fontWeight: 700,
              color: '#ffffff',
              textAlign: 'center',
              lineHeight: 1.25,
              marginBottom: '28px',
              textShadow: '0 2px 12px rgba(0,0,0,0.2)',
              display: 'flex',
            }}
          >
            育児休業給付金
          </div>
          <div
            style={{
              fontSize: '72px',
              fontWeight: 700,
              color: '#ffffff',
              textAlign: 'center',
              lineHeight: 1.25,
              marginBottom: '36px',
              textShadow: '0 2px 12px rgba(0,0,0,0.2)',
              display: 'flex',
            }}
          >
            シミュレーター
          </div>

          {/* サブタイトル */}
          <div
            style={{
              fontSize: '30px',
              color: 'rgba(255,255,255,0.9)',
              textAlign: 'center',
              lineHeight: 1.6,
              marginBottom: '40px',
              display: 'flex',
            }}
          >
            月額給与を入力するだけ。育休中の手取り額を自動計算。
          </div>

          {/* 特徴バッジ一覧 */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
            }}
          >
            {['67%・50%の給付率を計算', '12ヶ月分の詳細表示', '社会保険料・税金も考慮'].map(
              (text) => (
                <div
                  key={text}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    padding: '10px 18px',
                    border: '1px solid rgba(255,255,255,0.25)',
                  }}
                >
                  <span style={{ color: '#fff', fontSize: '18px', fontWeight: 500 }}>
                    ✓ {text}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Noto Sans JP',
          data: fontData,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  )
}
