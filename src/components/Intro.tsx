import { useState, useEffect } from 'react'

interface IntroProps {
  onComplete: () => void
}

// 일러스트 3장 순차 노출 → 메인 화면 전환 (총 3초)
const FRAMES = [
  '/wedding-invitation/images/1.png',
  '/wedding-invitation/images/2.png',
  '/wedding-invitation/images/3.png',
]

// 타이밍 (ms) — 합 3000ms
const FRAME_DURATION = 1000   // 각 프레임 노출 시간
const FADE_DURATION = 400     // 컨테이너 페이드 아웃 시간
const TOTAL_DURATION = 3000   // 전체 인트로 시간

const Intro = ({ onComplete }: IntroProps) => {
  const [frame, setFrame] = useState(0)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
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
  }, [onComplete])

  return (
    <div
      style={{
        ...introStyles.container,
        opacity: exiting ? 0 : 1,
        transition: `opacity ${FADE_DURATION}ms ease`,
      }}
    >
      <div style={introStyles.imageWrapper}>
        {FRAMES.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`intro-${i + 1}`}
            style={{
              ...introStyles.frame,
              opacity: frame === i ? 1 : 0,
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
    background: '#FFF4E8',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: '480px',  // 모바일 가로 비율 유지 (480px 폭)
    height: '100%',
    margin: '0 auto',
  },
  frame: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',  // 일러스트 잘림 없이 전체 표시
    transition: 'opacity 350ms ease-in-out',
    pointerEvents: 'none',
    userSelect: 'none',
  },
}

export default Intro
