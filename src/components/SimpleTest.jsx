import React, { useState } from 'react';
import jsPDF from 'jspdf';

const SimpleTest = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    // Patient Information
    const [patientName, setPatientName] = useState('');
    const [patientAge, setPatientAge] = useState('');
    const [patientGender, setPatientGender] = useState('');
    const [showPatientForm, setShowPatientForm] = useState(false);

    const generatePDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Header with gradient effect (simulated with rectangles)
        doc.setFillColor(0, 102, 255);
        doc.rect(0, 0, pageWidth, 40, 'F');

        // Title
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont(undefined, 'bold');
        doc.text('DERMAI MEDICAL REPORT', pageWidth / 2, 20, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text('AI-Powered Skin Lesion Analysis', pageWidth / 2, 30, { align: 'center' });

        // Report Info
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        let yPos = 50;

        const reportId = `DRM-${Date.now().toString().slice(-8)}`;
        const reportDate = new Date().toLocaleString();

        doc.setFont(undefined, 'normal');
        doc.text(`Report ID: ${reportId}`, 20, yPos);
        doc.text(`Date: ${reportDate}`, pageWidth - 20, yPos, { align: 'right' });

        // Horizontal line
        yPos += 5;
        doc.setDrawColor(200, 200, 200);
        doc.line(20, yPos, pageWidth - 20, yPos);

        // Patient Information Section
        yPos += 10;
        doc.setFillColor(240, 240, 255);
        doc.rect(20, yPos, pageWidth - 40, 35, 'F');

        yPos += 8;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 102, 255);
        doc.text('PATIENT INFORMATION', 25, yPos);

        yPos += 8;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(`Name: ${patientName || 'Not Provided'}`, 25, yPos);

        yPos += 6;
        doc.text(`Age: ${patientAge || 'N/A'} years`, 25, yPos);
        doc.text(`Gender: ${patientGender || 'N/A'}`, 100, yPos);

        // Analysis Results Section
        yPos += 15;
        doc.setFillColor(255, 240, 240);
        doc.rect(20, yPos, pageWidth - 40, 45, 'F');

        yPos += 8;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(255, 0, 0);
        doc.text('ANALYSIS RESULTS', 25, yPos);

        yPos += 8;
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(`Primary Diagnosis: ${results.prediction}`, 25, yPos);

        yPos += 7;
        doc.setFontSize(10);
        doc.text(`Confidence Score: ${results.confidence.toFixed(2)}%`, 25, yPos);

        yPos += 7;
        const severityColor = results.severity === 'high' || results.severity === 'danger'
            ? 'HIGH RISK'
            : results.severity === 'warning' || results.severity === 'medium'
                ? 'MEDIUM RISK'
                : 'LOW RISK';
        doc.text(`Risk Level: ${severityColor}`, 25, yPos);

        yPos += 7;
        doc.setFont(undefined, 'italic');
        doc.setFontSize(9);
        const description = results.description || 'See detailed analysis below';
        const splitDescription = doc.splitTextToSize(description, pageWidth - 50);
        doc.text(splitDescription, 25, yPos);

        // Detailed Confidence Scores
        yPos += splitDescription.length * 4 + 10;
        doc.setFillColor(240, 255, 240);
        doc.rect(20, yPos, pageWidth - 40, 60, 'F');

        yPos += 8;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 153, 51);
        doc.text('DETAILED CONFIDENCE ANALYSIS', 25, yPos);

        yPos += 10;
        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Classification', 25, yPos);
        doc.text('Confidence', pageWidth - 60, yPos);

        yPos += 2;
        doc.setDrawColor(200, 200, 200);
        doc.line(25, yPos, pageWidth - 25, yPos);

        yPos += 5;
        doc.setFont(undefined, 'normal');

        const sortedPredictions = Object.entries(results.all_predictions || {})
            .sort((a, b) => b[1] - a[1])
            .slice(0, 7);

        sortedPredictions.forEach(([type, confidence], index) => {
            doc.text(`${index + 1}. ${type}`, 25, yPos);
            doc.text(`${confidence.toFixed(2)}%`, pageWidth - 60, yPos);

            // Draw mini bar
            const barWidth = (confidence / 100) * 50;
            doc.setFillColor(0, 194, 255);
            doc.rect(pageWidth - 55, yPos - 3, barWidth, 4, 'F');

            yPos += 6;
        });

        // Recommendations
        yPos += 10;
        doc.setFillColor(255, 255, 240);
        doc.rect(20, yPos, pageWidth - 40, 30, 'F');

        yPos += 8;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(255, 153, 0);
        doc.text('RECOMMENDATIONS', 25, yPos);

        yPos += 8;
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);

        const recommendation = results.recommended_action || 'Consult a dermatologist for professional evaluation';
        const splitRec = doc.splitTextToSize(recommendation, pageWidth - 50);
        doc.text(splitRec, 25, yPos);

        // Medical Disclaimer
        yPos = pageHeight - 50;
        doc.setFillColor(255, 240, 240);
        doc.rect(20, yPos, pageWidth - 40, 35, 'F');

        yPos += 8;
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(255, 0, 0);
        doc.text('⚠ MEDICAL DISCLAIMER', 25, yPos);

        yPos += 6;
        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        const disclaimer = 'This report is generated by an AI-based preliminary screening tool and should NOT be considered as a definitive medical diagnosis. The results are for informational purposes only. Always consult a qualified dermatologist or healthcare professional for accurate diagnosis, medical advice, and treatment. Do not rely solely on this report for medical decisions.';
        const splitDisclaimer = doc.splitTextToSize(disclaimer, pageWidth - 50);
        doc.text(splitDisclaimer, 25, yPos);

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('Generated by DermAI - AI-Powered Skin Lesion Classification System', pageWidth / 2, pageHeight - 10, { align: 'center' });
        doc.text(`Page 1 of 1`, pageWidth - 20, pageHeight - 10, { align: 'right' });

        // Save PDF
        const fileName = `DermAI_Report_${patientName.replace(/\s+/g, '_') || 'Patient'}_${Date.now()}.pdf`;
        doc.save(fileName);
    };

    const handleFileUpload = async (file) => {
        if (!file) return;

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => setPreviewUrl(e.target.result);
        reader.readAsDataURL(file);

        console.log('📁 File selected:', file.name, file.size, 'bytes');
        setIsLoading(true);
        setResults(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            console.log('📤 Sending to backend...');
            const response = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                body: formData
            });

            console.log('📡 Response status:', response.status);
            const data = await response.json();
            console.log('✅ Backend response:', data);

            await new Promise(resolve => setTimeout(resolve, 1500));

            setResults(data);
            setIsLoading(false);
            setShowPatientForm(true); // Show patient form after analysis
        } catch (error) {
            console.error('❌ Error:', error);
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

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const resetUpload = () => {
        setPreviewUrl(null);
        setResults(null);
        setIsLoading(false);
        setPatientName('');
        setPatientAge('');
        setPatientGender('');
        setShowPatientForm(false);
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high': return '#ff4444';
            case 'danger': return '#ff4444';
            case 'warning': return '#ffaa00';
            case 'medium': return '#ffaa00';
            default: return '#00ff88';
        }
    };

    return (
        <section id="detection" className="detection-section" style={{
            background: 'linear-gradient(135deg, #1a1f3a 0%, #0f1729 100%)',
            padding: '100px 20px',
            minHeight: '100vh'
        }}>
            <div className="detection-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div className="detection-header" style={{
                    textAlign: 'center',
                    marginBottom: '60px'
                }}>
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
                            🔬 AI-POWERED ANALYSIS
                        </span>
                    </div>
                    <h2 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        fontWeight: '800',
                        background: 'linear-gradient(135deg, #00c2ff 0%, #0066ff 50%, #00ff88 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '15px',
                        letterSpacing: '-1px'
                    }}>
                        Image Analysis
                    </h2>
                    <p style={{
                        fontSize: '1.2rem',
                        color: 'rgba(255,255,255,0.7)',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Upload a skin lesion image for instant AI classification
                    </p>
                </div>

                <div className="detection-content">
                    {/* Upload Area */}
                    {!previewUrl && !isLoading && !results && (
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            style={{
                                background: isDragging
                                    ? 'rgba(0, 194, 255, 0.15)'
                                    : 'rgba(255,255,255,0.05)',
                                backdropFilter: 'blur(20px)',
                                border: isDragging
                                    ? '3px dashed #00c2ff'
                                    : '2px dashed rgba(255,255,255,0.2)',
                                borderRadius: '30px',
                                padding: '80px 40px',
                                textAlign: 'center',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                            }}
                        >
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'radial-gradient(circle at 50% 50%, rgba(0,194,255,0.1) 0%, transparent 50%)',
                                animation: 'pulse 3s ease-in-out infinite',
                                pointerEvents: 'none'
                            }} />

                            <label style={{ cursor: 'pointer', position: 'relative', zIndex: 1 }}>
                                <div style={{
                                    width: '120px',
                                    height: '120px',
                                    margin: '0 auto 30px',
                                    background: 'linear-gradient(135deg, #00c2ff 0%, #0066ff 100%)',
                                    borderRadius: '30px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 10px 40px rgba(0, 102, 255, 0.4)',
                                    transform: isDragging ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <i className="fas fa-cloud-upload-alt" style={{
                                        fontSize: '50px',
                                        color: 'white'
                                    }}></i>
                                </div>

                                <h3 style={{
                                    fontSize: '2rem',
                                    fontWeight: '700',
                                    color: 'white',
                                    marginBottom: '15px'
                                }}>
                                    {isDragging ? 'Drop it here!' : 'Drop your image here'}
                                </h3>

                                <p style={{
                                    fontSize: '1.1rem',
                                    color: 'rgba(255,255,255,0.6)',
                                    marginBottom: '30px'
                                }}>
                                    or click to browse from your device
                                </p>

                                <div style={{
                                    display: 'inline-block',
                                    padding: '15px 40px',
                                    background: 'linear-gradient(135deg, #0066ff 0%, #00c2ff 100%)',
                                    borderRadius: '50px',
                                    color: 'white',
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 10px 30px rgba(0, 102, 255, 0.3)',
                                    marginBottom: '30px'
                                }} className="upload-button">
                                    <i className="fas fa-image" style={{ marginRight: '10px' }}></i>
                                    Choose File
                                </div>

                                <div style={{
                                    fontSize: '0.9rem',
                                    color: 'rgba(255,255,255,0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px'
                                }}>
                                    <i className="fas fa-check-circle" style={{ color: '#00ff88' }}></i>
                                    Supports: JPG, PNG, JPEG (Max 10MB)
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

                    {/* Loading State */}
                    {isLoading && (
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '30px',
                            padding: '80px 40px',
                            textAlign: 'center',
                            border: '2px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                        }}>
                            {previewUrl && (
                                <div style={{
                                    width: '200px',
                                    height: '200px',
                                    margin: '0 auto 30px',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                                    border: '3px solid rgba(0, 194, 255, 0.5)'
                                }}>
                                    <img src={previewUrl} alt="Preview" style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }} />
                                </div>
                            )}

                            <div style={{
                                width: '80px',
                                height: '80px',
                                border: '4px solid rgba(0, 194, 255, 0.3)',
                                borderTop: '4px solid #00c2ff',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                margin: '0 auto 30px'
                            }} />

                            <h3 style={{
                                fontSize: '1.8rem',
                                color: 'white',
                                marginBottom: '15px',
                                fontWeight: '700'
                            }}>
                                Analyzing Image...
                            </h3>

                            <p style={{
                                color: 'rgba(255,255,255,0.6)',
                                fontSize: '1.1rem'
                            }}>
                                Our AI model is processing your image
                            </p>
                        </div>
                    )}

                    {/* Results with Patient Form */}
                    {results && (
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '30px',
                            padding: '50px',
                            border: '2px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                        }}>
                            {/* Patient Information Form */}
                            {showPatientForm && (
                                <div style={{
                                    background: 'rgba(0, 194, 255, 0.1)',
                                    border: '1px solid rgba(0, 194, 255, 0.3)',
                                    borderRadius: '20px',
                                    padding: '30px',
                                    marginBottom: '40px'
                                }}>
                                    <h3 style={{
                                        color: '#00c2ff',
                                        fontSize: '1.5rem',
                                        fontWeight: '700',
                                        marginBottom: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        <i className="fas fa-user-md"></i>
                                        Patient Information (Optional)
                                    </h3>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                        gap: '20px'
                                    }}>
                                        <div>
                                            <label style={{
                                                display: 'block',
                                                color: 'white',
                                                marginBottom: '8px',
                                                fontSize: '0.9rem',
                                                fontWeight: '600'
                                            }}>
                                                Patient Name
                                            </label>
                                            <input
                                                type="text"
                                                value={patientName}
                                                onChange={(e) => setPatientName(e.target.value)}
                                                placeholder="Enter patient name"
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    borderRadius: '10px',
                                                    border: '1px solid rgba(255,255,255,0.2)',
                                                    background: 'rgba(255,255,255,0.1)',
                                                    color: 'white',
                                                    fontSize: '1rem'
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{
                                                display: 'block',
                                                color: 'white',
                                                marginBottom: '8px',
                                                fontSize: '0.9rem',
                                                fontWeight: '600'
                                            }}>
                                                Age (years)
                                            </label>
                                            <input
                                                type="number"
                                                value={patientAge}
                                                onChange={(e) => setPatientAge(e.target.value)}
                                                placeholder="Age"
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    borderRadius: '10px',
                                                    border: '1px solid rgba(255,255,255,0.2)',
                                                    background: 'rgba(255,255,255,0.1)',
                                                    color: 'white',
                                                    fontSize: '1rem'
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{
                                                display: 'block',
                                                color: 'white',
                                                marginBottom: '8px',
                                                fontSize: '0.9rem',
                                                fontWeight: '600'
                                            }}>
                                                Gender
                                            </label>
                                            <select
                                                value={patientGender}
                                                onChange={(e) => setPatientGender(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    borderRadius: '10px',
                                                    border: '1px solid rgba(255,255,255,0.2)',
                                                    background: 'rgba(255,255,255,0.1)',
                                                    color: 'white',
                                                    fontSize: '1rem'
                                                }}
                                            >
                                                <option value="" style={{ background: '#1a1f3a' }}>Select</option>
                                                <option value="Male" style={{ background: '#1a1f3a' }}>Male</option>
                                                <option value="Female" style={{ background: '#1a1f3a' }}>Female</option>
                                                <option value="Other" style={{ background: '#1a1f3a' }}>Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Result Header */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '40px',
                                paddingBottom: '30px',
                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                                flexWrap: 'wrap',
                                gap: '15px'
                            }}>
                                <div>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '8px 20px',
                                        background: 'rgba(0, 255, 136, 0.1)',
                                        borderRadius: '50px',
                                        color: '#00ff88',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        marginBottom: '15px'
                                    }}>
                                        ✓ ANALYSIS COMPLETE
                                    </span>
                                    <h3 style={{
                                        fontSize: '2rem',
                                        color: 'white',
                                        fontWeight: '700'
                                    }}>
                                        Classification Result
                                    </h3>
                                </div>

                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    <button
                                        onClick={generatePDF}
                                        style={{
                                            padding: '15px 30px',
                                            background: 'linear-gradient(135deg, #00ff88 0%, #00c2ff 100%)',
                                            border: 'none',
                                            borderRadius: '12px',
                                            color: 'white',
                                            cursor: 'pointer',
                                            fontSize: '1rem',
                                            fontWeight: '700',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 5px 20px rgba(0, 255, 136, 0.3)'
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.transform = 'translateY(-3px)';
                                            e.target.style.boxShadow = '0 10px 30px rgba(0, 255, 136, 0.5)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 5px 20px rgba(0, 255, 136, 0.3)';
                                        }}
                                    >
                                        <i className="fas fa-file-pdf" style={{ marginRight: '8px' }}></i>
                                        Download PDF Report
                                    </button>

                                    <button
                                        onClick={resetUpload}
                                        style={{
                                            padding: '15px 25px',
                                            background: 'rgba(255,255,255,0.1)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            borderRadius: '12px',
                                            color: 'white',
                                            cursor: 'pointer',
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.background = 'rgba(255,255,255,0.2)';
                                            e.target.style.transform = 'translateY(-2px)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.background = 'rgba(255,255,255,0.1)';
                                            e.target.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        <i className="fas fa-redo" style={{ marginRight: '8px' }}></i>
                                        New Analysis
                                    </button>
                                </div>
                            </div>
                            {/* Image Preview Section - NEW! */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                gap: '30px',
                                marginBottom: '40px'
                            }}>
                                {/* Analyzed Image */}
                                <div style={{
                                    background: 'rgba(0, 194, 255, 0.1)',
                                    border: '2px solid rgba(0, 194, 255, 0.3)',
                                    borderRadius: '20px',
                                    padding: '25px',
                                    textAlign: 'center'
                                }}>
                                    <h4 style={{
                                        color: '#00c2ff',
                                        fontSize: '1.2rem',
                                        fontWeight: '700',
                                        marginBottom: '20px'
                                    }}>
                                        <i className="fas fa-image"></i> Analyzed Image
                                    </h4>

                                    {previewUrl && (
                                        <div style={{
                                            width: '100%',
                                            maxWidth: '350px',
                                            margin: '0 auto',
                                            borderRadius: '15px',
                                            overflow: 'hidden',
                                            boxShadow: '0 10px 40px rgba(0, 194, 255, 0.3)',
                                            border: '3px solid rgba(0, 194, 255, 0.5)'
                                        }}>
                                            <img src={previewUrl} alt="Analyzed" style={{
                                                width: '100%',
                                                display: 'block'
                                            }} />
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Main Prediction */}
                            <div style={{
                                textAlign: 'center',
                                padding: '40px',
                                background: 'rgba(0, 102, 255, 0.1)',
                                borderRadius: '20px',
                                marginBottom: '40px',
                                border: '1px solid rgba(0, 102, 255, 0.3)'
                            }}>
                                <div style={{
                                    fontSize: '4rem',
                                    marginBottom: '20px'
                                }}>
                                    🔬
                                </div>

                                <p style={{
                                    color: 'rgba(255,255,255,0.7)',
                                    fontSize: '1.2rem',
                                    marginBottom: '15px',
                                    fontWeight: '500'
                                }}>
                                    Detected Class
                                </p>

                                <h2 style={{
                                    fontSize: '3rem',
                                    fontWeight: '800',
                                    color: getSeverityColor(results.severity),
                                    margin: '0'
                                }}>
                                    {results.prediction}
                                </h2>
                            </div>



                            {/* Disclaimer */}
                            <div style={{
                                background: 'rgba(255, 170, 0, 0.1)',
                                border: '1px solid rgba(255, 170, 0, 0.3)',
                                borderRadius: '15px',
                                padding: '20px',
                                display: 'flex',
                                gap: '15px',
                                alignItems: 'start'
                            }}>
                                <i className="fas fa-exclamation-triangle" style={{
                                    color: '#ffaa00',
                                    fontSize: '1.5rem',
                                    marginTop: '5px'
                                }}></i>
                                <div>
                                    <strong style={{ color: 'white', fontSize: '1.1rem', display: 'block', marginBottom: '5px' }}>
                                        Medical Disclaimer
                                    </strong>
                                    <p style={{
                                        color: 'rgba(255,255,255,0.7)',
                                        fontSize: '0.95rem',
                                        lineHeight: '1.6',
                                        margin: 0
                                    }}>
                                        This tool provides preliminary screening only and should not be considered a definitive diagnosis.
                                        Always consult a qualified dermatologist for professional medical advice and treatment.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes pulse {
                    0%, 100% { opacity: 0.6; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.05); }
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .upload-button:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 15px 40px rgba(0, 102, 255, 0.5) !important;
                }
                
                input:focus, select:focus {
                    outline: none;
                    border-color: #00c2ff !important;
                    box-shadow: 0 0 0 3px rgba(0, 194, 255, 0.2);
                }
            `}</style>
        </section>
    );
};

export default SimpleTest;
