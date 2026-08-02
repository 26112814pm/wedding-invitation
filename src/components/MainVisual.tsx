import { weddingConfig } from '../config'

const MainVisual = () => {
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
    backgroundColor: 'var(--color-bg)',
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
    backgroundColor: 'var(--color-bg)', // ← 안전망 (이론상 발생 안 하지만 보험)
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
    justifyContent: 'flex-start',
    background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 100%)',
  },
  topArea: {
    textAlign: 'center',
    paddingTop: '0px',
  },
  scriptText: {
    fontFamily: "'Better Chill', cursive",
    fontSize: '3rem', // ← "happily ever after" 글씨 크기
    fontWeight: 400, // ← 단일 굵기 폰트라 의미 없음. 굵기는 아래 WebkitTextStroke로 조절
    color: 'var(--color-primary)', // ← "happily ever after" 글씨 색상
    //'rgba(250, 247, 246, 0.7)',
    margin: -5,
    letterSpacing: '0px',
    textShadow: '0 1px 6px rgba(0,0,0,0)',
    // ▼ 글자 굵기 미세 조정 (0.1px 단위로 가능)
    //   0px(원본) → 0.3px(살짝) → 0.6px(보통) → 1px(아주 굵게) → 1.5px(과하게)
    WebkitTextStroke: '0.5px #FF6B1A',
  },
}

export default MainVisual
