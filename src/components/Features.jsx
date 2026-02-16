import React from 'react';

const Features = () => {
    const features = [
        {
            icon: 'fa-microscope',
            title: 'Dermoscopic Analysis',
            description: 'Advanced AI analysis of dermoscopic images for multiple skin cancer types including melanoma, BCC, and SCC.'
        },
        {
            icon: 'fa-stethoscope',
            title: 'ABCDE Assessment',
            description: 'Integrated melanoma screening using the clinically-validated ABCDE rule framework.'
        },
        {
            icon: 'fa-user-md',
            title: 'Clinical Documentation',
            description: 'Comprehensive patient records, lesion characteristics, and treatment planning tools for healthcare professionals.'
        },
        {
            icon: 'fa-file-medical-alt',
            title: 'Professional Reports',
            description: 'Generate detailed PDF clinical reports with AI analysis, ABCDE assessment, and treatment recommendations.'
        },
        {
            icon: 'fa-chart-line',
            title: 'Risk Stratification',
            description: 'Evaluate patient risk factors including family history, sun exposure, and previous skin cancer.'
        },
        {
            icon: 'fa-shield-alt',
            title: 'HIPAA Compliant',
            description: 'Secure image processing with patient data protection and medical privacy standards.'
        }
    ];

    return (
        <section id="features" className="features-section">
            <div className="section-header">
                <h2 className="section-title">Clinical Features</h2>
                <p className="section-subtitle">Comprehensive tools for skin cancer detection and management</p>
            </div>
            <div className="features-grid">
                {features.map((feature, index) => (
                    <div key={index} className="feature-card">
                        <div className="feature-icon">
                            <i className={`fas ${feature.icon}`}></i>
                        </div>
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Features;
