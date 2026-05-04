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
          {/* 상단: happily ever after */}
          <div style={styles.topArea}>
            <p style={styles.scriptText}>happily ever after</p>
          </div>

          {/* 하단: 이름 + 날짜 + 장소 */}
          <div style={styles.bottomArea}>
            <div style={styles.names}>
              <span style={styles.name}>{weddingConfig.groom.name}</span>
              <svg style={styles.heartSvg} width="16" height="15" viewBox="0 0 24 22" fill="none">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#FF7A4D" fillOpacity="0.9"/>
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
    height: '600px', // ← 메인 사진 세로 높이 (px 고정값, 원하는 크기로 조정)
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '0px', // ← 사진 모서리 둥글기 (0px=각진, 8px=약간 둥글게)
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
    fontSize: '4rem', // ← "happily ever after" 글씨 크기
    fontWeight: 400, // ← 단일 굵기 폰트라 의미 없음. 굵기는 아래 WebkitTextStroke로 조절
    color: '#FF6B1A', // ← "happily ever after" 글씨 색상
    //'rgba(250, 247, 246, 0.7)',
    margin: -5,
    letterSpacing: '2px',
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
    gap: '12px',
    marginBottom: '0px',
  },
  name: {
    fontFamily: "'Gowun Batang', serif",
    fontSize: '1.2rem', // ← 신랑/신부 이름 글씨 크기
    fontWeight: 700,
    color: '#FFFFFF', // ← 신랑/신부 이름 글씨 색상
    letterSpacing: '1px',
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
    fontFamily: "'Gowun Batang', serif",
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: '1px',
    margin: '0 0 4px',
    textShadow: '0 1px 6px rgba(0,0,0,0.4)',
  },
  venueText: {
    fontFamily: "'Gowun Batang', serif",
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: '1px',
    margin: 0,
    textShadow: '0 1px 6px rgba(0,0,0,0.4)',
  },
}

export default MainVisual
