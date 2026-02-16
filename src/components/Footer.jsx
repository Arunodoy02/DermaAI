import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer" style={{
            background: 'linear-gradient(135deg, #1a1f3a 0%, #0f1729 100%)',
            color: 'white',
            padding: '40px 20px',
            textAlign: 'center',
            borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
            <div className="footer-content" style={{
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {/* Logo */}
                <div className="logo" style={{
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    marginBottom: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                }}>
                    <i className="fas fa-microscope" style={{
                        color: '#00c2ff'
                    }}></i>
                    <span>Derm<strong style={{ color: '#00c2ff' }}>AI</strong></span>
                </div>

                {/* Tagline */}
                <p style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '1rem',
                    marginBottom: '20px',
                    maxWidth: '600px',
                    margin: '0 auto 20px'
                }}>
                    AI-Powered Skin Cancer Detection System
                </p>

                {/* Disclaimer */}
                <p style={{
                    fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.5)',
                    marginBottom: '20px',
                    fontStyle: 'italic'
                }}>
                    For educational and research purposes only. Always consult a qualified dermatologist.
                </p>

                {/* Divider */}
                <div style={{
                    height: '1px',
                    background: 'rgba(255,255,255,0.1)',
                    margin: '30px 0',
                    maxWidth: '800px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}></div>

                {/* Copyright */}
                <p style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255,255,255,0.6)',
                    margin: 0
                }}>
                    © {currentYear} DermAI | Final Year Project - Skin Cancer Classification using DenseNet121
                </p>

                {/* Made with love */}
                <p style={{
                    fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.4)',
                    marginTop: '10px'
                }}>
                    Made with <span style={{ color: '#ff6b6b' }}>❤️</span> for medical innovation
                </p>
            </div>
        </footer>
    );
};

export default Footer;
