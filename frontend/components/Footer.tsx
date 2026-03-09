'use client';

import Link from 'next/link';


export default function Footer() {
    return (
        <footer style={{
            background: '#0d0d14',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            padding: '32px 24px',
            textAlign: 'center',
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                {/* Brand */}
                <p style={{ color: '#4a5568', fontSize: '13px', margin: '0 0 16px 0' }}>
                    © {new Date().getFullYear()} <span style={{ color: '#00ff9d', fontWeight: '600' }}>ImageBulk</span>. All rights reserved.
                </p>
                {/* Legal Links */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
                    <Link href="/privacy-policy" style={{
                        color: '#718096',
                        fontSize: '13px',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                    }}
                        onMouseOver={(e) => (e.currentTarget.style.color = '#00ff9d')}
                        onMouseOut={(e) => (e.currentTarget.style.color = '#718096')}
                    >
                        Privacy Policy
                    </Link>
                    <span style={{ color: '#2d3748' }}>|</span>
                    <Link href="/terms-of-service" style={{
                        color: '#718096',
                        fontSize: '13px',
                        textDecoration: 'none',
                    }}
                        onMouseOver={(e) => (e.currentTarget.style.color = '#a855f7')}
                        onMouseOut={(e) => (e.currentTarget.style.color = '#718096')}
                    >
                        Terms of Service
                    </Link>
                    <span style={{ color: '#2d3748' }}>|</span>
                    <a href="mailto:mrproducts.pvtltd@gmail.com" style={{
                        color: '#718096',
                        fontSize: '13px',
                        textDecoration: 'none',
                    }}
                        onMouseOver={(e) => (e.currentTarget.style.color = '#00d9ff')}
                        onMouseOut={(e) => (e.currentTarget.style.color = '#718096')}
                    >
                        Contact Us
                    </a>
                </div>
            </div>
        </footer>
    );
}
