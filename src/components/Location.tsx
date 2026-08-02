import { useEffect, useRef, useState } from 'react'
import { weddingConfig } from '../config'
import ElevatorMapModal from './ElevatorMapModal'

declare global {
  interface Window {
    kakao: any
  }
}

const Location = () => {
  const { location } = weddingConfig
  const mapRef = useRef<HTMLDivElement>(null)
  const [showElevatorMap, setShowElevatorMap] = useState(false)

  useEffect(() => {
    if (!mapRef.current) return

    const createMap = (position: any) => {
      if (!mapRef.current) return
      const map = new window.kakao.maps.Map(mapRef.current, {
        center: position,
        level: 3,
      })

      const marker = new window.kakao.maps.Marker({ position })
      marker.setMap(map)
    }

    const initMap = () => {
      if (!mapRef.current || !window.kakao?.maps) return

      try {
        // 카카오 키워드 검색으로 "더메리든" 정확한 위치 찾기
        if (window.kakao.maps.services?.Places) {
          const ps = new window.kakao.maps.services.Places()
          ps.keywordSearch('더메리든 서현', (data: any, status: any) => {
            if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
              const place = data[0]
              const position = new window.kakao.maps.LatLng(place.y, place.x)
              createMap(position)
            } else {
              // fallback: config 좌표 사용
              const position = new window.kakao.maps.LatLng(location.lat, location.lng)
              createMap(position)
            }
          })
        } else {
          // services 라이브러리 미로드 시 fallback
          const position = new window.kakao.maps.LatLng(location.lat, location.lng)
          createMap(position)
        }
      } catch {
        // 최종 fallback
        const position = new window.kakao.maps.LatLng(location.lat, location.lng)
        createMap(position)
      }
    }

    if (window.kakao?.maps?.LatLng) {
      initMap()
    } else if (window.kakao?.maps) {
      window.kakao.maps.load(initMap)
    } else {
      const check = setInterval(() => {
        if (window.kakao?.maps) {
          clearInterval(check)
          window.kakao.maps.load(initMap)
        }
      }, 200)
      setTimeout(() => clearInterval(check), 10000)
    }
  }, [])

  const copyAddress = () => {
    navigator.clipboard.writeText(location.roadAddress).then(() => {
      alert('주소가 복사되었습니다.')
    })
  }

  return (
    <section style={styles.section} className="fade-in">
      <div className="section-divider" />
      <h2 style={styles.title}>오시는 길</h2>

      <div style={styles.venueInfo}>
        <p style={styles.venueName}>{location.name}</p>
        <p style={styles.venueHall}>{location.hall}</p>
        <p style={styles.address}>{location.roadAddress}</p>
        <button style={styles.copyBtn} onClick={copyAddress}>
          주소 복사
        </button>
      </div>

      {/* 카카오맵 임베드 */}
      <div ref={mapRef} id="kakao-map" style={styles.kakaoMap} />

      {/* 지도 앱 바로가기 (E: 미니멀 — 큰 아이콘 + 작은 라벨) */}
      <div style={styles.mapButtons}>
        <a href={location.naverMapUrl} target="_blank" rel="noopener noreferrer" style={styles.mapBtn}>
          <img src="/wedding-invitation/images/map/naver.webp" alt="네이버 지도" style={styles.mapIcon} />
          <span style={styles.mapLabel}>네이버 지도</span>
        </a>
        <a href={location.kakaoMapUrl} target="_blank" rel="noopener noreferrer" style={styles.mapBtn}>
          <img src="/wedding-invitation/images/map/kakao.png" alt="카카오맵" style={styles.mapIcon} />
          <span style={styles.mapLabel}>카카오맵</span>
        </a>
        <a href={location.tmapUrl} target="_blank" rel="noopener noreferrer" style={styles.mapBtn}>
          <img src="/wedding-invitation/images/map/tmap.jfif" alt="티맵" style={styles.mapIcon} />
          <span style={styles.mapLabel}>티맵</span>
        </a>
      </div>

      {/* 엘레베이터 정보 버튼 */}
      <button
        style={styles.mapModalBtn}
        onClick={() => setShowElevatorMap(true)}
        aria-label="엘레베이터 정보"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
          <path d="M3 6L9 4L15 6L21 4V18L15 20L9 18L3 20V6Z" />
          <path d="M9 4V18" />
          <path d="M15 6V20" />
        </svg>
        엘레베이터 정보
      </button>

      {/* 엘레베이터 정보 팝업 */}
      <ElevatorMapModal isOpen={showElevatorMap} onClose={() => setShowElevatorMap(false)} />

      {/* 교통 안내 */}
      <div style={styles.transport}>
        {location.transport.map((item, i) => (
          <div key={i} style={styles.transportItem}>
            <span style={styles.transportType}>{item.type}</span>
            <span style={styles.transportDetail}>{item.detail}</span>
          </div>
        ))}
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
    marginTop: '0px',
    marginBottom: '20px',
    letterSpacing: '4px',
  },
  venueInfo: {
    marginBottom: '20px',
  },
  venueName: {
    fontFamily: "var(--font-display)",
    fontSize: '1.15rem',
    fontWeight: 700,
    color: 'var(--color-text-dark)',
    marginBottom: '-2px',
  },
  venueHall: {
    fontSize: '1rem',
    color: 'var(--color-text)',
    marginBottom: '-2px',
  },
  address: {
    fontSize: '0.9rem',
    color: 'var(--color-text-light)',
    marginBottom: '0px',
  },
  copyBtn: {
    fontSize: '0.85rem',
    color: 'var(--color-accent)',
    backgroundColor: 'transparent',
    border: '1px solid #E89940',
    borderRadius: '12px',
    padding: '4px 14px',
    cursor: 'pointer',
    fontFamily: "var(--font-display)",
  },
  kakaoMap: {
    width: '100%',
    height: '360px',                // ← 지도 세로 길이 (더 크게 보고 싶으면 400~500)
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid #F5D9B8',
    marginBottom: '16px',
  },
  mapButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '44px',                    // 아이콘 간 간격 (22px → 44px, 2배)
    marginBottom: '28px',
  },
  mapBtn: {
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  mapIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',           // 둥근 모서리 (앱 아이콘 스타일)
    objectFit: 'cover',
    display: 'block',
  },
  mapLabel: {
    fontSize: '0.8rem',
    color: 'var(--color-text)',
    whiteSpace: 'nowrap',
  },
  mapModalBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '12px 16px',
    fontSize: '0.95rem',
    fontWeight: 600,
    color: 'var(--color-accent)',
    backgroundColor: 'transparent',
    border: '1px solid #E89940',
    borderRadius: '12px',
    cursor: 'pointer',
    fontFamily: "var(--font-display)",
    marginBottom: '20px',
  },
  transport: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  transportItem: {
    display: 'flex',
    gap: '12px',
    fontSize: '0.95rem',
    lineHeight: 1.6,
    alignItems: 'flex-start',       // 다중 라인 detail이 와도 type은 위쪽에 고정
  },
  transportType: {
    flexShrink: 0,
    fontWeight: 700,
    color: 'var(--color-accent)',
    minWidth: '58px',               // 4글자 라벨(대절버스)도 한 줄에 들어가도록
    whiteSpace: 'nowrap',
  },
  transportDetail: {
    color: 'var(--color-text)',
    whiteSpace: 'pre-line',         // \n을 줄바꿈으로 렌더링
  },
}

export default Location
