import { ImageResponse } from 'next/og';
import { site } from '@/lib/site';

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #0d1117 0%, #1e1b4b 60%, #0d1117 100%)',
          color: '#e6edf3',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 28, color: '#a78bfa', marginBottom: 24 }}>
          {new URL(site.url).host}
        </div>
        <div style={{ display: 'flex', fontSize: 96, fontWeight: 800, letterSpacing: -2 }}>
          {site.name}
        </div>
        <div style={{ display: 'flex', fontSize: 40, color: '#c4b5fd', marginTop: 16 }}>
          {site.headline}
        </div>
        <div style={{ display: 'flex', fontSize: 30, color: '#94a3b8', marginTop: 40, maxWidth: 1000 }}>
          Agentic AI · RAG · ML systems, from prototype to production
        </div>
      </div>
    ),
    size
  );
}
