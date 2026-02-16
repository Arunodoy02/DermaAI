import React, { useState } from 'react';

const InfoSection = () => {
    const [selectedType, setSelectedType] = useState(0);

    const diseaseInfo = [
        {
            code: 'mel',
            type: 'Melanoma',
            severity: 'Very High Risk',
            severityColor: '#ff4444',
            icon: '☠️',
            description: 'The most dangerous form of skin cancer. Develops in melanocytes (pigment-producing cells). Can spread rapidly to other organs if not treated early.',
            characteristics: [
                'Asymmetric shape',
                'Irregular borders',
                'Multiple colors (brown, black, red, white)',
                'Diameter > 6mm',
                'Evolving size, shape, or color'
            ],
            riskFactors: [
                'Excessive UV exposure',
                'Fair skin',
                'Family history',
                'Many moles (>50)',
                'History of sunburns'
            ],
            treatment: 'Surgical excision, immunotherapy, targeted therapy. Early detection critical - 99% survival if caught early.',
            prevalence: '~1% of skin cancers, causes vast majority of deaths'
        },
        {
            code: 'bcc',
            type: 'Basal Cell Carcinoma',
            severity: 'High Risk',
            severityColor: '#ff6b6b',
            icon: '🔴',
            description: 'Most common type of skin cancer. Grows slowly and rarely spreads, but can be locally destructive. Arises from basal cells in the epidermis.',
            characteristics: [
                'Pearly or waxy bump',
                'Flat, flesh-colored or brown lesion',
                'May bleed easily',
                'Slow-growing',
                'Often on face, ears, neck'
            ],
            riskFactors: [
                'Chronic sun exposure',
                'Fair skin',
                'Age over 50',
                'Male gender',
                'History of BCC'
            ],
            treatment: 'Surgical excision, Mohs surgery, cryotherapy, radiation. 95%+ cure rate when treated.',
            prevalence: '~80% of all skin cancers, 3+ million cases annually in US'
        },
        {
            code: 'akiec',
            type: 'Actinic Keratoses',
            severity: 'Medium Risk',
            severityColor: '#ffaa00',
            icon: '⚠️',
            description: 'Precancerous skin lesions caused by sun damage. Rough, scaly patches that can develop into squamous cell carcinoma if untreated.',
            characteristics: [
                'Rough, dry, scaly patch',
                'Pink, red, or brown',
                'Usually < 1 inch',
                'Crusty or bleeding surface',
                'Common on face, scalp, hands'
            ],
            riskFactors: [
                'Years of sun exposure',
                'Fair complexion',
                'Outdoor occupation',
                'Weakened immune system',
                'Age over 40'
            ],
            treatment: 'Cryotherapy, topical medications (5-FU, imiquimod), photodynamic therapy. 5-10% risk of becoming cancer.',
            prevalence: '5-10% develop into SCC, affects 58 million Americans'
        },
        {
            code: 'bkl',
            type: 'Benign Keratosis',
            severity: 'Low Risk',
            severityColor: '#00ff88',
            icon: '✓',
            description: 'Non-cancerous skin growths including seborrheic keratoses. Harmless but may be removed for cosmetic reasons or if irritated.',
            characteristics: [
                'Waxy, stuck-on appearance',
                'Brown, black, or tan',
                'Slightly raised',
                'Can look like warts',
                'Multiple lesions common'
            ],
            riskFactors: [
                'Aging (very common over 50)',
                'Genetic predisposition',
                'Sun exposure (minor factor)',
                'Not precancerous',
                'Cosmetic concern'
            ],
            treatment: 'Usually none needed. Cryotherapy, curettage, or laser removal if desired. Completely benign.',
            prevalence: 'Very common, almost all elderly people have some'
        },
        {
            code: 'nv',
            type: 'Melanocytic Nevi (Moles)',
            severity: 'Low Risk',
            severityColor: '#4CAF50',
            icon: '●',
            description: 'Common benign moles made of melanocytes. Most are harmless, but monitoring for changes is important as some can develop into melanoma.',
            characteristics: [
                'Round or oval',
                'Uniform brown or tan color',
                'Flat or slightly raised',
                'Well-defined borders',
                'Usually < 6mm diameter'
            ],
            riskFactors: [
                'Normal in all people',
                'Genetics determine number',
                'New moles after age 30 (monitor)',
                'Changing moles (see doctor)',
                'Atypical moles (higher risk)'
            ],
            treatment: 'Monitor regularly using ABCDE rule. Remove if changing, bleeding, or concerning features.',
            prevalence: 'Average adult has 10-40 moles, extremely common'
        },
        {
            code: 'df',
            type: 'Dermatofibroma',
            severity: 'Very Low Risk',
            severityColor: '#00c2ff',
            icon: '○',
            description: 'Benign fibrous nodule in the skin. Often result from minor trauma like insect bites. Feels firm and may dimple when pinched.',
            characteristics: [
                'Firm, hard nodule',
                'Brown, red, or pink',
                'Usually < 1 cm',
                'Dimples when pinched',
                'Commonly on legs'
            ],
            riskFactors: [
                'Minor skin trauma',
                'Insect bites',
                'More common in women',
                'Can occur at any age',
                'Completely harmless'
            ],
            treatment: 'Usually no treatment needed. Surgical excision if bothersome. Cannot become cancerous.',
            prevalence: 'Common, exact prevalence unknown'
        },
        {
            code: 'vasc',
            type: 'Vascular Lesions',
            severity: 'Very Low Risk',
            severityColor: '#9C27B0',
            icon: '🩸',
            description: 'Abnormalities of blood vessels in the skin. Includes hemangiomas, cherry angiomas, and spider veins. Generally harmless.',
            characteristics: [
                'Red, purple, or bluish',
                'Can be raised or flat',
                'Blanches when pressed',
                'Various sizes',
                'Common on trunk, face'
            ],
            riskFactors: [
                'Age (cherry angiomas)',
                'Genetics',
                'Pregnancy',
                'Liver disease (spider angiomas)',
                'Usually benign'
            ],
            treatment: 'Usually cosmetic only. Laser therapy, sclerotherapy for spider veins. No cancer risk.',
            prevalence: 'Very common, especially cherry angiomas in adults over 30'
        }
    ];

    const selected = diseaseInfo[selectedType];

    return (
        <section id="about" className="info-section" style={{
            background: 'linear-gradient(180deg, #0f1729 0%, #1a1f3a 100%)',
            padding: '100px 20px',
            color: 'white'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '8px 20px',
                        background: 'rgba(0, 194, 255, 0.1)',
                        borderRadius: '50px',
                        border: '1px solid rgba(0, 194, 255, 0.3)',
                        marginBottom: '20px'
                    }}>
                        <span style={{
                            color: '#00c2ff',
                            fontSize: '14px',
                            fontWeight: '600',
                            letterSpacing: '1px'
                        }}>
                            📚 MEDICAL KNOWLEDGE BASE
                        </span>
                    </div>
                    <h2 style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontWeight: '800',
                        background: 'linear-gradient(135deg, #00c2ff 0%, #00ff88 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '15px'
                    }}>
                        7 Types of Skin Lesions
                    </h2>
                    <p style={{
                        fontSize: '1.1rem',
                        color: 'rgba(255,255,255,0.7)',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Comprehensive guide to HAM10000 dataset classifications
                    </p>
                </div>

                {/* Disease Type Selector */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '15px',
                    marginBottom: '50px'
                }}>
                    {diseaseInfo.map((disease, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedType(index)}
                            style={{
                                padding: '20px',
                                background: selectedType === index
                                    ? 'rgba(0, 194, 255, 0.2)'
                                    : 'rgba(255,255,255,0.05)',
                                border: selectedType === index
                                    ? '2px solid #00c2ff'
                                    : '2px solid rgba(255,255,255,0.1)',
                                borderRadius: '15px',
                                color: selectedType === index ? '#00c2ff' : 'white',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                fontSize: '1rem',
                                fontWeight: '600',
                                backdropFilter: 'blur(10px)'
                            }}
                            onMouseOver={(e) => {
                                if (selectedType !== index) {
                                    e.target.style.background = 'rgba(255,255,255,0.1)';
                                    e.target.style.transform = 'translateY(-3px)';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (selectedType !== index) {
                                    e.target.style.background = 'rgba(255,255,255,0.05)';
                                    e.target.style.transform = 'translateY(0)';
                                }
                            }}
                        >
                            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                                {disease.icon}
                            </div>
                            <div style={{ fontSize: '0.9rem' }}>
                                {disease.type}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Selected Disease Details */}
                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '30px',
                    padding: '50px',
                    border: '2px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    animation: 'fadeIn 0.5s ease'
                }}>
                    {/* Title and Severity */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '30px',
                        flexWrap: 'wrap',
                        gap: '20px'
                    }}>
                        <div>
                            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>
                                {selected.icon}
                            </div>
                            <h3 style={{
                                fontSize: '2.5rem',
                                fontWeight: '800',
                                marginBottom: '10px'
                            }}>
                                {selected.type}
                            </h3>
                            <p style={{
                                fontSize: '0.9rem',
                                color: 'rgba(255,255,255,0.6)'
                            }}>
                                Code: {selected.code.toUpperCase()}
                            </p>
                        </div>
                        <div style={{
                            padding: '15px 30px',
                            background: `${selected.severityColor}20`,
                            border: `2px solid ${selected.severityColor}`,
                            borderRadius: '50px',
                            color: selected.severityColor,
                            fontWeight: '700',
                            fontSize: '1.1rem'
                        }}>
                            {selected.severity}
                        </div>
                    </div>

                    {/* Description */}
                    <p style={{
                        fontSize: '1.2rem',
                        lineHeight: '1.8',
                        color: 'rgba(255,255,255,0.9)',
                        marginBottom: '40px',
                        padding: '20px',
                        background: 'rgba(0, 194, 255, 0.1)',
                        borderLeft: '4px solid #00c2ff',
                        borderRadius: '10px'
                    }}>
                        {selected.description}
                    </p>

                    {/* Info Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '30px',
                        marginBottom: '40px'
                    }}>
                        {/* Characteristics */}
                        <div>
                            <h4 style={{
                                fontSize: '1.3rem',
                                fontWeight: '700',
                                marginBottom: '20px',
                                color: '#00c2ff'
                            }}>
                                <i className="fas fa-search" style={{ marginRight: '10px' }}></i>
                                Key Characteristics
                            </h4>
                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: 0
                            }}>
                                {selected.characteristics.map((char, idx) => (
                                    <li key={idx} style={{
                                        padding: '12px 0',
                                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                                        color: 'rgba(255,255,255,0.8)',
                                        fontSize: '1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        <i className="fas fa-check-circle" style={{ color: '#00ff88', fontSize: '1rem' }}></i>
                                        {char}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Risk Factors */}
                        <div>
                            <h4 style={{
                                fontSize: '1.3rem',
                                fontWeight: '700',
                                marginBottom: '20px',
                                color: '#ffaa00'
                            }}>
                                <i className="fas fa-exclamation-triangle" style={{ marginRight: '10px' }}></i>
                                Risk Factors
                            </h4>
                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: 0
                            }}>
                                {selected.riskFactors.map((risk, idx) => (
                                    <li key={idx} style={{
                                        padding: '12px 0',
                                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                                        color: 'rgba(255,255,255,0.8)',
                                        fontSize: '1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        <i className="fas fa-dot-circle" style={{ color: '#ffaa00', fontSize: '0.8rem' }}></i>
                                        {risk}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Treatment and Prevalence */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        gap: '20px'
                    }}>
                        <div style={{
                            padding: '20px',
                            background: 'rgba(0, 255, 136, 0.1)',
                            borderLeft: '4px solid #00ff88',
                            borderRadius: '10px'
                        }}>
                            <h4 style={{
                                fontSize: '1.2rem',
                                fontWeight: '700',
                                marginBottom: '10px',
                                color: '#00ff88'
                            }}>
                                <i className="fas fa-medkit"></i> Treatment Options
                            </h4>
                            <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0, lineHeight: '1.6' }}>
                                {selected.treatment}
                            </p>
                        </div>

                        <div style={{
                            padding: '20px',
                            background: 'rgba(156, 39, 176, 0.1)',
                            borderLeft: '4px solid #9C27B0',
                            borderRadius: '10px'
                        }}>
                            <h4 style={{
                                fontSize: '1.2rem',
                                fontWeight: '700',
                                marginBottom: '10px',
                                color: '#BB86FC'
                            }}>
                                <i className="fas fa-chart-pie"></i> Prevalence
                            </h4>
                            <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0, lineHeight: '1.6' }}>
                                {selected.prevalence}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </section>
    );
};

export default InfoSection;
