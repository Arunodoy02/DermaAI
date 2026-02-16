import React, { useState, useEffect } from 'react';

const Navbar = ({ userName, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('home');
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);

            // Update active link based on scroll position
            const sections = document.querySelectorAll('section[id]');
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - 200) {
                    setActiveLink(section.getAttribute('id'));
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            setActiveLink(sectionId);
            setIsMenuOpen(false);
        }
    };

    const navItems = [
        { id: 'home', label: 'Home' },
        { id: 'features', label: 'Clinical Features' },
        { id: 'clinical-assessment', label: 'Assessment' },
        { id: 'about', label: 'Documentation' }
    ];

    const ActionButtons = ({ mobile = false }) => (
        <div className={mobile ? "nav-actions-mobile" : "nav-actions"} style={!mobile ? { display: 'flex', alignItems: 'center', gap: '15px' } : {}}>
            {userName && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 15px',
                    background: 'rgba(0, 102, 255, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 102, 255, 0.3)',
                    marginBottom: mobile ? '10px' : '0'
                }}>
                    <i className="fas fa-user-md" style={{ color: '#00C9FF' }}></i>
                    <span style={{ color: '#00C9FF', fontWeight: '600', fontSize: '0.95rem' }}>
                        {userName}
                    </span>
                </div>
            )}
            <button
                onClick={() => scrollToSection('clinical-assessment')}
                style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #0066FF 0%, #00C9FF 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s',
                    width: mobile ? '100%' : 'auto',
                    marginBottom: mobile ? '10px' : '0'
                }}
            >
                <i className="fas fa-stethoscope" style={{ marginRight: '8px' }}></i>
                Assessment
            </button>
            {onLogout && (
                <button
                    onClick={onLogout}
                    style={{
                        padding: '10px 20px',
                        background: 'rgba(255, 71, 87, 0.1)',
                        border: '2px solid rgba(255, 71, 87, 0.3)',
                        borderRadius: '8px',
                        color: '#FF4757',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        transition: 'all 0.3s',
                        width: mobile ? '100%' : 'auto'
                    }}
                    onMouseOver={(e) => {
                        e.target.style.background = 'rgba(255, 71, 87, 0.2)';
                        e.target.style.borderColor = '#FF4757';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.background = 'rgba(255, 71, 87, 0.1)';
                        e.target.style.borderColor = 'rgba(255, 71, 87, 0.3)';
                    }}
                >
                    <i className="fas fa-sign-out-alt" style={{ marginRight: '8px' }}></i>
                    Logout
                </button>
            )}
        </div>
    );

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="nav-container">
                <div className="logo" onClick={() => scrollToSection('home')}>
                    <i className="fas fa-user-md"></i>
                    <span>Skin<strong>Cancer</strong>Detect</span>
                </div>

                <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </button>

                <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    {navItems.map(item => (
                        <li key={item.id}>
                            <a
                                href={`#${item.id}`}
                                className={`nav-link ${activeLink === item.id ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection(item.id);
                                }}
                            >
                                {item.label}
                            </a>
                        </li>
                    ))}
                    {/* Mobile Actions */}
                    <li className="mobile-only" style={{ display: isMenuOpen ? 'block' : 'none', width: '100%' }}>
                        <ActionButtons mobile={true} />
                    </li>
                </ul>

                {/* Desktop Actions */}
                <div className="desktop-only">
                    <ActionButtons />
                </div>
            </div>

        </nav>
    );
};

export default Navbar;
