import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { API_ENDPOINTS } from '../config';

const ClinicalAssessment = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [activeTab, setActiveTab] = useState('patient');

    // Patient & Clinical Information
    const [patientInfo, setPatientInfo] = useState({
        name: '', age: '', gender: '', medicalRecord: '', referringPhysician: ''
    });

    const [lesionInfo, setLesionInfo] = useState({
        location: '', duration: '', changes: '', symptoms: '', size: '', color: '', borders: '', evolution: ''
    });

    const [abcdeAssessment, setAbcdeAssessment] = useState({
        asymmetry: false, borderIrregular: false, colorVariation: false, diameterLarge: false, evolving: false
    });

    const [riskFactors, setRiskFactors] = useState({
        familyHistory: false, sunExposure: false, fairSkin: false, previousSkinCancer: false, immunosuppression: false, manyMoles: false
    });

    const [clinicalNotes, setClinicalnotes] = useState('');
    const [treatmentPlan, setTreatmentPlan] = useState('');

    const generatePDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Header
        doc.setFillColor(99, 102, 241);
        doc.rect(0, 0, pageWidth, 35, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont(undefined, 'bold');
        doc.text('DERMATOLOGY CLINICAL REPORT', pageWidth / 2, 15, { align: 'center' });
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text('AI-Powered Skin Cancer Detection', pageWidth / 2, 25, { align: 'center' });

        let yPos = 45;
        doc.setTextColor(0, 0, 0);

        const reportDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const reportId = `SCR-${Date.now().toString().slice(-8)}`;

        doc.setFontSize(9);
        doc.text(`Report ID: ${reportId}`, 20, yPos);
        doc.text(`Date: ${reportDate}`, pageWidth - 20, yPos, { align: 'right' });
        yPos += 10;

        // Patient Info
        doc.setFillColor(240, 245, 255);
        doc.rect(20, yPos, pageWidth - 40, 35, 'F');
        yPos += 8;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(99, 102, 241);
        doc.text('PATIENT INFORMATION', 25, yPos);
        yPos += 7;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(`Name: ${patientInfo.name || 'Not Provided'}`, 25, yPos);
        doc.text(`MRN: ${patientInfo.medicalRecord || 'N/A'}`, 120, yPos);
        yPos += 6;
        doc.text(`Age: ${patientInfo.age || 'N/A'} years`, 25, yPos);
        doc.text(`Gender: ${patientInfo.gender || 'N/A'}`, 80, yPos);

        // AI Analysis
        yPos += 15;
        doc.setFillColor(255, 245, 240);
        doc.rect(20, yPos, pageWidth - 40, 30, 'F');
        yPos += 8;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(236, 72, 153);
        doc.text('AI-ASSISTED DIAGNOSIS', 25, yPos);
        yPos += 8;
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(`Classification: ${results.prediction}`, 25, yPos);
        yPos += 7;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        const severity = results.severity === 'high' ? 'HIGH RISK' : results.severity === 'medium' ? 'MODERATE RISK' : 'LOW RISK';
        doc.text(`Risk Level: ${severity}`, 25, yPos);

        // Lesion Characteristics
        yPos += 12;
        doc.setFillColor(245, 255, 245);
        doc.rect(20, yPos, pageWidth - 40, 40, 'F');
        yPos += 8;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(16, 185, 129);
        doc.text('LESION CHARACTERISTICS', 25, yPos);
        yPos += 7;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(`Location: ${lesionInfo.location || 'Not specified'}`, 25, yPos);
        doc.text(`Duration: ${lesionInfo.duration || 'Unknown'}`, 100, yPos);
        yPos += 6;
        doc.text(`Size: ${lesionInfo.size || 'Not measured'}`, 25, yPos);
        doc.text(`Color: ${lesionInfo.color || 'Not noted'}`, 100, yPos);

        // Clinical Notes
        if (clinicalNotes) {
            yPos += 12;
            doc.setFillColor(250, 250, 255);
            doc.rect(20, yPos, pageWidth - 40, 25, 'F');
            yPos += 8;
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(99, 102, 241);
            doc.text('CLINICAL NOTES', 25, yPos);
            yPos += 7;
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 0);
            const noteLines = doc.splitTextToSize(clinicalNotes, pageWidth - 50);
            doc.text(noteLines, 25, yPos);
        }

        // Treatment Plan
        yPos = pageHeight - 50;
        doc.setFillColor(245, 250, 255);
        doc.rect(20, yPos, pageWidth - 40, 25, 'F');
        yPos += 8;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(99, 102, 241);
        doc.text('RECOMMENDED ACTION', 25, yPos);
        yPos += 7;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        const recommendation = treatmentPlan || results.recommended_action || 'Refer to dermatologist';
        const recLines = doc.splitTextToSize(recommendation, pageWidth - 50);
        doc.text(recLines, 25, yPos);

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('Skin Cancer Detection System - Clinical AI Tool', pageWidth / 2, pageHeight - 8, { align: 'center' });

        const fileName = `SkinCancer_Report_${patientInfo.name.replace(/\s+/g, '_') || 'Patient'}_${Date.now()}.pdf`;
        doc.save(fileName);
    };

    const handleFileUpload = async (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => setPreviewUrl(e.target.result);
        reader.readAsDataURL(file);
        setIsLoading(true);
        setResults(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(API_ENDPOINTS.PREDICT, { method: 'POST', body: formData });
            const data = await response.json();
            await new Promise(resolve => setTimeout(resolve, 1500));
            setResults(data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + error.message);
            setIsLoading(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileUpload(file);
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high': case 'danger': return 'linear-gradient(135deg, #ec4899 0%, #ef4444 100%)';
            case 'warning': case 'medium': return 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)';
            default: return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        }
    };

    const resetAssessment = () => {
        setPreviewUrl(null);
        setResults(null);
        setIsLoading(false);
        setPatientInfo({ name: '', age: '', gender: '', medicalRecord: '', referringPhysician: '' });
        setLesionInfo({ location: '', duration: '', changes: '', symptoms: '', size: '', color: '', borders: '', evolution: '' });
        setAbcdeAssessment({ asymmetry: false, borderIrregular: false, colorVariation: false, diameterLarge: false, evolving: false });
        setRiskFactors({ familyHistory: false, sunExposure: false, fairSkin: false, previousSkinCancer: false, immunosuppression: false, manyMoles: false });
        setClinicalnotes('');
        setTreatmentPlan('');
        setActiveTab('patient');
    };

    return (
        <section id="clinical-assessment" style={{
            background: 'linear-gradient(135deg, #0A0E27 0%, #1A1F3A 50%, #2A2F4A 100%)',
            padding: '100px 20px',
            minHeight: '100vh',
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

            <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                {/* Stunning Header */}
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '12px 30px',
                        background: 'rgba(0, 102, 255, 0.15)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '50px',
                        border: '2px solid rgba(0, 102, 255, 0.3)',
                        marginBottom: '25px',
                        boxShadow: '0 8px 32px rgba(0, 102, 255, 0.2)',
                        animation: 'slideDown 0.6s ease-out'
                    }}>
                        <span style={{
                            color: '#00C9FF',
                            fontSize: '16px',
                            fontWeight: '700',
                            letterSpacing: '2px'
                        }}>
                            🩺 AI-POWERED CLINICAL ASSESSMENT
                        </span>
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(3rem, 6vw, 5rem)',
                        fontWeight: '900',
                        background: 'linear-gradient(135deg, #0066FF 0%, #00C9FF 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '20px',
                        letterSpacing: '-2px',
                        animation: 'fadeInUp 0.8s ease-out',
                        fontFamily: "'Space Grotesk', sans-serif"
                    }}>
                        Skin Cancer Detection
                    </h1>
                    <p style={{
                        fontSize: '1.3rem',
                        color: '#E8EDF4',
                        maxWidth: '700px',
                        margin: '0 auto',
                        animation: 'fadeInUp 1s ease-out'
                    }}>
                        Professional Dermatological Analysis with Advanced AI Technology
                    </p>
                </div>

                {/* Tabbed Navigation */}
                {!results && (
                    <div style={{
                        display: 'flex',
                        gap: '15px',
                        justifyContent: 'center',
                        marginBottom: '40px',
                        flexWrap: 'wrap'
                    }}>
                        {[
                            { id: 'patient', icon: 'fa-user-md', label: 'Patient Info' },
                            { id: 'lesion', icon: 'fa-microscope', label: 'Lesion Details' },
                            { id: 'abcde', icon: 'fa-check-circle', label: 'ABCDE Screen' },
                            { id: 'risk', icon: 'fa-exclamation-triangle', label: 'Risk Factors' },
                            { id: 'upload', icon: 'fa-camera', label: 'Image Analysis' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    padding: '15px 30px',
                                    background: activeTab === tab.id
                                        ? 'linear-gradient(135deg, #0066FF 0%, #00C9FF 100%)'
                                        : 'rgba(255, 255, 255, 0.05)',
                                    backdropFilter: 'blur(10px)',
                                    border: activeTab === tab.id ? '2px solid rgba(0, 201, 255, 0.5)' : '2px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '15px',
                                    color: activeTab === tab.id ? 'white' : '#E8EDF4',
                                    fontSize: '1rem',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: activeTab === tab.id ? '0 8px 32px rgba(0, 102, 255, 0.4)' : 'none',
                                    transform: activeTab === tab.id ? 'translateY(-2px)' : 'none'
                                }}
                            >
                                <i className={`fas ${tab.icon}`} style={{ marginRight: '8px' }}></i>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Dynamic Content Panels */}
                {!results && activeTab === 'patient' && (
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '30px',
                        padding: '50px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        animation: 'scaleIn 0.5s ease-out'
                    }}>
                        <h3 style={{
                            fontSize: '2rem',
                            fontWeight: '800',
                            background: 'linear-gradient(135deg, #0066FF 0%, #00C9FF 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px'
                        }}>
                            <i className="fas fa-user-md"></i>
                            Patient Information
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
                            {[
                                { label: 'Patient Name', key: 'name', type: 'text', placeholder: 'Full name', required: true },
                                { label: 'Age', key: 'age', type: 'number', placeholder: 'Years' },
                                { label: 'Gender', key: 'gender', type: 'select', options: ['', 'Male', 'Female', 'Other'] },
                                { label: 'Medical Record Number', key: 'medicalRecord', type: 'text', placeholder: 'MRN' },
                                { label: 'Referring Physician', key: 'referringPhysician', type: 'text', placeholder: 'Dr. Name' }
                            ].map((field, idx) => (
                                <div key={idx} style={{ animation: `slideInLeft ${0.3 + idx * 0.1}s ease-out` }}>
                                    <label style={{
                                        display: 'block',
                                        color: '#F7F9FC',
                                        marginBottom: '8px',
                                        fontSize: '0.95rem',
                                        fontWeight: '700'
                                    }}>
                                        {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
                                    </label>
                                    {field.type === 'select' ? (
                                        <select
                                            value={patientInfo[field.key]}
                                            onChange={(e) => setPatientInfo({ ...patientInfo, [field.key]: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '15px',
                                                borderRadius: '12px',
                                                border: '2px solid rgba(255, 255, 255, 0.1)',
                                                fontSize: '1rem',
                                                transition: 'all 0.3s',
                                                background: 'rgba(42, 47, 74, 0.5)'
                                            }}
                                        >
                                            {field.options.map(opt => (
                                                <option key={opt} value={opt}>{opt || 'Select'}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type={field.type}
                                            value={patientInfo[field.key]}
                                            onChange={(e) => setPatientInfo({ ...patientInfo, [field.key]: e.target.value })}
                                            placeholder={field.placeholder}
                                            style={{
                                                width: '100%',
                                                padding: '15px',
                                                borderRadius: '12px',
                                                border: '2px solid rgba(255, 255, 255, 0.1)',
                                                fontSize: '1rem',
                                                transition: 'all 0.3s',
                                                background: 'rgba(42, 47, 74, 0.5)'
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!results && activeTab === 'lesion' && (
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '30px',
                        padding: '50px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                        animation: 'scaleIn 0.5s ease-out'
                    }}>
                        <h3 style={{
                            fontSize: '2rem',
                            fontWeight: '800',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px'
                        }}>
                            <i className="fas fa-microscope"></i>
                            Lesion Characteristics
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
                            {[
                                { label: 'Anatomical Location', key: 'location', placeholder: 'e.g., Left forearm' },
                                { label: 'Duration', key: 'duration', placeholder: 'e.g., 6 months' },
                                { label: 'Size (mm)', key: 'size', placeholder: 'Diameter' },
                                { label: 'Color Description', key: 'color', placeholder: 'e.g., Brown, black' },
                                { label: 'Border Characteristics', key: 'borders', placeholder: 'Regular/Irregular' },
                                { label: 'Associated Symptoms', key: 'symptoms', placeholder: 'Itching, bleeding, etc.' },
                                { label: 'Recent Changes', key: 'evolution', placeholder: 'Any growth or color changes' }
                            ].map((field, idx) => (
                                <div key={idx} style={{ animation: `slideInRight ${0.3 + idx * 0.1}s ease-out` }}>
                                    <label style={{
                                        display: 'block',
                                        color: '#F7F9FC',
                                        marginBottom: '8px',
                                        fontSize: '0.95rem',
                                        fontWeight: '700'
                                    }}>
                                        {field.label}
                                    </label>
                                    <input
                                        type="text"
                                        value={lesionInfo[field.key]}
                                        onChange={(e) => setLesionInfo({ ...lesionInfo, [field.key]: e.target.value })}
                                        placeholder={field.placeholder}
                                        style={{
                                            width: '100%',
                                            padding: '15px',
                                            borderRadius: '12px',
                                            border: '2px solid rgba(255, 255, 255, 0.1)',
                                            fontSize: '1rem',
                                            transition: 'all 0.3s'
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!results && activeTab === 'abcde' && (
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '30px',
                        padding: '50px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                        animation: 'scaleIn 0.5s ease-out'
                    }}>
                        <h3 style={{
                            fontSize: '2rem',
                            fontWeight: '800',
                            background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px'
                        }}>
                            <i className="fas fa-check-circle"></i>
                            ABCDE Melanoma Screening
                        </h3>

                        <div style={{ display: 'grid', gap: '20px' }}>
                            {[
                                { key: 'asymmetry', letter: 'A', label: 'Asymmetry', desc: 'One half unlike the other', color: '#ef4444' },
                                { key: 'borderIrregular', letter: 'B', label: 'Border Irregularity', desc: 'Irregular, scalloped borders', color: '#f97316' },
                                { key: 'colorVariation', letter: 'C', label: 'Color Variation', desc: 'Multiple colors present', color: '#f59e0b' },
                                { key: 'diameterLarge', letter: 'D', label: 'Diameter > 6mm', desc: 'Larger than pencil eraser', color: '#eab308' },
                                { key: 'evolving', letter: 'E', label: 'Evolving', desc: 'Changes in size, shape, color', color: '#84cc16' }
                            ].map((item, idx) => (
                                <label key={item.key} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '20px',
                                    padding: '25px',
                                    background: abcdeAssessment[item.key]
                                        ? `linear-gradient(135deg, ${item.color}20, ${item.color}10)`
                                        : 'rgba(249, 250, 251, 0.8)',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    border: `3px solid ${abcdeAssessment[item.key] ? item.color : '#e5e7eb'}`,
                                    transition: 'all 0.4s ease',
                                    transform: abcdeAssessment[item.key] ? 'scale(1.02)' : 'scale(1)',
                                    boxShadow: abcdeAssessment[item.key] ? `0 10px 30px ${item.color}40` : 'none',
                                    animation: `slideInUp ${0.3 + idx * 0.1}s ease-out`
                                }}>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '15px',
                                        background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '2rem',
                                        fontWeight: '900',
                                        color: 'white',
                                        boxShadow: `0 8px 20px ${item.color}60`
                                    }}>
                                        {item.letter}
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={abcdeAssessment[item.key]}
                                        onChange={(e) => setAbcdeAssessment({ ...abcdeAssessment, [item.key]: e.target.checked })}
                                        style={{
                                            width: '28px',
                                            height: '28px',
                                            cursor: 'pointer',
                                            accentColor: item.color
                                        }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '800', fontSize: '1.3rem', color: '#F7F9FC', marginBottom: '5px' }}>
                                            {item.label}
                                        </div>
                                        <div style={{ fontSize: '1rem', color: '#D4DBE8' }}>
                                            {item.desc}
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {!results && activeTab === 'risk' && (
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '30px',
                        padding: '50px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                        animation: 'scaleIn 0.5s ease-out'
                    }}>
                        <h3 style={{
                            fontSize: '2rem',
                            fontWeight: '800',
                            background: 'linear-gradient(135deg, #ec4899 0%, #ef4444 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px'
                        }}>
                            <i className="fas fa-exclamation-triangle"></i>
                            Risk Factor Assessment
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                            {[
                                { key: 'familyHistory', label: 'Family history of skin cancer', icon: 'fa-users' },
                                { key: 'sunExposure', label: 'Excessive sun exposure / Sunburns', icon: 'fa-sun' },
                                { key: 'fairSkin', label: 'Fair skin, light hair/eyes', icon: 'fa-user' },
                                { key: 'previousSkinCancer', label: 'Previous skin cancer diagnosis', icon: 'fa-file-medical' },
                                { key: 'immunosuppression', label: 'Immunosuppression', icon: 'fa-shield-virus' },
                                { key: 'manyMoles', label: 'Many moles (>50) or atypical nevi', icon: 'fa-dot-circle' }
                            ].map((item, idx) => (
                                <label key={item.key} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    padding: '20px',
                                    background: riskFactors[item.key]
                                        ? 'linear-gradient(135deg, #fecaca, #fca5a5)'
                                        : 'rgba(249, 250, 251, 0.8)',
                                    borderRadius: '15px',
                                    cursor: 'pointer',
                                    border: `2px solid ${riskFactors[item.key] ? '#ef4444' : '#e5e7eb'}`,
                                    transition: 'all 0.3s ease',
                                    transform: riskFactors[item.key] ? 'translateX(5px)' : 'none',
                                    boxShadow: riskFactors[item.key] ? '0 8px 25px rgba(239, 68, 68, 0.3)' : 'none',
                                    animation: `fadeIn ${0.3 + idx * 0.1}s ease-out`
                                }}>
                                    <i className={`fas ${item.icon}`} style={{
                                        fontSize: '1.5rem',
                                        color: riskFactors[item.key] ? '#ef4444' : '#9ca3af',
                                        transition: 'color 0.3s'
                                    }}></i>
                                    <input
                                        type="checkbox"
                                        checked={riskFactors[item.key]}
                                        onChange={(e) => setRiskFactors({ ...riskFactors, [item.key]: e.target.checked })}
                                        style={{ width: '24px', height: '24px', cursor: 'pointer', accentColor: '#ef4444' }}
                                    />
                                    <span style={{ flex: 1, fontWeight: '700', fontSize: '1.05rem', color: '#F7F9FC' }}>
                                        {item.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Image Upload Section */}
                {!results && activeTab === 'upload' && (
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '30px',
                        padding: '50px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                        animation: 'scaleIn 0.5s ease-out'
                    }}>
                        <h3 style={{
                            fontSize: '2rem',
                            fontWeight: '800',
                            background: 'linear-gradient(135deg, #0066FF 0%, #00C9FF 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '30px',
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '15px'
                        }}>
                            <i className="fas fa-camera"></i>
                            Dermoscopic Image Analysis
                        </h3>

                        {!previewUrl && !isLoading && (
                            <div
                                onDrop={handleDrop}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                style={{
                                    background: isDragging
                                        ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))'
                                        : 'linear-gradient(135deg, rgba(249, 250, 251, 0.8), rgba(243, 244, 246, 0.8))',
                                    border: isDragging ? '4px dashed #6366f1' : '4px dashed #d1d5db',
                                    borderRadius: '25px',
                                    padding: '80px 40px',
                                    textAlign: 'center',
                                    transition: 'all 0.4s ease',
                                    cursor: 'pointer',
                                    transform: isDragging ? 'scale(1.02)' : 'scale(1)'
                                }}
                            >
                                <label style={{ cursor: 'pointer', display: 'block' }}>
                                    <div style={{
                                        width: '150px',
                                        height: '150px',
                                        margin: '0 auto 30px',
                                        background: 'linear-gradient(135deg, #0066FF 0%, #00C9FF 100%)',
                                        borderRadius: '30px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 20px 50px rgba(99, 102, 241, 0.4)',
                                        transform: isDragging ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
                                        transition: 'all 0.4s ease',
                                        animation: 'bounce 2s ease-in-out infinite'
                                    }}>
                                        <i className="fas fa-cloud-upload-alt" style={{
                                            fontSize: '60px',
                                            color: 'white'
                                        }}></i>
                                    </div>

                                    <h3 style={{
                                        fontSize: '2.2rem',
                                        fontWeight: '800',
                                        background: 'linear-gradient(135deg, #0066FF 0%, #00C9FF 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        marginBottom: '15px'
                                    }}>
                                        {isDragging ? '📤 Drop it here!' : '📸 Upload Lesion Image'}
                                    </h3>

                                    <p style={{
                                        fontSize: '1.2rem',
                                        color: '#D4DBE8',
                                        marginBottom: '30px'
                                    }}>
                                        Drag & drop or click to browse from your device
                                    </p>

                                    <div style={{
                                        display: 'inline-block',
                                        padding: '18px 50px',
                                        background: 'linear-gradient(135deg, #0066FF 0%, #00C9FF 100%)',
                                        borderRadius: '50px',
                                        color: 'white',
                                        fontSize: '1.2rem',
                                        fontWeight: '700',
                                        boxShadow: '0 15px 40px rgba(99, 102, 241, 0.4)',
                                        marginBottom: '30px',
                                        transition: 'all 0.3s'
                                    }}>
                                        <i className="fas fa-file-image" style={{ marginRight: '12px' }}></i>
                                        Choose File
                                    </div>

                                    <div style={{
                                        fontSize: '1rem',
                                        color: '#9ca3af',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px'
                                    }}>
                                        <i className="fas fa-info-circle" style={{ color: '#6366f1' }}></i>
                                        Supports: JPG, PNG, JPEG • Max 10MB • High-resolution recommended
                                    </div>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(e.target.files[0])}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </div>
                        )}

                        {isLoading && (
                            <div style={{
                                textAlign: 'center',
                                padding: '60px',
                                animation: 'fadeIn 0.5s ease-out'
                            }}>
                                {previewUrl && (
                                    <div style={{
                                        width: '300px',
                                        height: '300px',
                                        margin: '0 auto 40px',
                                        borderRadius: '25px',
                                        overflow: 'hidden',
                                        boxShadow: '0 20px 60px rgba(99, 102, 241, 0.5)',
                                        border: '5px solid #6366f1',
                                        animation: 'pulse 2s ease-in-out infinite'
                                    }}>
                                        <img src={previewUrl} alt="Preview" style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }} />
                                    </div>
                                )}

                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    border: '8px solid rgba(99, 102, 241, 0.2)',
                                    borderTop: '8px solid #6366f1',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite',
                                    margin: '0 auto 30px'
                                }} />

                                <h3 style={{
                                    fontSize: '2rem',
                                    background: 'linear-gradient(135deg, #0066FF 0%, #00C9FF 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    marginBottom: '15px',
                                    fontWeight: '800'
                                }}>
                                    🔬 Analyzing Image...
                                </h3>

                                <p style={{
                                    color: '#D4DBE8',
                                    fontSize: '1.2rem'
                                }}>
                                    AI model is processing dermoscopic features
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Results Section */}
                {results && (
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '30px',
                        padding: '50px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                        animation: 'scaleIn 0.6s ease-out'
                    }}>
                        {/* Header Actions */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '40px',
                            paddingBottom: '25px',
                            borderBottom: '3px solid #e5e7eb',
                            flexWrap: 'wrap',
                            gap: '20px'
                        }}>
                            <div>
                                <span style={{
                                    display: 'inline-block',
                                    padding: '10px 25px',
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    borderRadius: '50px',
                                    color: 'white',
                                    fontSize: '14px',
                                    fontWeight: '800',
                                    marginBottom: '15px',
                                    boxShadow: '0 5px 20px rgba(16, 185, 129, 0.3)'
                                }}>
                                    ✓ ANALYSIS COMPLETE
                                </span>
                                <h3 style={{
                                    fontSize: '2.5rem',
                                    fontWeight: '900',
                                    background: 'linear-gradient(135deg, #0066FF 0%, #00C9FF 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    AI-Assisted Diagnosis
                                </h3>
                            </div>

                            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                <button
                                    onClick={generatePDF}
                                    style={{
                                        padding: '18px 35px',
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        border: 'none',
                                        borderRadius: '15px',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontSize: '1.1rem',
                                        fontWeight: '800',
                                        boxShadow: '0 8px 30px rgba(16, 185, 129, 0.4)',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseOver={(e) => e.target.style.transform = 'translateY(-3px)'}
                                    onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                                >
                                    <i className="fas fa-file-pdf" style={{ marginRight: '10px' }}></i>
                                    Generate Report
                                </button>

                                <button
                                    onClick={resetAssessment}
                                    style={{
                                        padding: '18px 30px',
                                        background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                                        border: 'none',
                                        borderRadius: '15px',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontSize: '1.1rem',
                                        fontWeight: '700',
                                        boxShadow: '0 8px 30px rgba(107, 114, 128, 0.3)',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <i className="fas fa-redo" style={{ marginRight: '10px' }}></i>
                                    New Assessment
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
                            {/* Image */}
                            {previewUrl && (
                                <div style={{
                                    borderRadius: '25px',
                                    overflow: 'hidden',
                                    boxShadow: '0 20px 60px rgba(99, 102, 241, 0.3)',
                                    border: '5px solid #6366f1'
                                }}>
                                    <img src={previewUrl} alt="Analyzed" style={{
                                        width: '100%',
                                        display: 'block'
                                    }} />
                                </div>
                            )}

                            {/* Results */}
                            <div>
                                <div style={{
                                    textAlign: 'center',
                                    padding: '40px',
                                    background: getSeverityColor(results.severity),
                                    borderRadius: '25px',
                                    marginBottom: '30px',
                                    boxShadow: '0 15px 50px rgba(0,0,0,0.2)',
                                    color: 'white'
                                }}>
                                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>
                                        🔬
                                    </div>

                                    <p style={{
                                        fontSize: '1.1rem',
                                        marginBottom: '15px',
                                        fontWeight: '600',
                                        opacity: 0.9
                                    }}>
                                        Detected Classification
                                    </p>

                                    <h2 style={{
                                        fontSize: '3rem',
                                        fontWeight: '900',
                                        margin: '0 0 20px 0',
                                        textShadow: '0 4px 15px rgba(0,0,0,0.2)'
                                    }}>
                                        {results.prediction}
                                    </h2>

                                    <div style={{
                                        padding: '12px 30px',
                                        background: 'rgba(255, 255, 255, 0.25)',
                                        borderRadius: '50px',
                                        display: 'inline-block',
                                        backdropFilter: 'blur(10px)'
                                    }}>
                                        <span style={{
                                            fontWeight: '800',
                                            fontSize: '1.1rem'
                                        }}>
                                            {results.severity === 'high' ? '⚠️ HIGH RISK' :
                                                results.severity === 'medium' ? '⚠️ MODERATE RISK' : '✅ LOW RISK'}
                                        </span>
                                    </div>
                                </div>

                                {results.description && (
                                    <div style={{
                                        padding: '25px',
                                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
                                        borderRadius: '20px',
                                        marginBottom: '25px',
                                        borderLeft: '5px solid #6366f1'
                                    }}>
                                        <strong style={{ color: '#6366f1', display: 'block', marginBottom: '10px', fontSize: '1.1rem' }}>
                                            📋 Clinical Description:
                                        </strong>
                                        <p style={{ color: '#F7F9FC', margin: 0, lineHeight: '1.7', fontSize: '1.05rem' }}>
                                            {results.description}
                                        </p>
                                    </div>
                                )}

                                {results.recommended_action && (
                                    <div style={{
                                        padding: '25px',
                                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(249, 115, 22, 0.1))',
                                        borderRadius: '20px',
                                        borderLeft: '5px solid #f59e0b'
                                    }}>
                                        <strong style={{ color: '#f59e0b', display: 'block', marginBottom: '10px', fontSize: '1.1rem' }}>
                                            <i className="fas fa-notes-medical" style={{ marginRight: '10px' }}></i>
                                            Recommended Action:
                                        </strong>
                                        <p style={{ color: '#F7F9FC', margin: 0, lineHeight: '1.7', fontSize: '1.05rem' }}>
                                            {results.recommended_action}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Clinical Notes Section */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginTop: '40px' }}>
                            <div>
                                <h3 style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '800',
                                    background: 'linear-gradient(135deg, #0066FF 0%, #00C9FF 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    marginBottom: '15px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    <i className="fas fa-notes-medical"></i>
                                    Clinical Notes
                                </h3>
                                <textarea
                                    value={clinicalNotes}
                                    onChange={(e) => setClinicalnotes(e.target.value)}
                                    placeholder="Enter additional clinical observations..."
                                    style={{
                                        width: '100%',
                                        minHeight: '150px',
                                        padding: '20px',
                                        borderRadius: '15px',
                                        border: '2px solid rgba(255, 255, 255, 0.1)',
                                        fontSize: '1rem',
                                        fontFamily: 'inherit',
                                        resize: 'vertical',
                                        transition: 'all 0.3s'
                                    }}
                                />
                            </div>

                            <div>
                                <h3 style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '800',
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    marginBottom: '15px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    <i className="fas fa-clipboard-list"></i>
                                    Treatment Plan
                                </h3>
                                <textarea
                                    value={treatmentPlan}
                                    onChange={(e) => setTreatmentPlan(e.target.value)}
                                    placeholder="Document treatment recommendations..."
                                    style={{
                                        width: '100%',
                                        minHeight: '150px',
                                        padding: '20px',
                                        borderRadius: '15px',
                                        border: '2px solid rgba(255, 255, 255, 0.1)',
                                        fontSize: '1rem',
                                        fontFamily: 'inherit',
                                        resize: 'vertical',
                                        transition: 'all 0.3s'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Medical Disclaimer */}
                <div style={{
                    marginTop: '40px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '3px solid #f59e0b',
                    borderRadius: '20px',
                    padding: '30px',
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'start',
                    boxShadow: '0 15px 40px rgba(245, 158, 11, 0.2)'
                }}>
                    <i className="fas fa-exclamation-triangle" style={{
                        color: '#f59e0b',
                        fontSize: '2.5rem',
                        marginTop: '5px'
                    }}></i>
                    <div>
                        <strong style={{ color: '#f59e0b', fontSize: '1.3rem', display: 'block', marginBottom: '12px', fontWeight: '800' }}>
                            ⚕️ Clinical Decision Support Tool
                        </strong>
                        <p style={{
                            color: '#F7F9FC',
                            fontSize: '1.05rem',
                            lineHeight: '1.8',
                            margin: 0
                        }}>
                            This AI-assisted system is a clinical decision support tool. It should not replace clinical judgment,
                            histopathological examination, or comprehensive patient evaluation. All suspicious lesions require
                            biopsy for definitive diagnosis. Final treatment decisions remain the physician's responsibility.
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.05); }
                }

                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }

                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-40px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(40px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                @keyframes slideInUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                input:focus, select:focus, textarea:focus {
                    outline: none !important;
                    border-color: #6366f1 !important;
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15) !important;
                }

                button:hover {
                    transform: translateY(-3px) !important;
                    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3) !important;
                }

                @media (max-width: 768px) {
                    h1 { font-size: 2.5rem !important; }
                    h3 { font-size: 1.5rem !important; }
                }
            `}</style>
        </section>
    );
};

export default ClinicalAssessment;
