'use client'

/**
 * FAQコンポーネント
 * よくある質問と回答を表示
 */

import { useState } from 'react'
import { FAQ_DATA } from '../utils/constants'
import './FAQ.css'

export default function FAQ() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  /**
   * FAQアイテムの開閉を切り替え
   */
  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  return (
    <section className="faq">
      <h2>よくある質問</h2>
      <p className="faq-description">
        育児休業給付金に関するよくある質問をまとめました。
      </p>
      
      <div className="faq-list">
        {FAQ_DATA.map((item, index) => {
          const isOpen = openItems.has(index)
          
          return (
            <div 
              key={index} 
              className={`faq-item ${isOpen ? 'open' : ''}`}
            >
              <button
                className="faq-question"
                onClick={() => toggleItem(index)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="question-text">{item.question}</span>
                <span className="toggle-icon" aria-hidden="true">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              
              <div 
                id={`faq-answer-${index}`}
                className="faq-answer"
                aria-hidden={!isOpen}
              >
                <div className="answer-content">
                  <p>{item.answer}</p>
                  {item.source && (
                    <cite className="answer-source">
                      出典: {item.source}
                    </cite>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="faq-note">
        <p>
          <strong>※ 注意事項</strong><br />
          このシミュレーターは概算値を計算するものです。実際の給付金額は、
          ハローワークでの正式な手続きにより確定されます。
          詳細については最寄りのハローワークにご相談ください。
        </p>
      </div>
    </section>
  )
}