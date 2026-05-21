import { weddingConfig } from '../config'

const MainVisual = () => {
  const date = new Date(weddingConfig.date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const period = hours < 12 ? '오전' : hours === 12 ? '낮' : '오후'
  const displayHour = hours > 12 ? hours - 12 : hours
  const timeStr = `${period} ${displayHour}시${minutes > 0 ? ` ${minutes}분` : ''}`

  return (
    <section style={styles.section}>
      <div style={styles.photoArea}>
        <img
          src={weddingConfig.mainPhoto}
          alt="대표 웨딩 사진"
          style={styles.photo}
        />
        {/* 전체 오버레이 */}
        <div style={styles.overlay}>
          {/* 상단: Happily ever after */}
          <div style={styles.topArea}>
            <p style={styles.scriptText}>Happily ever after</p>
          </div>

          {/* 하단: 이름 + 날짜 + 장소 */}
          <div style={styles.bottomArea}>
            <div style={styles.names}>
              <span style={styles.name}>{weddingConfig.groom.name}</span>
              <svg style={styles.heartSvg} width="24" height="22" viewBox="0 0 24 22" fill="none">
                <defs>
                  <linearGradient id="mvDoubleHeart" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFB570" />
                    <stop offset="100%" stopColor="#E04E0F" />
                  </linearGradient>
                </defs>
                <g transform="translate(10 2.4) scale(0.8)" opacity="0.7">
                  <path d="M9 19.5 C3.5 15 0.5 11.4 0.5 8 C0.5 5.5 2.5 3.6 4.6 3.6 C6.6 3.6 7.9 4.7 9 6.6 C10.1 4.7 11.4 3.6 13.4 3.6 C15.5 3.6 17.5 5.5 17.5 8 C17.5 11.4 14.5 15 9 19.5 Z" fill="url(#mvDoubleHeart)" />
                </g>
                <path d="M9 19.5 C3.5 15 0.5 11.4 0.5 8 C0.5 5.5 2.5 3.6 4.6 3.6 C6.6 3.6 7.9 4.7 9 6.6 C10.1 4.7 11.4 3.6 13.4 3.6 C15.5 3.6 17.5 5.5 17.5 8 C17.5 11.4 14.5 15 9 19.5 Z" fill="url(#mvDoubleHeart)" />
              </svg>
              <span style={styles.name}>{weddingConfig.bride.name}</span>
            </div>
            <p style={styles.dateText}>
              {year}.{String(month).padStart(2, '0')}.{String(day).padStart(2, '0')} {dayOfWeek}요일 {timeStr}
            </p>
            <p style={styles.venueText}>{weddingConfig.location.name} {weddingConfig.location.hall}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#FFF4E8',
    position: 'relative',
    overflow: 'hidden',
    padding: '16px 0px 24px 0px', // ← 상 우 하 좌 여백
  },
  photoArea: {
    width: '100%',
    aspectRatio: '2 / 3', // ← 사진 원본 비율(1200×1800 = 2:3) 그대로 — 잘림 없음, 검은띠 없음
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '0px', // ← 사진 모서리 둥글기 (0px=각진, 8px=약간 둥글게)
    backgroundColor: '#FFF4E8', // ← 안전망 (이론상 발생 안 하지만 보험)
  },
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    touchAction: 'pan-y',
    WebkitUserSelect: 'none',
    pointerEvents: 'none',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.35) 100%)',
  },
  topArea: {
    textAlign: 'center',
    paddingTop: '0px',
  },
  scriptText: {
    fontFamily: "'Better Chill', cursive",
    fontSize: '3rem', // ← "happily ever after" 글씨 크기
    fontWeight: 400, // ← 단일 굵기 폰트라 의미 없음. 굵기는 아래 WebkitTextStroke로 조절
    color: '#FF6B1A', // ← "happily ever after" 글씨 색상
    //'rgba(250, 247, 246, 0.7)',
    margin: -5,
    letterSpacing: '0px',
    textShadow: '0 1px 6px rgba(0,0,0,0)',
    // ▼ 글자 굵기 미세 조정 (0.1px 단위로 가능)
    //   0px(원본) → 0.3px(살짝) → 0.6px(보통) → 1px(아주 굵게) → 1.5px(과하게)
    WebkitTextStroke: '0.5px #FF6B1A',
  },
  bottomArea: {
    textAlign: 'center',
    paddingBottom: '10px',
  },
  names: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '-15px',
  },
  name: {
    fontFamily: "'Onglip Uiyeon', 'Gowun Batang', serif",
    fontSize: '1.5rem', // ← 신랑/신부 이름 글씨 크기
    fontWeight: 500,
    color: '#FFFFFF', // ← 신랑/신부 이름 글씨 색상
    letterSpacing: '5px',
    textShadow: '0 1px 8px rgba(0,0,0,0.4)',
  },
  ampersand: {
    display: 'flex',
    alignItems: 'center',
  },
  heartSvg: {
    filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.3))',
  },
  dateText: {
    fontFamily: "'Onglip Uiyeon', 'Gowun Batang', serif",
    fontSize: '1.25rem',
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: '1px',
    margin: '0 0 -15px',
    textShadow: '0 1px 6px rgba(0,0,0,0.4)',
  },
  venueText: {
    fontFamily: "'Onglip Uiyeon', 'Gowun Batang', serif",
    fontSize: '1.25rem',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: '1px',
    margin: '0 0 -10px',
    textShadow: '0 1px 6px rgba(0,0,0,0.4)',
  },
}

export default MainVisual
