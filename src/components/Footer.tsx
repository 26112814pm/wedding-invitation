import { weddingConfig } from '../config'

const Footer = () => {
  const { groom, bride } = weddingConfig

  return (
    <footer style={styles.footer}>
      <div style={styles.copyright}>
        <div style={{ width: '40px', height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.3), transparent)' }} />
        <p style={styles.copyrightText}>
          {groom.name} & {bride.name}
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
    backgroundColor: '#FFF4E8',
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
    fontFamily: "'Gowun Batang', serif",
    fontSize: '0.8rem',
    color: '#A87850',
    letterSpacing: '2px',
  },
}

export default Footer
