import { weddingConfig } from '../config'

// 문구(Happily Ever After·이름·날짜)가 이미지 자체에 포함되어 있어 별도 오버레이 없음
const MainVisual = () => {
  return (
    <section style={styles.section}>
      <div style={styles.photoArea}>
        <img
          src={weddingConfig.mainPhoto}
          alt="대표 웨딩 사진"
          style={styles.photo}
        />
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
    // 고정 비율 대신 사진의 실제 비율을 그대로 따름 → 사진을 교체해도 좌우/상하 잘림 없음
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '0px', // ← 사진 모서리 둥글기 (0px=각진, 8px=약간 둥글게)
    backgroundColor: 'var(--color-bg)', // ← 안전망 (이론상 발생 안 하지만 보험)
  },
  photo: {
    width: '100%',
    height: 'auto',
    display: 'block',
    touchAction: 'pan-y',
    WebkitUserSelect: 'none',
    pointerEvents: 'none',
  },
}

export default MainVisual
