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
  const [shuttle, setShuttle] = useState<'sacheon' | 'jinju' | 'none'>('none')
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

  // config.date에서 날짜/시간 문자열 자동 생성
  const d = new Date(weddingConfig.date)
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()]
  const hours = d.getHours()
  const minutes = d.getMinutes()
  const period = hours < 12 ? '오전' : hours === 12 ? '낮' : '오후'
  const displayHour = hours > 12 ? hours - 12 : hours
  const timeStr = `${period} ${displayHour}시${minutes > 0 ? ` ${minutes}분` : ''}`
  const dateTimeStr = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${dayOfWeek}요일 ${timeStr}`

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
        shuttle: attending ? shuttle : 'none',
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
      setShuttle('none')
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
          <p style={s.infoLine}>{dateTimeStr}</p>
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

            {/* 하객 버스 탑승 여부 */}
            <label style={s.label}>하객 버스 탑승 여부</label>
            <div style={s.toggleRow}>
              <button
                style={{ ...s.toggleBtn, ...(shuttle === 'sacheon' ? s.toggleActive : {}) }}
                onClick={() => setShuttle('sacheon')}
              >
                삼천포
              </button>
              <button
                style={{ ...s.toggleBtn, ...(shuttle === 'jinju' ? s.toggleActive : {}) }}
                onClick={() => setShuttle('jinju')}
              >
                진주
              </button>
              <button
                style={{ ...s.toggleBtn, ...(shuttle === 'none' ? s.toggleActive : {}) }}
                onClick={() => setShuttle('none')}
              >
                탑승 안함
              </button>
            </div>
            <p style={s.helpText}>
              삼천포 08:30 공설운동장
              <br />
              진주 09:10 서진주 만남의광장
            </p>

            {/* 인원수 */}
            <label style={{ ...s.label, textAlign: 'center' }}>본인 포함 총 인원</label>
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
    color: 'var(--color-text-light)',
    fontSize: '1.3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--color-divider)',
    cursor: 'pointer',
  },
  title: {
    fontFamily: "var(--font-display)",
    fontSize: '1.3rem',
    fontWeight: 400,
    color: 'var(--color-text-dark)',
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
    fontSize: '0.9rem',
    color: 'var(--color-text)',
    fontFamily: "var(--font-display)",
    margin: '4px 0',
    letterSpacing: '1px',
  },
  label: {
    display: 'block',
    fontSize: '0.85rem',
    color: 'var(--color-text-light)',
    marginBottom: '8px',
    marginTop: '16px',
    fontFamily: "var(--font-display)",
  },
  toggleRow: {
    display: 'flex',
    gap: '8px',
  },
  toggleBtn: {
    flex: 1,
    padding: '12px',
    fontSize: '0.85rem',
    color: 'var(--color-text)',
    backgroundColor: 'var(--color-bg)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--color-divider)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: "var(--font-serif)",
    transition: 'all 0.2s ease',
  },
  toggleActive: {
    backgroundColor: 'var(--color-primary)',
    borderColor: 'var(--color-primary)',
    color: '#FFFFFF',
  },
  helpText: {
    fontSize: '0.75rem',
    color: 'var(--color-text-light)',
    margin: '8px 0 0',
    lineHeight: 1.5,
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '0.95rem',
    color: 'var(--color-text-dark)',
    backgroundColor: 'var(--color-bg)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--color-divider)',
    borderRadius: '8px',
    fontFamily: "var(--font-serif)",
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
    backgroundColor: 'var(--color-bg)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--color-divider)',
    fontSize: '1.2rem',
    color: 'var(--color-primary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterValue: {
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--color-text-dark)',
    minWidth: '40px',
    textAlign: 'center',
    fontFamily: "var(--font-display)",
  },
  submitBtn: {
    width: '100%',
    padding: '16px',
    marginTop: '28px',
    fontSize: '1rem',
    color: '#FFFFFF',
    backgroundColor: 'var(--color-primary)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: "var(--font-display)",
    letterSpacing: '2px',
  },
  dismissBtn: {
    width: '100%',
    padding: '12px',
    marginTop: '10px',
    fontSize: '0.85rem',
    color: 'var(--color-text-light)',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "var(--font-display)",
    letterSpacing: '1px',
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
  },
}

export default RsvpModal
