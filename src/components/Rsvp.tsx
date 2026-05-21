import { useState } from 'react'
import RsvpModal from './RsvpModal'

const cosmosDivider = (
  <div className="section-divider">
    <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
      <g opacity="0.7">
        <ellipse cx="16" cy="10" rx="3" ry="6" fill="#FF7A4D" transform="rotate(0 16 16)"/>
        <ellipse cx="16" cy="10" rx="3" ry="6" fill="#FFB088" transform="rotate(45 16 16)"/>
        <ellipse cx="16" cy="10" rx="3" ry="6" fill="#FF7A4D" transform="rotate(90 16 16)"/>
        <ellipse cx="16" cy="10" rx="3" ry="6" fill="#FFB088" transform="rotate(135 16 16)"/>
        <ellipse cx="16" cy="10" rx="3" ry="6" fill="#FF7A4D" transform="rotate(180 16 16)"/>
        <ellipse cx="16" cy="10" rx="3" ry="6" fill="#FFB088" transform="rotate(225 16 16)"/>
        <ellipse cx="16" cy="10" rx="3" ry="6" fill="#FF7A4D" transform="rotate(270 16 16)"/>
        <ellipse cx="16" cy="10" rx="3" ry="6" fill="#FFB088" transform="rotate(315 16 16)"/>
        <circle cx="16" cy="16" r="2.5" fill="#E89940"/>
      </g>
    </svg>
  </div>
)

const Rsvp = () => {
  const [showModal, setShowModal] = useState(false)

  return (
    <section style={styles.section} className="fade-in">
      {cosmosDivider}
      <h2 style={styles.title}>참석 여부</h2>
      <p style={styles.subtitle}>축하의 자리에 함께 해 주시겠습니까?</p>

      <button style={styles.ctaBtn} onClick={() => setShowModal(true)}>
        참석의사 전달하기
      </button>

      <RsvpModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </section>
  )
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    padding: '60px 24px',
    textAlign: 'center',
    maxWidth: '480px',
    margin: '0 auto',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontFamily: "'Onglip Uiyeon', 'Gowun Batang', serif",
    fontSize: '1.5rem',
    fontWeight: 400,
    color: '#3D3D3D',
    marginTop: '20px',
    marginBottom: '12px',
    letterSpacing: '4px',
  },
  subtitle: {
    fontSize: '1.25rem',
    color: '#9A9A9A',
    marginBottom: '28px',
  },
  ctaBtn: {
    width: '100%',
    padding: '16px',
    fontSize: '1.25rem',
    color: '#FFFFFF',
    backgroundColor: '#FF6B1A',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: "'Onglip Uiyeon', 'Gowun Batang', serif",
    letterSpacing: '2px',
  },
}

export default Rsvp
