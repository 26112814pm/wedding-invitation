import { useState, useEffect } from 'react'
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore'
import { db } from '../firebase'

interface GuestMessage {
  id: string
  name: string
  message: string
  createdAt: Timestamp | null
}

const cosmosDivider = (
  <div className="section-divider">
  </div>
)

const Guestbook = () => {
  const [messages, setMessages] = useState<GuestMessage[]>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const q = query(
      collection(db, 'guestbook'),
      orderBy('createdAt', 'desc'),
      limit(50)
    )
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: GuestMessage[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        message: doc.data().message,
        createdAt: doc.data().createdAt,
      }))
      setMessages(msgs)
    })
    return () => unsubscribe()
  }, [])

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('이름을 입력해주세요.')
      return
    }
    if (!message.trim()) {
      alert('메시지를 입력해주세요.')
      return
    }

    setSubmitting(true)
    try {
      await addDoc(collection(db, 'guestbook'), {
        name: name.trim(),
        message: message.trim(),
        createdAt: serverTimestamp(),
      })
      setName('')
      setMessage('')
    } catch {
      alert('등록에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (ts: Timestamp | null) => {
    if (!ts) return ''
    const d = ts.toDate()
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  }

  return (
    <section style={styles.section} className="fade-in">
      {cosmosDivider}
      <h2 style={styles.title}>방명록</h2>
      <p style={styles.subtitle}>축하의 마음을 남겨주세요.</p>

      {/* 입력 폼 */}
      <div style={styles.form}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름"
          style={styles.nameInput}
          maxLength={20}
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="축하 메시지를 남겨주세요"
          style={styles.textarea}
          maxLength={500}
          rows={3}
        />
        <button
          style={{ ...styles.submitBtn, opacity: submitting ? 0.6 : 1 }}
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? '등록 중...' : '등록하기'}
        </button>
      </div>

      {/* 메시지 목록 */}
      {messages.length > 0 && (
        <div style={styles.messageList}>
          {messages.map((msg) => (
            <div key={msg.id} style={styles.messageCard}>
              <div style={styles.messageHeader}>
                <span style={styles.messageName}>{msg.name}</span>
                <span style={styles.messageDate}>{formatDate(msg.createdAt)}</span>
              </div>
              <p style={styles.messageText}>{msg.message}</p>
            </div>
          ))}
        </div>
      )}
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
    fontFamily: "var(--font-display)",
    fontSize: '1.35rem',
    fontWeight: 400,
    color: 'var(--color-text-dark)',
    marginTop: '0px',
    marginBottom: '12px',
    letterSpacing: '4px',
  },
  subtitle: {
    fontSize: '0.9rem',
    color: 'var(--color-text-light)',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '24px',
  },
  nameInput: {
    padding: '12px 14px',
    fontSize: '0.95rem',
    color: 'var(--color-text-dark)',
    backgroundColor: '#FFFFFF',
    border: '1px solid #F5D9B8',
    borderRadius: '8px',
    fontFamily: "var(--font-serif)",
    outline: 'none',
  },
  textarea: {
    padding: '12px 14px',
    fontSize: '0.95rem',
    color: 'var(--color-text-dark)',
    backgroundColor: '#FFFFFF',
    border: '1px solid #F5D9B8',
    borderRadius: '8px',
    fontFamily: "var(--font-serif)",
    outline: 'none',
    resize: 'none',
    lineHeight: 1.6,
  },
  submitBtn: {
    padding: '12px',
    fontSize: '0.95rem',
    color: '#FFFFFF',
    backgroundColor: 'var(--color-primary)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: "var(--font-display)",
    letterSpacing: '2px',
  },
  messageList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxHeight: '400px',
    overflowY: 'auto',
    textAlign: 'left',
  },
  messageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
    padding: '14px 16px',
    border: '1px solid #F5D9B8',
  },
  messageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  messageName: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: 'var(--color-text-dark)',
    fontFamily: "var(--font-display)",
  },
  messageDate: {
    fontSize: '0.75rem',
    color: '#A87850',
  },
  messageText: {
    fontSize: '0.9rem',
    color: 'var(--color-text)',
    lineHeight: 1.7,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    margin: 0,
  },
}

export default Guestbook
