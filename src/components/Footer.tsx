import { weddingConfig } from '../config'

const Footer = () => {
  const { groom, bride } = weddingConfig

  return (
    <footer style={styles.footer}>
      <div style={styles.copyright}>
        <p style={styles.copyrightText}>
          <span>{groom.name}</span>
          <svg style={styles.heartSvg} width="22" height="20" viewBox="0 0 24 22" fill="none">
            <defs>
              <linearGradient id="ftDoubleHeart" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFB570" />
                <stop offset="100%" stopColor="#E04E0F" />
              </linearGradient>
            </defs>
            <g transform="translate(10 2.4) scale(0.8)" opacity="0.7">
              <path d="M9 19.5 C3.5 15 0.5 11.4 0.5 8 C0.5 5.5 2.5 3.6 4.6 3.6 C6.6 3.6 7.9 4.7 9 6.6 C10.1 4.7 11.4 3.6 13.4 3.6 C15.5 3.6 17.5 5.5 17.5 8 C17.5 11.4 14.5 15 9 19.5 Z" fill="url(#ftDoubleHeart)" />
            </g>
            <path d="M9 19.5 C3.5 15 0.5 11.4 0.5 8 C0.5 5.5 2.5 3.6 4.6 3.6 C6.6 3.6 7.9 4.7 9 6.6 C10.1 4.7 11.4 3.6 13.4 3.6 C15.5 3.6 17.5 5.5 17.5 8 C17.5 11.4 14.5 15 9 19.5 Z" fill="url(#ftDoubleHeart)" />
          </svg>
          <span>{bride.name}</span>
        </p>
      </div>
    </footer>
  )
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    padding: '40px 24px',
    textAlign: 'center',
    maxWidth: '480px',
    margin: '0 auto',
    backgroundColor: 'var(--color-bg)',
  },
  copyright: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  decoSvg: {
    width: '120px',
    height: 'auto',
  },
  copyrightText: {
    fontFamily: "var(--font-display)",
    fontSize: '1.5rem',
    color: '#A87850',
    letterSpacing: '2px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },
  heartSvg: {
    flexShrink: 0,
  },
}

export default Footer
