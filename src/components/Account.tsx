import { useState } from 'react'
import { weddingConfig } from '../config'

const Account = () => {
  const [openSection, setOpenSection] = useState<'groom' | 'bride' | null>(null)

  const toggle = (section: 'groom' | 'bride') => {
    setOpenSection(openSection === section ? null : section)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('계좌번호가 복사되었습니다.')
    }).catch(() => {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      alert('계좌번호가 복사되었습니다.')
    })
  }

  const renderAccounts = (accounts: typeof weddingConfig.accounts.groom) => (
    <div style={styles.accountList}>
      {accounts.map((acc, i) => (
        <div key={i} style={styles.accountItem}>
          <div style={styles.accountInfo}>
            <span style={styles.bank}>{acc.bank}</span>
            <span style={styles.number}>{acc.number}</span>
            <span style={styles.holder}>{acc.holder}</span>
          </div>
          <button
            style={styles.copyBtn}
            onClick={() => copyToClipboard(acc.number)}
          >
            복사
          </button>
        </div>
      ))}
    </div>
  )

  return (
    <section style={styles.section} className="fade-in">
      <div className="section-divider" />
      <h2 style={styles.title}>마음 전하실 곳</h2>
      <p style={styles.subtitle}>축하의 마음을 담아 축의금을 전달해 보세요.</p>

      <div style={styles.buttons}>
        <button
          style={{
            ...styles.toggleBtn,
            ...(openSection === 'groom' ? styles.toggleBtnActive : {}),
          }}
          onClick={() => toggle('groom')}
        >
          신랑측 계좌번호 {openSection === 'groom' ? '▲' : '▼'}
        </button>
        {openSection === 'groom' && renderAccounts(weddingConfig.accounts.groom)}

        <button
          style={{
            ...styles.toggleBtn,
            ...(openSection === 'bride' ? styles.toggleBtnActive : {}),
          }}
          onClick={() => toggle('bride')}
        >
          신부측 계좌번호 {openSection === 'bride' ? '▲' : '▼'}
        </button>
        {openSection === 'bride' && renderAccounts(weddingConfig.accounts.bride)}
      </div>
    </section>
  )
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    padding: '60px 24px',
    textAlign: 'center',
    maxWidth: '480px',
    margin: '0 auto',
    backgroundColor: '#FFF4E8',
  },
  title: {
    fontFamily: "'Onglip Uiyeon', 'Gowun Batang', serif",
    fontSize: '2  rem',
    fontWeight: 400,
    color: '#3D3D3D',
    marginTop: '0px',
    marginBottom: '12px',
    letterSpacing: '4px',
  },
  subtitle: {
    fontSize: '1.5rem',
    color: '#9A9A9A',
    marginBottom: '28px',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  toggleBtn: {
    width: '100%',
    padding: '14px 20px',
    fontSize: '1.5rem',
    color: '#5A5A5A',
    backgroundColor: '#FFF4E8',
    border: '1px solid #F5D9B8',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: "'Onglip Uiyeon', 'Noto Serif KR', serif",
  },
  toggleBtnActive: {
    backgroundColor: '#FFAA66',
    borderColor: '#FF6B1A',
  },
  accountList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '12px 0',
  },
  accountItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    backgroundColor: '#FAFAFA',
    borderRadius: '8px',
  },
  accountInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '2px',
  },
  bank: {
    fontSize: '1.5rem',
    color: '#9A9A9A',
  },
  number: {
    fontSize: '1.5rem',
    color: '#3D3D3D',
    fontWeight: 700,
  },
  holder: {
    fontSize: '1.5rem',
    color: '#9A9A9A',
  },
  copyBtn: {
    padding: '6px 14px',
    fontSize: '1.5rem',
    color: '#FFFFFF',
    backgroundColor: '#FF6B1A',
    border: 'none',
    borderRadius: '16px',
    cursor: 'pointer',
    fontFamily: "'Onglip Uiyeon', 'Noto Serif KR', serif",
  },
}

export default Account
