import { useEffect, useState } from 'react'
import { weddingConfig } from '../config'

const Calendar = () => {
  const weddingDate = new Date(weddingConfig.date)
  const year = weddingDate.getFullYear()
  const month = weddingDate.getMonth()
  const weddingDay = weddingDate.getDate()

  const [dDay, setDDay] = useState(() => calculateDDay())

  function calculateDDay() {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const target = new Date(weddingDate.getFullYear(), weddingDate.getMonth(), weddingDate.getDate())
    const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  useEffect(() => {
    const timer = setInterval(() => setDDay(calculateDDay()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Build calendar grid
  const firstDay = new Date(year, month, 1).getDay()
  const lastDate = new Date(year, month + 1, 0).getDate()
  const dayLabels = ['일', '월', '화', '수', '목', '금', '토']

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= lastDate; d++) cells.push(d)

  const monthName = month + 1

  return (
    <section style={styles.section} className="fade-in">
      <div className="section-divider" />
      <h2 style={styles.title}>
        {year}년 {monthName}월
      </h2>

      <div style={styles.calendar}>
        <div style={styles.dayLabels}>
          {dayLabels.map((label, i) => (
            <span key={i} style={{
              ...styles.dayLabel,
              color: i === 0 ? '#FF6B1A' : i === 6 ? '#6B9BD2' : '#9A9A9A',
            }}>
              {label}
            </span>
          ))}
        </div>

        <div style={styles.dayGrid}>
          {cells.map((day, i) => {
            const isWeddingDay = day === weddingDay
            const dayOfWeek = i % 7
            return (
              <span
                key={i}
                style={{
                  ...styles.day,
                  ...(isWeddingDay ? styles.weddingDay : {}),
                  color: isWeddingDay
                    ? '#FFFFFF'
                    : dayOfWeek === 0
                    ? '#FF6B1A'
                    : dayOfWeek === 6
                    ? '#6B9BD2'
                    : '#5A5A5A',
                }}
              >
                {day || ''}
              </span>
            )
          })}
        </div>
      </div>

      <div style={styles.dday}>
        <p style={styles.ddayText}>
          {dDay > 0
            ? `결혼식까지 ${dDay}일 남았습니다`
            : dDay === 0
            ? '오늘 결혼합니다!'
            : `결혼한 지 ${Math.abs(dDay)}일 되었습니다`}
        </p>
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
    fontSize: '2rem',
    fontWeight: 400,
    color: '#3D3D3D',
    marginTop: '20px',
    marginBottom: '24px',
    letterSpacing: '2px',
  },
  calendar: {
    maxWidth: '320px',
    margin: '0 auto',
  },
  dayLabels: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    marginBottom: '8px',
  },
  dayLabel: {
    fontSize: '2rem',
    fontWeight: 700,
    padding: '4px 0',
  },
  dayGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '2px',
  },
  day: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    margin: '0 auto',
    fontSize: '2rem',
    borderRadius: '50%',
  },
  weddingDay: {
    backgroundColor: '#FF6B1A',
    color: '#FFFFFF',
    fontWeight: 700,
  },
  dday: {
    marginTop: '24px',
  },
  ddayText: {
    fontFamily: "'Onglip Uiyeon', 'Gowun Batang', serif",
    fontSize: '2rem',
    color: '#E89940',
    letterSpacing: '1px',
  },
}

export default Calendar
