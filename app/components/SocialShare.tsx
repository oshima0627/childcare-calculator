'use client'

/**
 * ソーシャル共有コンポーネント
 * 計算結果をSNSで共有する機能
 */

import { useState } from 'react'
import { formatCurrency } from '../utils/formatter'
import type { CalculationResult } from '../types'
import './SocialShare.css'

interface SocialShareProps {
  result: CalculationResult
}

export default function SocialShare({ result }: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  /**
   * 共有用テキストを生成
   */
  const generateShareText = (): string => {
    const salary = formatCurrency(result.input.salary)
    const benefit6 = formatCurrency(result.childcare.monthlyBenefits[0].benefit)
    const benefit12 = formatCurrency(result.childcare.monthlyBenefits[11].benefit)
    const rate6 = result.maintenanceRate6Months
    const rate12 = result.maintenanceRate12Months

    return `育児休業給付金シミュレーション結果📊

💰 月額給与: ${salary}
👶 給付金(1-6ヶ月): ${benefit6} (${rate6}%)
👶 給付金(7-12ヶ月): ${benefit12} (${rate12}%)

#育児休業給付金 #子育て #マネープラン`
  }

  /**
   * 共有用URLを生成
   */
  const getShareUrl = (): string => {
    if (typeof window !== 'undefined') {
      return window.location.origin
    }
    return 'https://childcare-calculator.vercel.app'
  }

  /**
   * Twitter共有
   */
  const shareToTwitter = () => {
    const text = generateShareText()
    const url = getShareUrl()
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    window.open(twitterUrl, '_blank', 'width=550,height=420')
    
    // Google Analytics イベント送信
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', 'share', {
        event_category: 'engagement',
        event_label: 'twitter',
        method: 'twitter',
      })
    }
  }

  /**
   * LINE共有
   */
  const shareToLine = () => {
    const text = generateShareText()
    const url = getShareUrl()
    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(`${text}\n\n${url}`)}`
    window.open(lineUrl, '_blank')
    
    // Google Analytics イベント送信
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', 'share', {
        event_category: 'engagement',
        event_label: 'line',
        method: 'line',
      })
    }
  }

  /**
   * Facebook共有
   */
  const shareToFacebook = () => {
    const url = getShareUrl()
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    window.open(facebookUrl, '_blank', 'width=550,height=420')
    
    // Google Analytics イベント送信
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', 'share', {
        event_category: 'engagement',
        event_label: 'facebook',
        method: 'facebook',
      })
    }
  }

  /**
   * URLをクリップボードにコピー
   */
  const copyToClipboard = async () => {
    try {
      const url = getShareUrl()
      await navigator.clipboard.writeText(url)
      setCopied(true)
      
      // Google Analytics イベント送信
      if (typeof window !== 'undefined' && (window as any).gtag) {
        ;(window as any).gtag('event', 'share', {
          event_category: 'engagement',
          event_label: 'copy_url',
          method: 'copy',
        })
      }
      
      // 2秒後にリセット
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('クリップボードへのコピーに失敗しました:', err)
    }
  }

  return (
    <section className="social-share">
      <h3>計算結果を共有</h3>
      <p className="share-description">
        計算結果をSNSで共有して、家族や友人と情報を共有しましょう。
      </p>
      
      <div className="share-buttons">
        <button
          onClick={shareToTwitter}
          className="share-button twitter"
          aria-label="Twitterで共有"
        >
          <span className="share-icon">🐦</span>
          <span>Twitter</span>
        </button>
        
        <button
          onClick={shareToLine}
          className="share-button line"
          aria-label="LINEで共有"
        >
          <span className="share-icon">💬</span>
          <span>LINE</span>
        </button>
        
        <button
          onClick={shareToFacebook}
          className="share-button facebook"
          aria-label="Facebookで共有"
        >
          <span className="share-icon">📘</span>
          <span>Facebook</span>
        </button>
        
        <button
          onClick={copyToClipboard}
          className={`share-button copy ${copied ? 'copied' : ''}`}
          aria-label="URLをコピー"
        >
          <span className="share-icon">{copied ? '✅' : '🔗'}</span>
          <span>{copied ? 'コピー済み' : 'URLコピー'}</span>
        </button>
      </div>
      
      <div className="share-preview">
        <h4>共有プレビュー</h4>
        <div className="preview-text">
          {generateShareText()}
        </div>
      </div>
    </section>
  )
}