import { useEffect, useState } from 'react'
import { weddingConfig } from '../config'

const Calendar = () => {
  const weddingDate = new Date(weddingConfig.date)
  const year = weddingDate.getFullYear()
  const month = weddingDate.getMonth()
  const weddingDay = weddingDate.getDate()

  // 달력 예식일 하단에 표기할 시각 (예: 14:00)
  const clockStr = `${String(weddingDate.getHours()).padStart(2, '0')}:${String(
    weddingDate.getMinutes()
  ).padStart(2, '0')}`

  // 예식 시작 시각(오후 2시) 기준으로 남은 시간 계산 — 초 단위까지
  function calcRemaining() {
    const diff = weddingDate.getTime() - Date.now()
    if (diff <= 0) {
      // 예식 시각이 지난 경우: 며칠 지났는지
      return { passed: true, days: Math.floor(-diff / 86400000), hours: 0, minutes: 0, seconds: 0 }
    }
    return {
      passed: false,
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    }
  }

  const [remaining, setRemaining] = useState(calcRemaining)

  useEffect(() => {
    const timer = setInterval(() => setRemaining(calcRemaining()), 1000)
    return () => clearInterval(timer)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

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
              color: i === 0 ? 'var(--color-primary)' : i === 6 ? '#6B9BD2' : 'var(--color-text-light)',
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
              <div key={i} style={styles.cell}>
                <span
                  style={{
                    ...styles.day,
                    ...(isWeddingDay ? styles.weddingDay : {}),
                    color: isWeddingDay
                      ? '#FFFFFF'
                      : dayOfWeek === 0
                      ? 'var(--color-primary)'
                      : dayOfWeek === 6
                      ? '#6B9BD2'
                      : 'var(--color-text)',
                  }}
                >
                  {day || ''}
                </span>
                {/* 예식일 하단에 예식 시각 표기 */}
                {isWeddingDay && <span style={styles.dayTime}>{clockStr}</span>}
              </div>
            )
          })}
        </div>
      </div>

      <div style={styles.dday}>
        {remaining.passed ? (
          <p style={styles.ddayText}>
            {remaining.days === 0
              ? '오늘 결혼합니다!'
              : `결혼한 지 ${remaining.days}일 되었습니다`}
          </p>
        ) : (
          <>
            <p style={styles.ddayLabel}>결혼식까지 남은 시간</p>
            <p style={styles.ddayText}>
              {remaining.days}일 {pad(remaining.hours)}시간 {pad(remaining.minutes)}분{' '}
              {pad(remaining.seconds)}초
            </p>
          </>
        )}
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
    backgroundColor: 'var(--color-bg)',
  },
  title: {
    fontFamily: "var(--font-display)",
    fontSize: '1.35rem',
    fontWeight: 400,
    color: 'var(--color-text-dark)',
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
    fontSize: '0.85rem',
    fontWeight: 700,
    padding: '4px 0',
  },
  dayGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '2px 2px',
    rowGap: '6px',
  },
  // 날짜 셀 — 예식일은 숫자 아래에 시각이 붙으므로 세로 스택
  cell: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '36px',
  },
  day: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    fontSize: '1rem',
    borderRadius: '50%',
    flexShrink: 0,
  },
  weddingDay: {
    backgroundColor: 'var(--color-primary)',
    color: '#FFFFFF',
    fontWeight: 700,
  },
  dayTime: {
    fontFamily: "var(--font-display)",
    fontSize: '0.7rem',
    fontWeight: 700,
    color: 'var(--color-primary)',
    lineHeight: 1.2,
    marginTop: '3px',
    whiteSpace: 'nowrap',
  },
  dday: {
    marginTop: '24px',
  },
  ddayLabel: {
    fontFamily: "var(--font-display)",
    fontSize: '0.85rem',
    color: 'var(--color-text-light)',
    letterSpacing: '1px',
    marginBottom: '4px',
  },
  ddayText: {
    fontFamily: "var(--font-display)",
    fontSize: '1rem',       // 한 줄 유지 위해 축소
    color: 'var(--color-accent)',
    letterSpacing: '0.5px',
    whiteSpace: 'nowrap',      // 좁은 화면에서도 한 줄 유지
  },
}

export default Calendar
