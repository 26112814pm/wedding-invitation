import { useEffect, useState } from 'react'
import { weddingConfig } from '../config'

const Calendar = () => {
  const weddingDate = new Date(weddingConfig.date)
  const year = weddingDate.getFullYear()
  const month = weddingDate.getMonth()
  const weddingDay = weddingDate.getDate()

  // 예식 안내용 날짜·시간 문자열
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][weddingDate.getDay()]
  const hh = weddingDate.getHours()
  const mm = weddingDate.getMinutes()
  const period = hh < 12 ? '오전' : hh === 12 ? '낮' : '오후'
  const displayHour = hh > 12 ? hh - 12 : hh
  const timeStr = `${period} ${displayHour}시${mm > 0 ? ` ${mm}분` : ''}`

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

      {/* 예식 안내 */}
      <div style={styles.infoBlock}>
        <p style={styles.infoTitle}>예식 안내</p>
        <p style={styles.infoLine}>
          {year}년 {monthName}월 {weddingDay}일 {weekday}요일 {timeStr}
        </p>
        <p style={styles.infoLine}>
          {weddingConfig.location.region} {weddingConfig.location.name}{' '}
          {weddingConfig.location.hall}
        </p>
      </div>

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
              <span
                key={i}
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
            <p style={styles.ddayDays}>{remaining.days}일</p>
            <p style={styles.ddayText}>
              {pad(remaining.hours)}시간 {pad(remaining.minutes)}분 {pad(remaining.seconds)}초
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
  // 예식 안내 (달력 패널과 동일 배경 — 섹션 배경 상속)
  infoBlock: {
    textAlign: 'center',
    marginTop: '20px',
    marginBottom: '28px',
  },
  infoTitle: {
    fontFamily: "var(--font-display)",
    fontSize: '2rem',          // 달력 제목(2026년 11월)과 동일
    color: 'var(--color-accent)',
    letterSpacing: '4px',
    marginBottom: '12px',
  },
  infoLine: {
    fontFamily: "var(--font-display)",
    fontSize: '1.7rem',          // 달력 제목과 동일
    color: 'var(--color-text)',
    letterSpacing: '1px',
    lineHeight: 1.6,
    margin: 0,
  },
  title: {
    fontFamily: "var(--font-display)",
    fontSize: '2rem',
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
    backgroundColor: 'var(--color-primary)',
    color: '#FFFFFF',
    fontWeight: 700,
  },
  dday: {
    marginTop: '24px',
  },
  ddayLabel: {
    fontFamily: "var(--font-display)",
    fontSize: '1.3rem',
    color: 'var(--color-text-light)',
    letterSpacing: '1px',
    marginBottom: '4px',
  },
  ddayDays: {
    fontFamily: "var(--font-display)",
    fontSize: '2rem',          // 남은 일수 강조
    color: 'var(--color-accent)',
    letterSpacing: '1px',
    whiteSpace: 'nowrap',
  },
  ddayText: {
    fontFamily: "var(--font-display)",
    fontSize: '2rem',          // 시·분·초 (일수와 동일 크기)
    color: 'var(--color-accent)',
    letterSpacing: '1px',
    whiteSpace: 'nowrap',      // 좁은 화면에서도 한 줄 유지
  },
}

export default Calendar
