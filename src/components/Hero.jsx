import React from 'react';

const Hero = () => {
    const stats = [
        { number: 'DenseNet121', label: 'AI Model' },
        { number: '7', label: 'Lesion Types' },
        { number: '95%+', label: 'Accuracy' }
    ];

    const visualCards = [
        { icon: 'fa-stethoscope', text: 'Clinical Grade', className: 'card-1' },
        { icon: 'fa-microscope', text: 'Dermoscopic Analysis', className: 'card-2' },
        { icon: 'fa-user-md', text: 'Doctor Focused', className: 'card-3' }
    ];

    return (
        <section id="home" className="hero-section">
            <div className="hero-content">
                <div className="hero-text">
                    <div className="badge">
                        <i className="fas fa-hospital"></i>
                        <span>Professional Clinical Tool</span>
                    </div>
                    <h1 className="hero-title">
                        AI-Assisted Dermatology
                        <span className="gradient-text">Skin Cancer Detection System</span>
                    </h1>
                    <p className="hero-description">
                        A comprehensive clinical decision support tool for dermatologists and healthcare
                        professionals. Our DenseNet121 model provides AI-assisted analysis of skin lesions
                        including melanoma, basal cell carcinoma, and other skin cancers, supporting
                        evidence-based clinical diagnosis.
                    </p>
                    <div className="hero-buttons">
                        <a href="#clinical-assessment" className="btn-primary">
                            <i className="fas fa-notes-medical"></i>
                            Start Clinical Assessment
                        </a>
                        <a href="#about" className="btn-secondary">
                            <i className="fas fa-book-medical"></i>
                            Clinical Documentation
                        </a>
                    </div>
                    <div className="stats-row">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-item">
                                <div className="stat-number">{stat.number}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="hero-visual">
                    {visualCards.map((card, index) => (
                        <div key={index} className={`visual-card ${card.className}`}>
                            <i className={`fas ${card.icon}`}></i>
                            <span>{card.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;
