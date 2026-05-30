'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { usePsyStore, FruitKey } from '@/store/store'

// ─── 常數 ────────────────────────────────────────────────
const FRUIT_DESC: Record<FruitKey, string> = {
  Strawberina: '情緒激動草莓女 — 敢愛敢恨，掌摑是你的語言，眼淚是你的武器。全場最戲劇性的存在。',
  Bananito:    '狀況之外香蕉男 — 永遠比劇情慢半拍，卻意外地讓人心疼。迷糊是你的超能力。',
  Aubergino:   '花花公子茄子男 — 魅力四射，周旋於各色人等之間，危險又迷人。',
  Passiona:    '勾心鬥角百香女 — 城府深、計謀多，聯盟、背刺都是你的拿手好戲。',
  Watermelonito:'中央空調西瓜男 — 對誰都好、誰都喜歡，卻讓人猜不透你的真心。',
  Appelina:    '天真無邪蘋果女 — 最純粹的真愛追求者，但往往第一個被辜負。',
}

const FEED_CARDS = [
  { user: '@bananito_official', desc: '草莓娜又在哭了……我只是不小心叫錯她的名字……', tags: '#Bananito #FruitIsland #狗血',     bgKey: 'q1', hearts: '23.4w', comments: '8.1w',  stars: '6.2w' },
  { user: '@passiona_kills',    desc: '我不是壞人，我只是比你們先想到而已。笑。',       tags: '#Passiona #勾心鬥角 #AIFruit',   bgKey: 'q2', hearts: '41w',   comments: '12w',   stars: '9.8w' },
  { user: '@strawberina_fire',  desc: '他說他只把我當朋友。巴掌聲迴盪在整個島上。',     tags: '#Strawberina #扇巴掌 #當場爆炸', bgKey: 'q3', hearts: '99w',   comments: '34w',   stars: '21w'  },
  { user: '@watermelonito',     desc: '我對每個人都很好，這有什麼問題嗎？',             tags: '#Watermelonito #中央空調 #誰都愛',bgKey: 'q4', hearts: '18w',   comments: '5.2w',  stars: '4.1w' },
  { user: '@aubergino_vip',     desc: '我只是在享受生活，怎麼了嗎？',                   tags: '#Aubergino #花花公子 #FruitIsland',bgKey:'q5', hearts: '55w',   comments: '9.3w',  stars: '7.7w' },
  { user: '@appelina_sweetie',  desc: '我真的以為他是真心的……',                         tags: '#Appelina #真愛 #被辜負',         bgKey: 'q6', hearts: '30w',   comments: '11w',   stars: '8.4w' },
]

const EGG_FEED_CARDS = [
  { user: '@bananita_gold', desc: '我一直都在這裡。只是沒人找到我。',     tags: '#BananitaGold #隱藏 #傳說',   bgKey: 'egg', hearts: '???', comments: '???', stars: '???' },
  { user: '@bananita_gold', desc: '你點了所有香蕉……你是認真的嗎？',       tags: '#BananitaGold #彩蛋 #執著',   bgKey: 'egg', hearts: '∞',   comments: '∞',   stars: '∞'   },
  { user: '@bananita_gold', desc: '🍌🍌🍌 找到我了。恭喜你。',             tags: '#BananitaGold #FruitIsland #王者',bgKey:'egg', hearts: '👑',  comments: '👑',  stars: '👑'  },
]

const BANANA_POSITIONS = [
  { x: 15, y: 55 }, { x: 295, y: 55 }, { x: 55, y: 100 }, { x: 255, y: 100 },
  { x: 10, y: 200 }, { x: 10, y: 310 }, { x: 10, y: 430 },
  { x: 300, y: 180 }, { x: 300, y: 290 }, { x: 300, y: 400 },
  { x: 30, y: 530 }, { x: 130, y: 560 }, { x: 220, y: 540 }, { x: 295, y: 510 },
]

// step 說明：0=首頁, 1-6=問題, 7=加載, 8=結果, 9.5=彩蛋加載, 9=彩蛋
type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 9.5

function ty(step: Step, pageStep: number): string {
  if (step < pageStep) return 'translateY(100%)'
  if (step === pageStep) return 'translateY(0%)'
  return 'translateY(-100%)'
}

// ─── TikTok UI 共用元件 ───────────────────────────────────
function TkTopBar({ color = '#fe2c55' }: { color?: string }) {
  return (
    <div className="tk-top">
      <span>關注中</span>
      <span className="on" style={{ borderBottomColor: color }}>為您推薦</span>
    </div>
  )
}

function TkSideBar({ hearts = '99w', comments = '4.5w', stars = '20w' }: { hearts?: string; comments?: string; stars?: string }) {
  return (
    <div className="tk-side">
      <div className="tk-side-btn"><span style={{ fontSize: 24 }}>❤️</span><span>{hearts}</span></div>
      <div className="tk-side-btn"><span style={{ fontSize: 24 }}>💬</span><span>{comments}</span></div>
      <div className="tk-side-btn"><span style={{ fontSize: 24 }}>⭐</span><span>{stars}</span></div>
    </div>
  )
}

function TkBottomBar({ handle, desc, tags, handleColor = '#fff' }: { handle: string; desc: string; tags: string; handleColor?: string }) {
  return (
    <div className="tk-bottom">
      <div className="tk-handle" style={{ color: handleColor }}>{handle}</div>
      <div className="tk-desc">{desc}</div>
      <div className="tk-tags">{tags}</div>
    </div>
  )
}

// ─── Feed Card（加載頁每一張卡）────────────────────────────
function FeedCard({ card, isEgg }: { card: typeof FEED_CARDS[0]; isEgg: boolean }) {
  return (
    <div className="feed-card">
      <div className="feed-card-bg" style={{ backgroundImage: `url(/bg_${card.bgKey}.png)` }} />
      <div className="feed-card-overlay" />
      <div className="feed-ui">
        <div className="feed-ui-top">
          <span>關注中</span>
          <span className="on" style={{ borderBottomColor: isEgg ? '#facc15' : '#fe2c55' }}>為您推薦</span>
        </div>
        <div className="feed-ui-side">
          <div className="feed-ui-side-btn"><span style={{ fontSize: 24 }}>❤️</span><span>{card.hearts}</span></div>
          <div className="feed-ui-side-btn"><span style={{ fontSize: 24 }}>💬</span><span>{card.comments}</span></div>
          <div className="feed-ui-side-btn"><span style={{ fontSize: 24 }}>⭐</span><span>{card.stars}</span></div>
        </div>
        <div className="feed-ui-bottom">
          <div className="tk-handle" style={{ color: isEgg ? '#facc15' : '#fff' }}>{card.user}</div>
          <div className="tk-desc">{card.desc}</div>
          <div className="tk-tags" style={{ color: isEgg ? '#fbbf24' : '#60a5fa' }}>{card.tags}</div>
        </div>
        <div className="feed-ui-swipe"><span>↑</span><span>{isEgg ? '繼續滑' : '正在刷片'}</span></div>
      </div>
    </div>
  )
}

// ─── 加載頁（Feed 輪播）───────────────────────────────────
type SlotItem = { card: typeof FEED_CARDS[0]; uid: number }

function LoadingPage({
  cards, isEgg, visible, onDone, duration,
}: {
  cards: typeof FEED_CARDS; isEgg: boolean;
  visible: boolean; onDone: () => void; duration: number;
}) {
  const [slots, setSlots] = useState<SlotItem[]>([{ card: cards[0], uid: 0 }])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const doneRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const idxRef = useRef(0)
  const uidRef = useRef(1)

  useEffect(() => {
    if (!visible) { setSlots([{ card: cards[0], uid: 0 }]); idxRef.current = 0; uidRef.current = 1; return }
    timerRef.current = setInterval(() => {
      idxRef.current = (idxRef.current + 1) % cards.length
      const next: SlotItem = { card: cards[idxRef.current], uid: uidRef.current++ }
      setSlots(prev => [prev[prev.length - 1], next])
    }, 900)
    doneRef.current = setTimeout(() => { onDone() }, duration)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (doneRef.current) clearTimeout(doneRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  return (
    <div className="feed-viewport">
      {slots.map((item, i) => (
        <div key={item.uid} style={{ position: 'absolute', inset: 0, animation: i === slots.length - 1 && slots.length > 1 ? 'feedSlideIn 0.42s cubic-bezier(0.4,0,0.2,1) forwards' : i < slots.length - 1 ? 'feedSlideOut 0.42s cubic-bezier(0.4,0,0.2,1) forwards' : 'none' }}>
          <FeedCard card={item.card} isEgg={isEgg} />
        </div>
      ))}
    </div>
  )
}

// ─── 彩蛋星星 ─────────────────────────────────────────────
function EggStars() {
  const positions = [
    { x: 20, y: 60 }, { x: 280, y: 80 }, { x: 40, y: 350 }, { x: 260, y: 320 },
    { x: 140, y: 40 }, { x: 80, y: 500 }, { x: 230, y: 480 }, { x: 160, y: 580 },
  ]
  const icons = ['✨', '⭐', '🌟', '💫']
  const [visible, setVisible] = useState<boolean[]>(new Array(positions.length).fill(false))

  useEffect(() => {
    positions.forEach((_, i) => {
      setTimeout(() => {
        setVisible(v => { const n = [...v]; n[i] = true; return n })
      }, 1800 + Math.floor(i / 2) * 120 + (i % 2) * 180)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {positions.map((p, i) => visible[i] && (
        <span key={i} className="egg-star" style={{ left: p.x, top: p.y }}>
          {icons[i % 4]}
        </span>
      ))}
    </>
  )
}

// ─── 主頁面 ───────────────────────────────────────────────
export default function Home() {
  const { quizData, scores } = usePsyStore(s => s)
  const addScores = usePsyStore(s => s.addScores)
  const resetGame = usePsyStore(s => s.resetGame)

  const [step, setStep] = useState<Step>(0)
  const [bananaGone, setBananaGone] = useState<boolean[]>(new Array(BANANA_POSITIONS.length).fill(false))
  const [bananasLeft, setBananasLeft] = useState(BANANA_POSITIONS.length)
  const [droppingIdx, setDroppingIdx] = useState<number | null>(null)

  const topFruit = useCallback((): FruitKey => {
    return (Object.keys(scores) as FruitKey[]).reduce((a, b) => scores[a] > scores[b] ? a : b)
  }, [scores])

  const handleSelect = (fruitScores: Partial<Record<FruitKey, number>>, qi: number) => {
    addScores(fruitScores)
    if (qi < 5) setStep((qi + 2) as Step)
    else setStep(7)
  }

  const handleBananaClick = (idx: number) => {
    if (bananaGone[idx] || droppingIdx !== null) return
    setDroppingIdx(idx)
    setTimeout(() => {
      setBananaGone(prev => { const n = [...prev]; n[idx] = true; return n })
      setDroppingIdx(null)
      const left = bananasLeft - 1
      setBananasLeft(left)
      if (left === 0) setTimeout(() => setStep(9.5), 300)
    }, 550)
  }

  const handleReset = () => {
    resetGame()
    setBananaGone(new Array(BANANA_POSITIONS.length).fill(false))
    setBananasLeft(BANANA_POSITIONS.length)
    setStep(0)
  }

  const fruit = topFruit()

  return (
    <div id="app-root">
      <div className="screen">

        {/* ── 首頁 ── */}
        <div className="page page-home" style={{ transform: step === 0 ? 'translateY(0%)' : 'translateY(-100%)' }}>
          <div className="page-bg" style={{ backgroundImage: 'url(/bg_home.png)' }} />
          <div className="page-bg-overlay" />
          <TkTopBar />
          <div className="tk-content">
            <div className="home-visual">
              <div className="home-badge">AI 水果狗血劇</div>
              <p className="home-title">測測你是 Fruit Island 裡的哪種抓馬角色？</p>
              <button className="btn-enter" onClick={() => setStep(1)}>進入 Fruit Island</button>
            </div>
          </div>
          <TkSideBar />
          <TkBottomBar handle="@vickie_fruit_island" desc="極致發瘋、劈腿、扇巴掌！進來測出你的水果超能力 💥" tags="#AIFruit #心理測驗 #FruitIsland" />
          {/* 香蕉彩蛋層 */}
          {step === 0 && (
            <div className="banana-layer">
              {BANANA_POSITIONS.map((pos, idx) => !bananaGone[idx] && (
                <span
                  key={idx}
                  className={`banana-sprite${droppingIdx === idx ? ' banana-dropping' : ''}`}
                  style={{ left: pos.x, top: pos.y }}
                  onClick={() => handleBananaClick(idx)}
                >
                  🍌
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── 加載頁 ── */}
        <div className="page page-loading" style={{ transform: step === 7 ? 'translateY(0%)' : step < 7 ? 'translateY(100%)' : 'translateY(-100%)' }}>
          <LoadingPage cards={FEED_CARDS} isEgg={false} visible={step === 7} onDone={() => setStep(8)} duration={6000} />
        </div>

        {/* ── 彩蛋加載頁 ── */}
        <div className="page page-egg-loading" style={{ transform: step === 9.5 ? 'translateY(0%)' : (step < 9.5 && step !== 8) ? 'translateY(100%)' : 'translateY(-100%)' }}>
          <LoadingPage cards={EGG_FEED_CARDS as typeof FEED_CARDS} isEgg={true} visible={step === 9.5} onDone={() => setStep(9)} duration={3000} />
        </div>

        {/* ── 問題頁 ── */}
        {quizData.map((q, i) => {
          const qStep = (i + 1) as Step
          return (
            <div key={i} className="page" style={{ transform: ty(step, qStep) }}>
              <div className="page-bg" style={{ backgroundImage: `url(/bg_${q.bgKey}.png)` }} />
              <div className="quiz-bg-overlay" />
              <TkTopBar />
              <div className="tk-content" style={{ justifyContent: 'flex-start', paddingTop: 12, paddingBottom: 150 }}>
                <div className="quiz-visual">
                  <span className="quiz-tag">PAGE {qStep} / 6</span>
                  <h2 className="quiz-title">{q.title}</h2>
                  <div className="quiz-opts">
                    {q.options.map((opt, oi) => (
                      <button key={oi} className="opt-btn" onClick={() => handleSelect(opt.scores, i)}>
                        {opt.text}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <TkSideBar />
              <TkBottomBar handle={q.handle} desc={q.desc} tags={q.tags} />
            </div>
          )
        })}

        {/* ── 結果頁 ── */}
        <div className="page page-result" style={{ transform: step === 8 ? 'translateY(0%)' : 'translateY(100%)' }}>
          <div className="result-bg" style={{ backgroundImage: `url(/${fruit}.png)` }} />
          <TkTopBar />
          <div className="tk-content" style={{ paddingBottom: 160 }}>
            <div className="result-visual">
              <div className="result-img-box">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/${fruit}.png`} alt={fruit} />
              </div>
              <p className="result-eyebrow">— YOUR FRUIT CHARACTER —</p>
              <p className="result-name">{fruit}</p>
              <p className="result-desc">{FRUIT_DESC[fruit]}</p>
              <button className="btn-replay" onClick={handleReset}>再次返回 Fruit Island</button>
            </div>
          </div>
          <TkSideBar hearts="12w" comments="3.2w" stars="8w" />
          <TkBottomBar handle="@vickie_fruit_island" desc={`你是 ${fruit}！分享給朋友一起測 🎉`} tags="#FruitIsland #AIFruit #水果人格" />
        </div>

        {/* ── 彩蛋頁 ── */}
        <div className="page page-egg" style={{ transform: step === 9 ? 'translateY(0%)' : 'translateY(100%)' }}>
          {step === 9 && (
            <>
              <div className="egg-bg" style={{ backgroundImage: 'url(/bg_egg.png)' }} />
              <div className="egg-bg-overlay" />
              <div className="egg-goldflare" />
              <EggStars />
              <div className="tk-top egg-ui-delay">
                <span>關注中</span><span className="on">為您推薦</span>
              </div>
              <div className="egg-content-wrap">
                <div className="egg-content">
                  <div className="egg-crown">🍌</div>
                  <p style={{ fontSize: 11, color: '#facc15', fontWeight: 800, letterSpacing: 3, textShadow: '0 0 10px #facc15' }}>— 隱藏彩蛋解鎖 —</p>
                  <p className="egg-name">黃金香蕉女<br />Bananita Gold</p>
                  <span className="egg-badge">✨ 傳說級角色 ✨</span>
                  <p style={{ fontSize: 12, color: 'rgba(255,220,100,0.9)', lineHeight: 1.7, maxWidth: 250, marginTop: 6, textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                    其實沒什麼重要的，但我就是想加個彩蛋進去，就這樣。
                  </p>
                  <p style={{ fontSize: 20, marginTop: 4 }}>👑 恭喜你找到彩蛋啾咪 👑</p>
                  <button className="btn-egg-home" onClick={handleReset}>回到首頁</button>
                </div>
              </div>
              <div className="egg-ui-delay">
                <TkSideBar hearts="???" comments="???" stars="???" />
              </div>
              <div className="egg-ui-delay">
                <TkBottomBar handle="@bananita_gold" desc="你是少數找到我的人。這是命中注定。" tags="#BananitaGold #隱藏彩蛋 #FruitIsland" handleColor="#facc15" />
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  )
}
