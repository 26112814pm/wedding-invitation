import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { weddingConfig } from '../config'

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

  return createPortal(
    <div style={lightboxStyles.overlay} onClick={onClose}>
      <button style={lightboxStyles.closeBtn} onClick={onClose}>
        &times;
      </button>

      <div style={lightboxStyles.content} onClick={(e) => e.stopPropagation()}>
        <img
          src={images[selectedIdx]}
          alt={`wedding photo ${selectedIdx + 1}`}
          style={lightboxStyles.image}
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

const Gallery = () => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const images = weddingConfig.gallery

  return (
    <section style={styles.section} className="fade-in">
      <div className="section-divider" />
      <h2 style={styles.title}></h2>

      <div style={styles.grid}>
        {images.map((src, i) => (
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
    fontFamily: "'Gowun Batang', serif",
    fontSize: '1.1rem',
    fontWeight: 400,
    color: '#3D3D3D',
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
    backgroundColor: '#FF6B1A',
    color: '#FFFFFF',
    fontSize: '1.6rem',
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
    color: '#E89940',
    fontSize: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(201, 169, 110, 0.3)',
    cursor: 'pointer',
  },
  counter: {
    color: '#9A9A9A',
    fontSize: '0.9rem',
    fontFamily: "'Gowun Batang', serif",
  },
}

export default Gallery
