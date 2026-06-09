import { useState, useEffect } from 'react'
import { weddingConfig } from '../config'

interface IntroProps {
  onComplete: () => void
}

// 일러스트 3장 순차 노출 → 메인 화면 전환
const FRAMES = [
  '/wedding-invitation/images/1.png',
  '/wedding-invitation/images/2.png',
  '/wedding-invitation/images/3.png',
]

// 타이밍 (ms) — assetsReady=true 이후부터 카운트
const FRAME_DURATION = 1500             // 각 프레임 노출 시간
const FADE_DURATION = 800               // 컨테이너 페이드 아웃 시간
const FRAME_TRANSITION = 1500           // 프레임 간 크로스페이드 시간
const TOTAL_DURATION = 5000             // 전체 인트로 시간 (자산 로드 후 기준)
const ASSET_TIMEOUT = 5000              // 자산 로드 안전 타임아웃

const Intro = ({ onComplete }: IntroProps) => {
  const [assetsReady, setAssetsReady] = useState(false)
  const [frame, setFrame] = useState(0)
  const [exiting, setExiting] = useState(false)

  const date = new Date(weddingConfig.date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const period = hours < 12 ? '오전' : hours === 12 ? '낮' : '오후'
  const displayHour = hours > 12 ? hours - 12 : hours
  const timeStr = `${period} ${displayHour}시${minutes > 0 ? ` ${minutes}분` : ''}`
  const dateStr = `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')} ${dayOfWeek}요일 ${timeStr}`

  // 1) 폰트 + 이미지 모두 로드될 때까지 대기
  useEffect(() => {
    let cancelled = false
    const fontPromise =
      typeof document !== 'undefined' && document.fonts
        ? document.fonts.load('1.6rem "Onglip Uiyeon"').catch(() => null)
        : Promise.resolve(null)
    const imagePromises = FRAMES.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image()
          img.onload = () => resolve()
          img.onerror = () => resolve()
          img.src = src
        })
    )
    const safety = new Promise<void>((resolve) => setTimeout(resolve, ASSET_TIMEOUT))
    Promise.race([Promise.all([fontPromise, ...imagePromises]).then(() => {}), safety]).then(() => {
      if (!cancelled) setAssetsReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  // 2) 자산 로드 완료 후 애니메이션 타이머 시작
  useEffect(() => {
    if (!assetsReady) return
    const t1 = setTimeout(() => setFrame(1), FRAME_DURATION)
    const t2 = setTimeout(() => setFrame(2), FRAME_DURATION * 2)
    const tFade = setTimeout(() => setExiting(true), TOTAL_DURATION - FADE_DURATION)
    const tDone = setTimeout(() => onComplete(), TOTAL_DURATION)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(tFade)
      clearTimeout(tDone)
    }
  }, [assetsReady, onComplete])

  return (
    <div
      style={{
        ...introStyles.container,
        opacity: exiting ? 0 : 1,
        transition: `opacity ${FADE_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      }}
    >
      <div
        style={{
          ...introStyles.topArea,
          opacity: assetsReady && !exiting ? 1 : 0,
          transform: assetsReady && !exiting ? 'translateY(0)' : 'translateY(-8px)',
          transition: 'opacity 800ms ease, transform 800ms ease',
        }}
      >
        <div style={introStyles.names}>
          <span style={introStyles.name}>{weddingConfig.groom.name}</span>
          <svg width="22" height="20" viewBox="0 0 24 22" fill="none">
            <defs>
              <linearGradient id="introHeart" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFB570" />
                <stop offset="100%" stopColor="#E04E0F" />
              </linearGradient>
            </defs>
            <g transform="translate(10 2.4) scale(0.8)" opacity="0.7">
              <path d="M9 19.5 C3.5 15 0.5 11.4 0.5 8 C0.5 5.5 2.5 3.6 4.6 3.6 C6.6 3.6 7.9 4.7 9 6.6 C10.1 4.7 11.4 3.6 13.4 3.6 C15.5 3.6 17.5 5.5 17.5 8 C17.5 11.4 14.5 15 9 19.5 Z" fill="url(#introHeart)" />
            </g>
            <path d="M9 19.5 C3.5 15 0.5 11.4 0.5 8 C0.5 5.5 2.5 3.6 4.6 3.6 C6.6 3.6 7.9 4.7 9 6.6 C10.1 4.7 11.4 3.6 13.4 3.6 C15.5 3.6 17.5 5.5 17.5 8 C17.5 11.4 14.5 15 9 19.5 Z" fill="url(#introHeart)" />
          </svg>
          <span style={introStyles.name}>{weddingConfig.bride.name}</span>
        </div>
        <p style={introStyles.dateText}>{dateStr}</p>
      </div>

      <div style={introStyles.imageWrapper}>
        {FRAMES.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`intro-${i + 1}`}
            style={{
              ...introStyles.frame,
              opacity: assetsReady && frame === i ? 1 : 0,
              transition: `opacity ${FRAME_TRANSITION}ms ease-in-out`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

const introStyles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 200000,
    background: 'var(--color-bg)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',                     // 텍스트 영역과 일러스트 사이 간격
    padding: '32px 16px',
  },
  topArea: {
    textAlign: 'center',
    willChange: 'opacity, transform',
  },
  names: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '14px',
    marginBottom: '-10px',             // 이름 ↔ 날짜 간격
  },
  name: {
    fontFamily: "var(--font-display)",
    fontSize: '2.4rem',
    fontWeight: 600,
    color: 'var(--color-text-dark)',
    letterSpacing: '4px',
  },
  dateText: {
    fontFamily: "var(--font-display)",
    fontSize: '1.5rem',
    color: 'var(--color-text)',
    letterSpacing: '2px',
    margin: 0,
  },
  imageWrapper: {
    position: 'relative',
    width: '92%',
    maxWidth: '480px',
    aspectRatio: '941 / 558',
  },
  frame: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    pointerEvents: 'none',
    userSelect: 'none',
  },
}

export default Intro
