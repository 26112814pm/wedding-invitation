import { useState, useEffect } from 'react'
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore'
import { db } from '../firebase'
import * as XLSX from 'xlsx'

interface RsvpEntry {
  id: string
  side: string
  attending: boolean
  name: string
  message: string
  dining: boolean
  guestCount: number
  createdAt: Timestamp | null
}

interface GuestMessage {
  id: string
  name: string
  message: string
  createdAt: Timestamp | null
}

const PASSWORD = 'wedding2026'

const Admin = () => {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [tab, setTab] = useState<'rsvp' | 'guestbook'>('rsvp')
  const [rsvpData, setRsvpData] = useState<RsvpEntry[]>([])
  const [guestData, setGuestData] = useState<GuestMessage[]>([])

  useEffect(() => {
    if (!authed) return

    const rsvpQ = query(collection(db, 'rsvp'), orderBy('createdAt', 'desc'))
    const unsub1 = onSnapshot(rsvpQ, (snap) => {
      setRsvpData(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as RsvpEntry)))
    })

    const guestQ = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'))
    const unsub2 = onSnapshot(guestQ, (snap) => {
      setGuestData(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as GuestMessage)))
    })

    return () => { unsub1(); unsub2() }
  }, [authed])

  const formatDate = (ts: Timestamp | null) => {
    if (!ts) return ''
    const d = ts.toDate()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  const exportRsvpExcel = () => {
    const rows = rsvpData.map((r) => ({
      '구분': r.side === 'groom' ? '신랑측' : '신부측',
      '참석여부': r.attending ? '참석' : '불참',
      '이름': r.name,
      '식사여부': r.attending ? (r.dining ? '식사함' : '식사안함') : '-',
      '인원수': r.attending ? r.guestCount : 0,
      '등록일시': formatDate(r.createdAt),
      '메시지': r.message || '',
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    ws['!cols'] = [{ wch: 8 }, { wch: 8 }, { wch: 10 }, { wch: 10 }, { wch: 8 }, { wch: 18 }, { wch: 40 }]
    if (ws['!ref']) ws['!autofilter'] = { ref: ws['!ref'] } // 헤더 1행 필터
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'RSVP')
    XLSX.writeFile(wb, `참석의사_${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  const exportGuestExcel = () => {
    const rows = guestData.map((g) => ({
      '이름': g.name,
      '메시지': g.message,
      '등록일시': formatDate(g.createdAt),
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    ws['!cols'] = [{ wch: 10 }, { wch: 40 }, { wch: 18 }]
    if (ws['!ref']) ws['!autofilter'] = { ref: ws['!ref'] } // 헤더 1행 필터
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '방명록')
    XLSX.writeFile(wb, `방명록_${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  if (!authed) {
    return (
      <div style={s.loginContainer}>
        <div style={s.loginCard}>
          <h2 style={s.loginTitle}>관리자 페이지</h2>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && pw === PASSWORD && setAuthed(true)}
            placeholder="비밀번호를 입력하세요"
            style={s.loginInput}
          />
          <button
            style={s.loginBtn}
            onClick={() => {
              if (pw === PASSWORD) setAuthed(true)
              else alert('비밀번호가 올바르지 않습니다.')
            }}
          >
            로그인
          </button>
        </div>
      </div>
    )
  }

  const attending = rsvpData.filter((r) => r.attending)
  const totalGuests = attending.reduce((sum, r) => sum + r.guestCount, 0)
  const groomCount = attending.filter((r) => r.side === 'groom').reduce((sum, r) => sum + r.guestCount, 0)
  const brideCount = attending.filter((r) => r.side === 'bride').reduce((sum, r) => sum + r.guestCount, 0)
  const diningCount = attending.filter((r) => r.dining).reduce((sum, r) => sum + r.guestCount, 0)

  return (
    <div style={s.container}>
      <h1 style={s.pageTitle}>관리자 페이지</h1>

      {/* 탭 */}
      <div style={s.tabs}>
        <button style={{ ...s.tabBtn, ...(tab === 'rsvp' ? s.tabActive : {}) }} onClick={() => setTab('rsvp')}>
          참석의사 ({rsvpData.length})
        </button>
        <button style={{ ...s.tabBtn, ...(tab === 'guestbook' ? s.tabActive : {}) }} onClick={() => setTab('guestbook')}>
          방명록 ({guestData.length})
        </button>
      </div>

      {tab === 'rsvp' && (
        <>
          {/* 요약 */}
          <div style={s.summary}>
            <div style={s.summaryItem}>
              <span style={s.summaryLabel}>총 참석</span>
              <span style={s.summaryValue}>{totalGuests}명</span>
            </div>
            <div style={s.summaryItem}>
              <span style={s.summaryLabel}>신랑측</span>
              <span style={s.summaryValue}>{groomCount}명</span>
            </div>
            <div style={s.summaryItem}>
              <span style={s.summaryLabel}>신부측</span>
              <span style={s.summaryValue}>{brideCount}명</span>
            </div>
            <div style={s.summaryItem}>
              <span style={s.summaryLabel}>식사</span>
              <span style={s.summaryValue}>{diningCount}명</span>
            </div>
          </div>

          <button style={s.exportBtn} onClick={exportRsvpExcel}>
            엑셀 다운로드
          </button>

          {/* 테이블 */}
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>구분</th>
                  <th style={s.th}>참석</th>
                  <th style={s.th}>이름</th>
                  <th style={s.th}>식사</th>
                  <th style={s.th}>인원</th>
                  <th style={s.th}>일시</th>
                  <th style={s.th}>메시지</th>
                </tr>
              </thead>
              <tbody>
                {rsvpData.map((r) => (
                  <tr key={r.id}>
                    <td style={s.td}>{r.side === 'groom' ? '신랑' : '신부'}</td>
                    <td style={{ ...s.td, color: r.attending ? '#2E7D32' : '#C62828' }}>
                      {r.attending ? 'O' : 'X'}
                    </td>
                    <td style={s.td}>{r.name}</td>
                    <td style={s.td}>{r.attending ? (r.dining ? 'O' : 'X') : '-'}</td>
                    <td style={s.td}>{r.attending ? r.guestCount : '-'}</td>
                    <td style={{ ...s.td, fontSize: '0.7rem' }}>{formatDate(r.createdAt)}</td>
                    <td style={{ ...s.td, textAlign: 'left', whiteSpace: 'normal', minWidth: '160px' }}>{r.message || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'guestbook' && (
        <>
          <button style={s.exportBtn} onClick={exportGuestExcel}>
            엑셀 다운로드
          </button>

          <div style={s.guestList}>
            {guestData.map((g) => (
              <div key={g.id} style={s.guestCard}>
                <div style={s.guestHeader}>
                  <strong>{g.name}</strong>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-light)' }}>{formatDate(g.createdAt)}</span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--color-text)' }}>{g.message}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  loginContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-bg)',
    padding: '20px',
  },
  loginCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '40px 28px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    textAlign: 'center',
    width: '100%',
    maxWidth: '360px',
  },
  loginTitle: {
    fontFamily: "'Gowun Batang', serif",
    fontSize: '1.2rem',
    color: 'var(--color-text-dark)',
    marginBottom: '24px',
    letterSpacing: '3px',
  },
  loginInput: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '0.9rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--color-divider)',
    borderRadius: '8px',
    marginBottom: '12px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Noto Serif KR', serif",
  },
  loginBtn: {
    width: '100%',
    padding: '14px',
    fontSize: '0.95rem',
    color: '#FFFFFF',
    backgroundColor: 'var(--color-primary)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: "'Gowun Batang', serif",
  },
  container: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '24px 16px',
    backgroundColor: 'var(--color-bg)',
    minHeight: '100vh',
  },
  pageTitle: {
    fontFamily: "'Gowun Batang', serif",
    fontSize: '1.3rem',
    color: 'var(--color-text-dark)',
    textAlign: 'center',
    marginBottom: '20px',
    letterSpacing: '3px',
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  },
  tabBtn: {
    flex: 1,
    padding: '12px',
    fontSize: '0.85rem',
    backgroundColor: '#FFFFFF',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--color-divider)',
    borderRadius: '8px',
    cursor: 'pointer',
    color: 'var(--color-text)',
    fontFamily: "'Noto Serif KR', serif",
  },
  tabActive: {
    backgroundColor: 'var(--color-primary)',
    borderColor: 'var(--color-primary)',
    color: '#FFFFFF',
  },
  summary: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
    marginBottom: '16px',
  },
  summaryItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
    padding: '12px 8px',
    textAlign: 'center',
  },
  summaryLabel: {
    display: 'block',
    fontSize: '0.7rem',
    color: 'var(--color-text-light)',
    marginBottom: '4px',
  },
  summaryValue: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: 'var(--color-primary)',
  },
  exportBtn: {
    width: '100%',
    padding: '12px',
    fontSize: '0.85rem',
    color: '#FFFFFF',
    backgroundColor: '#2E7D32',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '16px',
    fontFamily: "'Noto Serif KR', serif",
  },
  tableWrap: {
    overflowX: 'auto',
    borderRadius: '10px',
    backgroundColor: '#FFFFFF',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.8rem',
    fontFamily: "'Noto Serif KR', serif",
  },
  th: {
    padding: '10px 6px',
    backgroundColor: 'var(--color-bg)',
    color: 'var(--color-text-light)',
    fontWeight: 600,
    fontSize: '0.75rem',
    borderBottom: '1px solid #F5D9B8',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '10px 6px',
    borderBottom: '1px solid #F8DEBC',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
  guestList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  guestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
    padding: '14px 16px',
  },
  guestHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
}

export default Admin
