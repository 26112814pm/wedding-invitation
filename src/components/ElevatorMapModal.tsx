import { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const ElevatorMapModal = ({ isOpen, onClose }: Props) => {
  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={onClose} aria-label="약도 닫기">
          &times;
        </button>

        <h3 style={styles.title}>약도</h3>
        <p style={styles.desc}>각 입구별로 엘레베이터가 1대씩 배치되어있으니 참고 부탁드립니다.</p>

        <div style={styles.mapWrapper}>
          <svg viewBox="0 0 600 430" width="100%" style={{ display: 'block' }}>
            {/* 주변 건물 */}
            <g fontFamily="'Onglip Uiyeon', serif" fill="#7A6E5B">
              <rect x="130" y="20" width="420" height="74" rx="6" fill="#ECE3D0" stroke="#D9CDB2" strokeWidth="1" />
              <text x="340" y="64" textAnchor="middle" fontSize="22" fontWeight="700">분당제생병원</text>

              <rect x="20" y="115" width="85" height="220" rx="6" fill="#ECE3D0" stroke="#D9CDB2" strokeWidth="1" />
              <text x="62" y="150" textAnchor="middle" fontSize="20" fontWeight="700">분당제일</text>
              <text x="62" y="178" textAnchor="middle" fontSize="20" fontWeight="700">여성병원</text>

              <rect x="475" y="115" width="85" height="100" rx="6" fill="#ECE3D0" stroke="#D9CDB2" strokeWidth="1" />
              <rect x="475" y="235" width="85" height="100" rx="6" fill="#ECE3D0" stroke="#D9CDB2" strokeWidth="1" />

              <rect x="130" y="355" width="320" height="60" rx="6" fill="#ECE3D0" stroke="#D9CDB2" strokeWidth="1" />
              <text x="290" y="392" textAnchor="middle" fontSize="22" fontWeight="700">분당 우체국</text>
            </g>

            {/* 메인 건물 */}
            <rect x="130" y="115" width="320" height="220" rx="12" fill="#FFF8EC" stroke="#FF6B1A" strokeWidth="2.5" />

            {/* 건물 내부 라벨 */}
            <g fontFamily="'Onglip Uiyeon', serif" fill="#5A5A5A">
              <text x="290" y="158" textAnchor="middle" fontSize="22" fontWeight="600">상생약국</text>
              <text x="290" y="232" textAnchor="middle" fontSize="30" fontWeight="700" fill="#3D3D3D">더 메리든</text>
              <text x="420" y="288" textAnchor="middle" fontSize="22" fontWeight="600">서현순대</text>
              <text x="220" y="320" textAnchor="middle" fontSize="22" fontWeight="600">CGV</text>
            </g>

            {/* 입구 마커 */}
            {/* ② 북쪽 */}
            <g>
              <line x1="290" y1="100" x2="290" y2="116" stroke="#FF6B1A" strokeWidth="2.5" strokeLinecap="round" />
              <polygon points="285,113 295,113 290,121" fill="#FF6B1A" />
              <circle cx="290" cy="115" r="18" fill="#FF6B1A" stroke="#fff" strokeWidth="3" />
              <text x="290" y="121" textAnchor="middle" fontSize="18" fontWeight="700" fill="#fff" fontFamily="sans-serif">2</text>
            </g>
            {/* ③ 동쪽 */}
            <g>
              <line x1="465" y1="225" x2="452" y2="225" stroke="#FF6B1A" strokeWidth="2.5" strokeLinecap="round" />
              <polygon points="455,220 455,230 447,225" fill="#FF6B1A" />
              <circle cx="450" cy="225" r="18" fill="#FF6B1A" stroke="#fff" strokeWidth="3" />
              <text x="450" y="231" textAnchor="middle" fontSize="18" fontWeight="700" fill="#fff" fontFamily="sans-serif">3</text>
            </g>
            {/* ① 남쪽 */}
            <g>
              <line x1="290" y1="350" x2="290" y2="334" stroke="#FF6B1A" strokeWidth="2.5" strokeLinecap="round" />
              <polygon points="285,337 295,337 290,329" fill="#FF6B1A" />
              <circle cx="290" cy="335" r="18" fill="#FF6B1A" stroke="#fff" strokeWidth="3" />
              <text x="290" y="341" textAnchor="middle" fontSize="18" fontWeight="700" fill="#fff" fontFamily="sans-serif">1</text>
            </g>
          </svg>
        </div>

        <div style={styles.legend}>
          {[
            { n: 1, label: 'CGV 옆 입구' },
            { n: 2, label: '상생약국 입구' },
            { n: 3, label: '서현순대 옆 입구' },
          ].map((item) => (
            <div key={item.n} style={styles.legendItem}>
              <span style={styles.badge}>{item.n}</span>
              <b style={styles.legendLabel}>{item.label}</b>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  )
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(60, 40, 20, 0.55)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
    padding: '20px 14px',
  },
  panel: {
    position: 'relative',
    width: '100%',
    maxWidth: '480px',
    maxHeight: '92vh',
    overflowY: 'auto',
    backgroundColor: '#FFFFFF',
    border: '1px solid #F8DEBC',
    borderRadius: '16px',
    padding: '24px 16px 22px',
    boxShadow: '0 8px 32px rgba(60, 40, 20, 0.25)',
  },
  closeBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'transparent',
    border: '1px solid #E0D6C4',
    color: '#9A9A9A',
    fontSize: '1.4rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    lineHeight: 1,
  },
  title: {
    fontFamily: "'Onglip Uiyeon', 'Gowun Batang', serif",
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#3D3D3D',
    textAlign: 'center',
    margin: '0 0 4px',
  },
  desc: {
    fontFamily: "'Onglip Uiyeon', 'Gowun Batang', serif",
    fontSize: '22px',
    color: '#9A9A9A',
    textAlign: 'center',
    margin: '0 0 16px',
    lineHeight: 1.4,
  },
  mapWrapper: {
    width: '100%',
  },
  legend: {
    marginTop: '18px',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '12px 16px',
    justifyContent: 'center',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    fontSize: '0.95rem',
  },
  badge: {
    flexShrink: 0,
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    backgroundColor: '#FF6B1A',
    color: '#fff',
    fontWeight: 700,
    fontSize: '13px',
    fontFamily: 'sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 0 2px #fff, 0 0 0 3px #FF6B1A',
  },
  legendLabel: {
    color: '#3D3D3D',
    fontFamily: "'Onglip Uiyeon', 'Gowun Batang', serif",
  },
}

export default ElevatorMapModal
