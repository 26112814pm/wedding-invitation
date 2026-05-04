import { useEffect, useState, useCallback } from 'react'
import Intro from './components/Intro'
import MainVisual from './components/MainVisual'
import Greeting from './components/Greeting'
import Calendar from './components/Calendar'
import Gallery from './components/Gallery'
import Location from './components/Location'
// Rsvp section removed - using floating button instead
import Guestbook from './components/Guestbook'
import Account from './components/Account'
import Footer from './components/Footer'
import Admin from './components/Admin'
import RsvpModal from './components/RsvpModal'

const App = () => {
  const [showIntro, setShowIntro] = useState(true)
  const [showRsvpPopup, setShowRsvpPopup] = useState(false)
  const [showFloatingBtn, setShowFloatingBtn] = useState(false)
  const [scrolledPastMain, setScrolledPastMain] = useState(false)
  const [isAdmin, setIsAdmin] = useState(window.location.hash === '#admin')

  useEffect(() => {
    const handleHash = () => setIsAdmin(window.location.hash === '#admin')
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false)
    // 인트로 끝난 후 0.8초 뒤 RSVP 팝업 (한 번만)
    const dismissedDate = localStorage.getItem('rsvp_dismissed_date')
    const alreadySubmitted = localStorage.getItem('rsvp_submitted')
    const todayDismissed = dismissedDate === new Date().toDateString()
    if (!alreadySubmitted && !todayDismissed) {
      setTimeout(() => setShowRsvpPopup(true), 0)
    }
    // 플로팅 버튼은 스크롤 시 표시
    setTimeout(() => setShowFloatingBtn(true), 100)

    // 스크롤 감지: 메인 비주얼을 지나면 플로팅 버튼 표시
    const handleScroll = () => {
      setScrolledPastMain(window.scrollY > 100) // ← 스크롤 100px 이상 내리면 버튼 등장
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleRsvpPopupClose = useCallback(() => {
    setShowRsvpPopup(false)
    // 닫기(X) 버튼은 localStorage에 아무것도 저장하지 않음 → 다음 접속 시 다시 뜸
    // "오늘 그만보기"는 RsvpModal 내부에서 rsvp_dismissed_date를 저장
    // "전달하기" 완료 시 RsvpModal 내부에서 rsvp_submitted를 저장
  }, [])

  const handleFloatingClick = useCallback(() => {
    setShowRsvpPopup(true)
  }, [])

  useEffect(() => {
    if (isAdmin) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [showIntro, isAdmin])

  if (isAdmin) return <Admin />

  return (
    <>
      {showIntro && <Intro onComplete={handleIntroComplete} />}
      <div
        style={{
          ...styles.app,
          opacity: showIntro ? 0 : 1,
          transition: 'opacity 0.8s ease',
        }}
      >
        <MainVisual />
        <Greeting />
        <Calendar />
        <Gallery />
        <Location />
        <Guestbook />
        <Account />
        <Footer />
      </div>

      {/* 인트로 후 자동 RSVP 팝업 */}
      <RsvpModal isOpen={showRsvpPopup} onClose={handleRsvpPopupClose} />

      {/* 플로팅 참석의사 버튼 */}
      {showFloatingBtn && !showIntro && !showRsvpPopup && scrolledPastMain && (
        <button
          style={styles.floatingBtn}
          onClick={handleFloatingClick}
          aria-label="참석의사 전달"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <span style={styles.floatingText}>참석의사 전달</span>
        </button>
      )}
    </>
  )
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    maxWidth: '480px',
    margin: '0 auto',
    backgroundColor: '#FFFFFF',
    minHeight: '100vh',
    boxShadow: '0 0 20px rgba(0,0,0,0.05)',
  },
  floatingBtn: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: '#FF6B1A',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '28px',
    boxShadow: '0 4px 16px rgba(196, 114, 78, 0.4)',
    cursor: 'pointer',
    fontFamily: "'Gowun Batang', serif",
    fontSize: '0.85rem',
    letterSpacing: '1px',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  floatingText: {
    fontFamily: "'Gowun Batang', serif",
    fontWeight: 400,
  },
}

export default App
