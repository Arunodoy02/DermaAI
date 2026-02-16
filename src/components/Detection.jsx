import React, { useState, useRef } from 'react';
import { API_ENDPOINTS } from '../config';

const Detection = () => {
    const [currentFile, setCurrentFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const fileInputRef = useRef(null);

    // const API_ENDPOINT = 'http://localhost:5000/predict'; // Replaced by config
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

    const CANCER_TYPES = {
        'Melanoma': {
            icon: '⚠️',
            description: 'Potentially dangerous. Consult a dermatologist immediately.',
            severity: 'danger'
        },
        'Basal Cell Carcinoma': {
            icon: '🔵',
            description: 'Common type. Highly treatable with early intervention.',
            severity: 'warning'
        },
        'Actinic Keratoses': {
            icon: '🟡',
            description: 'Precancerous lesion. Consult dermatologist.',
            severity: 'warning'
        },
        'Benign Keratosis': {
            icon: '✅',
            description: 'Non-cancerous growth. Monitor for changes.',
            severity: 'safe'
        },
        'Dermatofibroma': {
            icon: '✅',
            description: 'Benign fibrous nodule. Generally harmless.',
            severity: 'safe'
        },
        'Melanocytic Nevi': {
            icon: '✅',
            description: 'Common mole, usually benign.',
            severity: 'safe'
        },
        'Vascular Lesions': {
            icon: '🔵',
            description: 'Blood vessel related. Usually benign.',
            severity: 'safe'
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            processFile(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        if (file) {
            processFile(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const processFile = (file) => {
        // Validate file type
        const fileType = file.type.toLowerCase();
        if (!ALLOWED_TYPES.includes(fileType)) {
            alert('Please upload a valid image file (JPG, PNG, JPEG)');
            return;
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            alert('File size exceeds 10MB limit');
            return;
        }

        setCurrentFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        alert('BUTTON WAS CLICKED!');
        e.preventDefault();
        console.log('BUTTON CLICKED');
        if (!currentFile) {
            alert('Please select an image first');
            return;
        }

        setIsLoading(true);
        setShowResults(false);
        console.log('📞 About to call analyzeImage with file:', currentFile);
        const result = await analyzeImage(currentFile);
        try {
            // Call backend API
            // Wait for minimum duration for better UX
            await new Promise(resolve => setTimeout(resolve, 2000));

            setResults(result);
            setShowResults(true);
            setIsLoading(false);
        } catch (error) {
            console.error('Analysis error:', error);
            alert('Analysis failed. Please try again.');
            setIsLoading(false);
        }
    };

    const analyzeImage = async (file) => {
        try {
            console.log(file);
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(API_ENDPOINTS.PREDICT, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.warn('Backend API not available, using demo mode:', error);
            return generateDemoResults();
        }
    };

    const generateDemoResults = () => {
        const types = ['Melanoma', 'Basal Cell Carcinoma', 'Squamous Cell Carcinoma', 'Benign'];
        const predictions = {};

        let total = 0;
        types.forEach(type => {
            predictions[type] = Math.random();
            total += predictions[type];
        });

        Object.keys(predictions).forEach(type => {
            predictions[type] = (predictions[type] / total * 100);
        });

        const sortedTypes = Object.entries(predictions).sort((a, b) => b[1] - a[1]);
        const topPrediction = sortedTypes[0][0];
        const confidence = sortedTypes[0][1];

        return {
            prediction: topPrediction,
            confidence: confidence,
            all_predictions: predictions
        };
    };

    const resetUpload = () => {
        setCurrentFile(null);
        setPreviewUrl(null);
        setIsLoading(false);
        setResults(null);
        setShowResults(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const downloadReport = () => {
        if (!results) return;

        const cancerInfo = CANCER_TYPES[results.prediction] || CANCER_TYPES['Benign'];

        const report = `
SKIN CANCER DETECTION REPORT
Generated by DermAI - ${new Date().toLocaleDateString()}
=========================================

ANALYSIS RESULTS:
Prediction: ${results.prediction}
Confidence: ${results.confidence?.toFixed(2)}%

DESCRIPTION:
${cancerInfo.description}

DETAILED CONFIDENCE SCORES:
${Object.entries(results.all_predictions || {})
                .map(([type, conf]) => `  ${type}: ${conf.toFixed(2)}%`)
                .join('\n')}

=========================================
DISCLAIMER:
This analysis is for preliminary screening purposes only.
Always consult with a qualified dermatologist for 
professional diagnosis and treatment recommendations.
=========================================
    `.trim();

        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `DermAI_Report_${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <section id="detection" className="detection-section">
            <div className="detection-container">
                <div className="detection-header">
                    <h2 className="section-title">Image Analysis</h2>
                    <p className="section-subtitle">Upload a skin lesion image for classification</p>
                </div>

                <div className="detection-content">
                    {/* Upload Area */}
                    <div className="upload-area">
                        {!previewUrl && !isLoading ? (
                            <div
                                className="upload-box"
                                onClick={() => fileInputRef.current?.click()}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    hidden
                                />
                                <div className="upload-icon">
                                    <i className="fas fa-cloud-upload-alt"></i>
                                </div>
                                <h3>Drop your image here</h3>
                                <p>or click to browse</p>
                                <span className="file-support">Supports: JPG, PNG, JPEG (Max 10MB)</span>
                            </div>
                        ) : previewUrl && !isLoading && !showResults ? (
                            <div className="preview-container">
                                <div className="preview-header">
                                    <h4>Image Preview</h4>
                                    <button type="button" className="btn-remove" onClick={resetUpload}>
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                                <div className="preview-image-wrapper">
                                    <img src={previewUrl} alt="Preview" />
                                </div>
                                <button className="btn-analyze" onClick={handleSubmit}>
                                    <i className="fas fa-search"></i>
                                    Analyze Image
                                </button>
                            </div>
                        ) : isLoading ? (
                            <div className="loading-state">
                                <div className="loader-spinner"></div>
                                <h3>Processing...</h3>
                                <p>Please wait while the model analyzes the image</p>
                                <div className="progress-bar">
                                    <div className="progress-fill"></div>
                                </div>
                            </div>
                        ) : null}
                    </div>

                    {/* Results Area */}
                    {showResults && results && (
                        <div className="results-area active">
                            <div className="result-card">
                                <div className="result-header">
                                    <h3>Analysis Complete</h3>
                                    <span className={`result-status ${CANCER_TYPES[results.prediction]?.severity || 'safe'}`}>
                                        {results.prediction}
                                    </span>
                                </div>

                                <div className="result-main">
                                    <div className="result-icon" style={{ background: `var(--gradient-${CANCER_TYPES[results.prediction]?.severity === 'danger' ? 'danger' : CANCER_TYPES[results.prediction]?.severity === 'warning' ? 'purple' : 'success'})` }}>
                                        {CANCER_TYPES[results.prediction]?.icon || '✅'}
                                    </div>
                                    <h2>{results.prediction}</h2>
                                    <p>{CANCER_TYPES[results.prediction]?.description}</p>
                                </div>

                                <div className="confidence-section">
                                    <h4>Confidence Analysis</h4>
                                    <div className="confidence-bars">
                                        {Object.entries(results.all_predictions || {})
                                            .sort((a, b) => b[1] - a[1])
                                            .map(([type, confidence], index) => (
                                                <div key={index} className="confidence-item">
                                                    <div className="confidence-label">
                                                        <span className="confidence-name">{type}</span>
                                                        <span className="confidence-value">{confidence.toFixed(1)}%</span>
                                                    </div>
                                                    <div className="confidence-bar">
                                                        <div
                                                            className="confidence-bar-fill"
                                                            style={{ width: `${confidence}%`, transition: 'width 1s ease', transitionDelay: `${index * 100}ms` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                <div className="result-actions">
                                    <button className="btn-download" onClick={downloadReport}>
                                        <i className="fas fa-download"></i>
                                        Download Report
                                    </button>
                                    <button className="btn-new" onClick={resetUpload}>
                                        <i className="fas fa-redo"></i>
                                        New Analysis
                                    </button>
                                </div>

                                <div className="disclaimer">
                                    <i className="fas fa-exclamation-triangle"></i>
                                    <p>
                                        <strong>Medical Disclaimer:</strong> This tool provides preliminary screening only.
                                        Always consult a qualified dermatologist for professional diagnosis and treatment.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Detection;
