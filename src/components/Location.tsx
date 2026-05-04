import { useEffect, useRef } from 'react'
import { weddingConfig } from '../config'

declare global {
  interface Window {
    kakao: any
  }
}

const Location = () => {
  const { location } = weddingConfig
  const mapRef = useRef<HTMLDivElement>(null)

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

      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:8px 12px;font-size:13px;font-weight:bold;white-space:nowrap;">${location.name} ${location.hall}</div>`,
      })
      infowindow.open(map, marker)
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

      {/* 지도 앱 바로가기 버튼 */}
      <div style={styles.mapButtons}>
        <a href={location.naverMapUrl} target="_blank" rel="noopener noreferrer" style={styles.mapBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#1EC800" style={{ marginRight: '4px' }}>
            <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/>
          </svg>
          네이버 지도
        </a>
        <a href={location.kakaoMapUrl} target="_blank" rel="noopener noreferrer" style={styles.mapBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#FEE500" style={{ marginRight: '4px' }}>
            <path d="M12 3C5.8 3 1 6.6 1 11c0 2.8 1.9 5.3 4.7 6.7-.2.7-.7 2.5-.8 2.9-.1.5.2.5.4.3.2-.1 2.4-1.6 3.4-2.3.7.1 1.5.2 2.3.2 6.2 0 11-3.6 11-8S18.2 3 12 3z"/>
          </svg>
          카카오맵
        </a>
        <a href={location.tmapUrl} target="_blank" rel="noopener noreferrer" style={styles.mapBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF0000" style={{ marginRight: '4px' }}>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          티맵
        </a>
      </div>

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
    backgroundColor: '#FFF4E8',
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
  venueInfo: {
    marginBottom: '24px',
  },
  venueName: {
    fontFamily: "'Gowun Batang', serif",
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#3D3D3D',
    marginBottom: '4px',
  },
  venueHall: {
    fontSize: '0.9rem',
    color: '#5A5A5A',
    marginBottom: '8px',
  },
  address: {
    fontSize: '0.85rem',
    color: '#9A9A9A',
    marginBottom: '10px',
  },
  copyBtn: {
    fontSize: '0.75rem',
    color: '#E89940',
    backgroundColor: 'transparent',
    border: '1px solid #E89940',
    borderRadius: '12px',
    padding: '4px 14px',
    cursor: 'pointer',
    fontFamily: "'Gowun Batang', serif",
  },
  kakaoMap: {
    width: '100%',
    height: '250px',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid #F5D9B8',
    marginBottom: '16px',
  },
  mapButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '28px',
  },
  mapBtn: {
    padding: '10px 14px',
    fontSize: '0.8rem',
    color: '#5A5A5A',
    border: '1px solid #EBC79A',
    borderRadius: '20px',
    backgroundColor: '#FFFFFF',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
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
    fontSize: '0.85rem',
    lineHeight: 1.6,
  },
  transportType: {
    flexShrink: 0,
    fontWeight: 700,
    color: '#E89940',
    minWidth: '42px',
  },
  transportDetail: {
    color: '#5A5A5A',
  },
}

export default Location
