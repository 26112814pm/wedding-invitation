import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { weddingConfig } from '../config'

const SWIPE_THRESHOLD = 50      // 좌우 스와이프로 인식되는 최소 거리(px)
const TAP_MOVE_TOLERANCE = 10   // 이 이하의 움직임은 "탭"으로 처리

const Lightbox = ({
  images,
  selectedIdx,
  onClose,
  onPrev,
  onNext,
}: {
  images: string[]
  selectedIdx: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) => {
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const dragMoved = useRef(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [onClose, onPrev, onNext])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    dragMoved.current = false
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchStartX.current
    if (Math.abs(dx) > TAP_MOVE_TOLERANCE) dragMoved.current = true
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) onPrev()
      else onNext()
    }
  }

  // 오버레이 탭 시(스와이프 아닌 경우만) 닫기
  const handleOverlayClick = () => {
    if (dragMoved.current) return
    onClose()
  }

  return createPortal(
    <div
      style={lightboxStyles.overlay}
      onClick={handleOverlayClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <button style={lightboxStyles.closeBtn} onClick={onClose}>
        &times;
      </button>

      <div style={lightboxStyles.content} onClick={(e) => e.stopPropagation()}>
        <img
          src={images[selectedIdx]}
          alt={`wedding photo ${selectedIdx + 1}`}
          style={lightboxStyles.image}
          draggable={false}
        />
      </div>

      <div style={lightboxStyles.bottomBar} onClick={(e) => e.stopPropagation()}>
        <button style={lightboxStyles.navBtn} onClick={onPrev}>
          &#8249;
        </button>
        <span style={lightboxStyles.counter}>
          {selectedIdx + 1} / {images.length}
        </span>
        <button style={lightboxStyles.navBtn} onClick={onNext}>
          &#8250;
        </button>
      </div>
    </div>,
    document.body
  )
}

const PREVIEW_COUNT = 9   // 3열 × 3행 — 더보기 전까지 노출할 사진 수

const Gallery = () => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [expanded, setExpanded] = useState(false)
  const images = weddingConfig.gallery
  const visibleImages = expanded ? images : images.slice(0, PREVIEW_COUNT)
  const hasMore = images.length > PREVIEW_COUNT

  return (
    <section style={styles.section} className="fade-in">
      <div className="section-divider" />
      <h2 style={styles.title}></h2>

      <div style={styles.grid}>
        {visibleImages.map((src, i) => (
          <div
            key={i}
            style={styles.imageWrapper}
            onClick={() => setSelectedIdx(i)}
          >
            <img
              src={src}
              alt={`wedding photo ${i + 1}`}
              style={styles.image}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          style={styles.moreBtn}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? '접기' : `사진 더보기 (${images.length - PREVIEW_COUNT}장)`}
          <span style={{
            ...styles.moreArrow,
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}>
            ▾
          </span>
        </button>
      )}

      {selectedIdx !== null && (
        <Lightbox
          images={images}
          selectedIdx={selectedIdx}
          onClose={() => setSelectedIdx(null)}
          onPrev={() => setSelectedIdx(selectedIdx > 0 ? selectedIdx - 1 : images.length - 1)}
          onNext={() => setSelectedIdx(selectedIdx < images.length - 1 ? selectedIdx + 1 : 0)}
        />
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
    fontSize: '1.3rem',
    fontWeight: 400,
    color: 'var(--color-text-dark)',
    marginTop: '20px',
    marginBottom: '24px',
    letterSpacing: '4px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '4px',
  },
  imageWrapper: {
    aspectRatio: '1',
    overflow: 'hidden',
    cursor: 'pointer',
    borderRadius: '2px',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  },
  moreBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    width: '100%',
    marginTop: '16px',
    padding: '10px 20px',
    fontFamily: "var(--font-display)",
    fontSize: '0.95rem',
    color: 'var(--color-accent)',
    backgroundColor: 'transparent',
    border: '1px solid #E89940',
    borderRadius: '24px',
    cursor: 'pointer',
    letterSpacing: '2px',
  },
  moreArrow: {
    display: 'inline-block',
    fontSize: '0.9rem',
    transition: 'transform 0.3s ease',
  },
}

const lightboxStyles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(250, 246, 241, 0.95)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
  },
  closeBtn: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-primary)',
    color: '#FFFFFF',
    fontSize: '1.4rem',
    fontWeight: 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid rgba(255, 255, 255, 0.6)',
    cursor: 'pointer',
    zIndex: 100000,
    boxShadow: '0 2px 12px rgba(196, 114, 78, 0.4)',
  },
  content: {
    maxWidth: '90vw',
    maxHeight: '70vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    maxWidth: '90vw',
    maxHeight: '70vh',
    objectFit: 'contain',
    borderRadius: '8px',
    boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
  },
  bottomBar: {
    position: 'fixed',
    bottom: '0',
    left: '0',
    right: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '24px',
    padding: '20px',
    background: 'linear-gradient(transparent, rgba(250, 246, 241, 0.8))',
  },
  navBtn: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    color: 'var(--color-accent)',
    fontSize: '1.3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(201, 169, 110, 0.3)',
    cursor: 'pointer',
  },
  counter: {
    color: 'var(--color-text-light)',
    fontSize: '1rem',
    fontFamily: "var(--font-display)",
  },
}

export default Gallery
