import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { weddingConfig } from '../config'

interface RsvpModalProps {
  isOpen: boolean
  onClose: () => void
}

const RsvpModal = ({ isOpen, onClose }: RsvpModalProps) => {
  const [side, setSide] = useState<'groom' | 'bride'>('groom')
  const [attending, setAttending] = useState<boolean>(true)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [dining, setDining] = useState<boolean>(true)
  const [guestCount, setGuestCount] = useState(1)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    // 배경 스크롤 완전 차단 (카카오톡 인앱 브라우저 대응)
    const scrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.overflow = 'hidden'

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.overflow = ''
      window.scrollTo(0, scrollY)
      window.removeEventListener('keydown', handleKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('이름을 입력해주세요.')
      return
    }

    setSubmitting(true)
    try {
      await addDoc(collection(db, 'rsvp'), {
        side,
        attending,
        name: name.trim(),
        message: message.trim(),
        dining: attending ? dining : false,
        guestCount: attending ? guestCount : 0,
        createdAt: serverTimestamp(),
      })
      alert('참석 의사가 전달되었습니다. 감사합니다!')
      localStorage.setItem('rsvp_submitted', 'true')
      onClose()
      setName('')
      setMessage('')
      setSide('groom')
      setAttending(true)
      setDining(true)
      setGuestCount(1)
    } catch {
      alert('전송에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  return createPortal(
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button style={s.closeBtn} onClick={onClose}>&times;</button>

        <h3 style={s.title}>참석 여부 전달</h3>

        {/* 날짜/시간/장소 정보 */}
        <div style={s.infoBox}>
          <p style={s.infoLine}>2026.11.28 토요일 오후 2시</p>
          <p style={s.infoLine}>{weddingConfig.location.name}</p>
        </div>

        {/* 신랑측/신부측 */}
        <label style={s.label}>어느 쪽 하객이신가요?</label>
        <div style={s.toggleRow}>
          <button
            style={{ ...s.toggleBtn, ...(side === 'groom' ? s.toggleActive : {}) }}
            onClick={() => setSide('groom')}
          >
            신랑측
          </button>
          <button
            style={{ ...s.toggleBtn, ...(side === 'bride' ? s.toggleActive : {}) }}
            onClick={() => setSide('bride')}
          >
            신부측
          </button>
        </div>

        {/* 참석여부 */}
        <label style={s.label}>참석 여부</label>
        <div style={s.toggleRow}>
          <button
            style={{ ...s.toggleBtn, ...(attending ? s.toggleActive : {}) }}
            onClick={() => setAttending(true)}
          >
            참석
          </button>
          <button
            style={{ ...s.toggleBtn, ...(!attending ? s.toggleActive : {}) }}
            onClick={() => setAttending(false)}
          >
            불참
          </button>
        </div>

        {/* 이름 */}
        <label style={s.label}>이름</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력해주세요"
          style={s.input}
        />

        {/* 전하고 싶은 말 */}
        <label style={s.label}>신랑/신부에게 전하고 싶은 말 (선택)</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="축하 메시지를 남겨주세요"
          style={{ ...s.input, height: '80px', resize: 'none' as const }}
          maxLength={200}
        />

        {/* 참석 시에만 표시 */}
        {attending && (
          <>
            {/* 식사여부 */}
            <label style={s.label}>식사 여부</label>
            <div style={s.toggleRow}>
              <button
                style={{ ...s.toggleBtn, ...(dining ? s.toggleActive : {}) }}
                onClick={() => setDining(true)}
              >
                식사함
              </button>
              <button
                style={{ ...s.toggleBtn, ...(!dining ? s.toggleActive : {}) }}
                onClick={() => setDining(false)}
              >
                식사 안함
              </button>
            </div>

            {/* 인원수 */}
            <label style={s.label}>본인 포함 총 인원</label>
            <div style={s.counterRow}>
              <button
                style={s.counterBtn}
                onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
              >
                −
              </button>
              <span style={s.counterValue}>{guestCount}명</span>
              <button
                style={s.counterBtn}
                onClick={() => setGuestCount(Math.min(10, guestCount + 1))}
              >
                +
              </button>
            </div>
          </>
        )}

        {/* 제출 */}
        <button
          style={{ ...s.submitBtn, opacity: submitting ? 0.6 : 1 }}
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? '전송 중...' : '전달하기'}
        </button>

        {/* 오늘 그만보기 */}
        <button
          style={s.dismissBtn}
          onClick={() => {
            localStorage.setItem('rsvp_dismissed_date', new Date().toDateString())
            onClose()
          }}
        >
          오늘 그만보기
        </button>
      </div>
    </div>,
    document.body
  )
}

const s: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(250, 246, 241, 0.95)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
    padding: '20px',
    overscrollBehavior: 'contain',
    touchAction: 'none',
  },
  modal: {
    width: '100%',
    maxWidth: '400px',
    maxHeight: '90vh',
    overflowY: 'auto',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '32px 24px',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    overscrollBehavior: 'contain',
    touchAction: 'pan-y',
  },
  closeBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'transparent',
    color: '#9A9A9A',
    fontSize: '1.4rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#F5D9B8',
    cursor: 'pointer',
  },
  title: {
    fontFamily: "'Onglip Uiyeon', 'Gowun Batang', serif",
    fontSize: '2rem',
    fontWeight: 400,
    color: '#3D3D3D',
    textAlign: 'center',
    marginBottom: '16px',
    letterSpacing: '3px',
  },
  infoBox: {
    textAlign: 'center',
    marginBottom: '20px',
    padding: '12px 0',
    borderTop: '1px solid #F8DEBC',
    borderBottom: '1px solid #F8DEBC',
  },
  infoLine: {
    fontSize: '1.5rem',
    color: '#5A5A5A',
    fontFamily: "'Onglip Uiyeon', 'Gowun Batang', serif",
    margin: '4px 0',
    letterSpacing: '1px',
  },
  label: {
    display: 'block',
    fontSize: '1.25rem',
    color: '#9A9A9A',
    marginBottom: '8px',
    marginTop: '16px',
    fontFamily: "'Onglip Uiyeon', 'Gowun Batang', serif",
  },
  toggleRow: {
    display: 'flex',
    gap: '8px',
  },
  toggleBtn: {
    flex: 1,
    padding: '12px',
    fontSize: '1.25rem',
    color: '#5A5A5A',
    backgroundColor: '#FFF4E8',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#F5D9B8',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: "'Onglip Uiyeon', 'Noto Serif KR', serif",
    transition: 'all 0.2s ease',
  },
  toggleActive: {
    backgroundColor: '#FF6B1A',
    borderColor: '#FF6B1A',
    color: '#FFFFFF',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '1.25rem',
    color: '#3D3D3D',
    backgroundColor: '#FFF4E8',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#F5D9B8',
    borderRadius: '8px',
    fontFamily: "'Onglip Uiyeon', 'Noto Serif KR', serif",
    outline: 'none',
    boxSizing: 'border-box',
  },
  counterRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
  },
  counterBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#FFF4E8',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#F5D9B8',
    fontSize: '1.5rem',
    color: '#FF6B1A',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterValue: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#3D3D3D',
    minWidth: '40px',
    textAlign: 'center',
    fontFamily: "'Onglip Uiyeon', 'Gowun Batang', serif",
  },
  submitBtn: {
    width: '100%',
    padding: '16px',
    marginTop: '28px',
    fontSize: '1.5rem',
    color: '#FFFFFF',
    backgroundColor: '#FF6B1A',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: "'Onglip Uiyeon', 'Gowun Batang', serif",
    letterSpacing: '2px',
  },
  dismissBtn: {
    width: '100%',
    padding: '12px',
    marginTop: '10px',
    fontSize: '1.2rem',
    color: '#9A9A9A',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Onglip Uiyeon', 'Gowun Batang', serif",
    letterSpacing: '1px',
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
  },
}

export default RsvpModal
