import React, { useState } from 'react';

const Login = ({ onLogin }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Demo credentials (in production, this would be handled by backend API)
    const validCredentials = [
        { username: 'doctor', password: 'skin2024', name: 'Dr. Akash' },
        { username: 'akash', password: 'akash123', name: 'Dr. Akash' },
        { username: 'admin', password: 'admin123', name: 'Dr. Administrator' },
        { username: 'dermatologist', password: 'derm2024', name: 'Dr. Kumar' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const user = validCredentials.find(
            u => u.username === credentials.username && u.password === credentials.password
        );

        if (user) {
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userName', user.name);
            onLogin(user);
        } else {
            setError('Invalid credentials. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <section style={{
            background: 'linear-gradient(135deg, #0A0E27 0%, #1A1F3A 50%, #2A2F4A 100%)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated Background */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'radial-gradient(circle at 20% 50%, rgba(0, 102, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 201, 255, 0.15) 0%, transparent 50%)',
                animation: 'float 20s ease-in-out infinite',
                pointerEvents: 'none'
            }} />

            {/* Login Card */}
            <div style={{
                maxWidth: '480px',
                width: '100%',
                position: 'relative',
                zIndex: 1,
                animation: 'scaleIn 0.6s ease-out'
            }}>
                {/* Header */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '40px'
                }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        margin: '0 auto 25px',
                        background: 'linear-gradient(135deg, #0066FF 0%, #00C9FF 100%)',
                        borderRadius: '25px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 20px 60px rgba(0, 102, 255, 0.4)',
                        animation: 'pulse 2s ease-in-out infinite'
                    }}>
                        <i className="fas fa-user-md" style={{
                            fontSize: '3rem',
                            color: 'white'
                        }}></i>
                    </div>

                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: '900',
                        background: 'linear-gradient(135deg, #0066FF 0%, #00C9FF 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '10px',
                        fontFamily: "'Space Grotesk', sans-serif"
                    }}>
                        Doctor Login
                    </h1>

                    <p style={{
                        color: '#E8EDF4',
                        fontSize: '1.1rem'
                    }}>
                        Secure Access to Clinical Assessment System
                    </p>
                </div>

                {/* Login Form */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '25px',
                    padding: '40px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{
                                display: 'block',
                                color: '#F7F9FC',
                                marginBottom: '10px',
                                fontSize: '0.95rem',
                                fontWeight: '700'
                            }}>
                                <i className="fas fa-user" style={{ marginRight: '10px', color: '#00C9FF' }}></i>
                                Username
                            </label>
                            <input
                                type="text"
                                value={credentials.username}
                                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                placeholder="Enter your username"
                                required
                                style={{
                                    width: '100%',
                                    padding: '15px 20px',
                                    borderRadius: '12px',
                                    border: '2px solid rgba(255, 255, 255, 0.1)',
                                    background: 'rgba(42, 47, 74, 0.5)',
                                    color: '#F7F9FC',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s',
                                    outline: 'none'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#0066FF'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                            />
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={{
                                display: 'block',
                                color: '#F7F9FC',
                                marginBottom: '10px',
                                fontSize: '0.95rem',
                                fontWeight: '700'
                            }}>
                                <i className="fas fa-lock" style={{ marginRight: '10px', color: '#00C9FF' }}></i>
                                Password
                            </label>
                            <input
                                type="password"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                placeholder="Enter your password"
                                required
                                style={{
                                    width: '100%',
                                    padding: '15px 20px',
                                    borderRadius: '12px',
                                    border: '2px solid rgba(255, 255, 255, 0.1)',
                                    background: 'rgba(42, 47, 74, 0.5)',
                                    color: '#F7F9FC',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s',
                                    outline: 'none'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#0066FF'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                            />
                        </div>

                        {error && (
                            <div style={{
                                background: 'rgba(255, 71, 87, 0.1)',
                                border: '2px solid rgba(255, 71, 87, 0.3)',
                                borderRadius: '12px',
                                padding: '15px',
                                marginBottom: '25px',
                                color: '#FF4757',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                animation: 'shake 0.5s ease'
                            }}>
                                <i className="fas fa-exclamation-circle"></i>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                padding: '18px',
                                background: isLoading
                                    ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
                                    : 'linear-gradient(135deg, #0066FF 0%, #00C9FF 100%)',
                                border: 'none',
                                borderRadius: '12px',
                                color: 'white',
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s',
                                boxShadow: '0 10px 30px rgba(0, 102, 255, 0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px'
                            }}
                            onMouseOver={(e) => !isLoading && (e.target.style.transform = 'translateY(-2px)')}
                            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                            {isLoading ? (
                                <>
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        border: '3px solid rgba(255,255,255,0.3)',
                                        borderTop: '3px solid white',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite'
                                    }} />
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-sign-in-alt"></i>
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    {/* Demo Credentials Info */}
                    <div style={{
                        marginTop: '30px',
                        padding: '20px',
                        background: 'rgba(0, 102, 255, 0.1)',
                        borderRadius: '12px',
                        border: '1px solid rgba(0, 102, 255, 0.2)'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '12px'
                        }}>
                            <i className="fas fa-info-circle" style={{ color: '#00C9FF' }}></i>
                            <strong style={{ color: '#00C9FF', fontSize: '0.95rem' }}>
                                Demo Credentials
                            </strong>
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#E8EDF4', lineHeight: '1.8' }}>
                            <div><strong>Username:</strong> akash (or doctor)</div>
                            <div><strong>Password:</strong> akash123 (or skin2024)</div>
                            <div style={{ marginTop: '8px', fontSize: '0.85rem', opacity: 0.8 }}>
                                Will display as: Dr. Akash
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    marginTop: '30px',
                    textAlign: 'center',
                    color: '#D4DBE8',
                    fontSize: '0.9rem'
                }}>
                    <i className="fas fa-shield-alt" style={{ marginRight: '8px', color: '#00C9FF' }}></i>
                    Secure encrypted connection • Professional use only
                </div>
            </div>

            <style>{`
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }

                @keyframes pulse {
                    0%, 100% { box-shadow: 0 20px 60px rgba(0, 102, 255, 0.4); }
                    50% { box-shadow: 0 20px 80px rgba(0, 201, 255, 0.6); }
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    75% { transform: translateX(10px); }
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
            `}</style>
        </section>
    );
};

export default Login;
