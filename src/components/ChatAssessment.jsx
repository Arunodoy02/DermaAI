import React, { useState, useRef, useEffect } from 'react';
import { API_ENDPOINTS } from '../config';

const ChatAssessment = () => {
    const [messages, setMessages] = useState([
        { type: 'bot', text: '👋 Hello! I\'m your AI Clinical Assistant. Ready to assess a new patient?', buttons: ['Start Assessment', 'View Help'] }
    ]);
    const [input, setInput] = useState('');
    const [currentStep, setCurrentStep] = useState('initial');
    const [patientData, setPatientData] = useState({});
    const [isTyping, setIsTyping] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const addMessage = (type, text, buttons = null, image = null) => {
        setMessages(prev => [...prev, { type, text, buttons, image, timestamp: new Date() }]);
    };

    const botReply = (text, buttons = null, delay = 800) => {
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            addMessage('bot', text, buttons);
        }, delay);
    };

    const handleQuickReply = (reply) => {
        addMessage('user', reply);

        if (reply === 'Start Assessment') {
            setCurrentStep('patient_name');
            botReply('Great! Let\'s begin. What is the patient\'s full name?');
        } else if (reply === 'View Help') {
            botReply('I can help you:\n• Assess new skin lesions\n• Upload dermoscopic images\n• Get AI-powered diagnosis\n• Generate clinical reports\n\nReady to start?', ['Start Assessment']);
        } else if (reply === 'Generate Report') {
            generateReport();
        } else if (reply === 'New Assessment') {
            resetAssessment();
        } else if (reply === 'Yes' && currentStep === 'confirm_submit') {
            submitForAnalysis();
        } else if (reply === 'No' && currentStep === 'confirm_submit') {
            botReply('No problem! What would you like to review?', ['Patient Info', 'Lesion Details', 'Start Over']);
        }
    };

    const handleInput = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        addMessage('user', input);
        processInput(input);
        setInput('');
    };

    const processInput = (userInput) => {
        const trimmedInput = userInput.trim();

        switch (currentStep) {
            case 'patient_name':
                setPatientData(prev => ({ ...prev, name: trimmedInput }));
                setCurrentStep('patient_age');
                botReply(`Patient: ${trimmedInput}. What is the patient's age?`);
                break;

            case 'patient_age':
                setPatientData(prev => ({ ...prev, age: trimmedInput }));
                setCurrentStep('patient_gender');
                botReply('Patient gender?', ['Male', 'Female', 'Other']);
                break;

            case 'patient_gender':
                setPatientData(prev => ({ ...prev, gender: trimmedInput }));
                setCurrentStep('lesion_location');
                botReply('Perfect! Now, where is the lesion located? (e.g., left forearm, right shoulder)');
                break;

            case 'lesion_location':
                setPatientData(prev => ({ ...prev, location: trimmedInput }));
                setCurrentStep('lesion_duration');
                botReply('How long has the lesion been present? (e.g., 2 months, 1 year)');
                break;

            case 'lesion_duration':
                setPatientData(prev => ({ ...prev, duration: trimmedInput }));
                setCurrentStep('lesion_size');
                botReply('What is the approximate size in millimeters?');
                break;

            case 'lesion_size':
                setPatientData(prev => ({ ...prev, size: trimmedInput }));
                setCurrentStep('lesion_symptoms');
                botReply('Any associated symptoms? (e.g., itching, bleeding, pain, or "none")');
                break;

            case 'lesion_symptoms':
                setPatientData(prev => ({ ...prev, symptoms: trimmedInput }));
                setCurrentStep('image_upload');
                botReply('📸 Almost there! Please upload a dermoscopic image of the lesion.');
                break;

            default:
                botReply('I didn\'t understand that. Let\'s start fresh!', ['Start Assessment']);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
                addMessage('user', '📎 Image uploaded', null, e.target.result);
                setCurrentStep('confirm_submit');
                botReply('Perfect! I have all the information:\n\n' +
                    `👤 Patient: ${patientData.name}, ${patientData.age} years, ${patientData.gender}\n` +
                    `📍 Location: ${patientData.location}\n` +
                    `⏱️ Duration: ${patientData.duration}\n` +
                    `📏 Size: ${patientData.size}mm\n` +
                    `💊 Symptoms: ${patientData.symptoms}\n` +
                    `📸 Image: Uploaded\n\n` +
                    'Ready to analyze?', ['Yes', 'No']);
            };
            reader.readAsDataURL(file);
        }
    };

    const submitForAnalysis = async () => {
        addMessage('bot', '🔬 Analyzing the dermoscopic image with AI model...');
        setIsTyping(true);

        const formData = new FormData();
        formData.append('file', imageFile);

        try {
            const response = await fetch(API_ENDPOINTS.PREDICT, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            setIsTyping(false);

            const riskEmoji = data.severity === 'high' ? '🔴' : data.severity === 'medium' ? '🟡' : '🟢';
            const riskText = data.severity === 'high' ? 'HIGH RISK' : data.severity === 'medium' ? 'MODERATE RISK' : 'LOW RISK';

            addMessage('bot',
                `✅ **Analysis Complete!**\n\n` +
                `🎯 **Classification:** ${data.prediction}\n` +
                `${riskEmoji} **Risk Level:** ${riskText}\n` +
                `📊 **Confidence:** ${data.confidence}%\n\n` +
                `📋 **Clinical Description:**\n${data.description || 'See detailed analysis'}\n\n` +
                `⚕️ **Recommended Action:**\n${data.recommended_action || 'Clinical evaluation recommended'}`,
                ['Generate Report', 'New Assessment']
            );

            setPatientData(prev => ({ ...prev, analysis: data }));
            setCurrentStep('completed');

        } catch (error) {
            setIsTyping(false);
            addMessage('bot', '❌ Error analyzing image. Please check the backend connection and try again.', ['Try Again', 'Start Over']);
        }
    };

    const generateReport = () => {
        addMessage('bot', '📄 Generating comprehensive clinical report...');

        setTimeout(() => {
            // Create a simple text report
            const reportText = `
DERMATOLOGY CLINICAL REPORT
═══════════════════════════════════════

Report ID: SCR-${Date.now().toString().slice(-8)}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

PATIENT INFORMATION
───────────────────────────────────────
Name: ${patientData.name}
Age: ${patientData.age} years
Gender: ${patientData.gender}

LESION CHARACTERISTICS
───────────────────────────────────────
Location: ${patientData.location}
Duration: ${patientData.duration}
Size: ${patientData.size}mm
Symptoms: ${patientData.symptoms}

AI-ASSISTED DIAGNOSIS
───────────────────────────────────────
Classification: ${patientData.analysis?.prediction}
Risk Level: ${patientData.analysis?.severity?.toUpperCase()}
Confidence: ${patientData.analysis?.confidence}%

RECOMMENDATIONS
───────────────────────────────────────
${patientData.analysis?.recommended_action}

DISCLAIMER
───────────────────────────────────────
This AI-assisted analysis is a clinical decision support 
tool and should not replace professional medical judgment.

═══════════════════════════════════════
Generated by Skin Cancer Detection System
            `.trim();

            // Create blob and download
            const blob = new Blob([reportText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Clinical_Report_${patientData.name?.replace(/\s+/g, '_')}_${Date.now()}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            addMessage('bot', '✅ Report generated and downloaded! What would you like to do next?', ['New Assessment']);
        }, 1000);
    };

    const resetAssessment = () => {
        setPatientData({});
        setImageFile(null);
        setImagePreview(null);
        setCurrentStep('initial');
        setMessages([
            { type: 'bot', text: '🔄 Starting fresh! Ready to assess a new patient?', buttons: ['Start Assessment'] }
        ]);
    };

    return (
        <section id="chat-assessment" style={{
            background: 'linear-gradient(135deg, #0A0E27 0%, #1A1F3A 50%, #2A2F4A 100%)',
            padding: '80px 20px 40px',
            minHeight: '100vh',
            position: 'relative'
        }}>
            {/* Animated Background */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'radial-gradient(circle at 20% 50%, rgba(0, 102, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 201, 255, 0.15) 0%, transparent 50%)',
                pointerEvents: 'none'
            }} />

            <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '10px 25px',
                        background: 'rgba(0, 102, 255, 0.15)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '50px',
                        border: '2px solid rgba(0, 102, 255, 0.3)',
                        marginBottom: '15px'
                    }}>
                        <span style={{ color: '#00C9FF', fontSize: '14px', fontWeight: '700', letterSpacing: '1px' }}>
                            🤖 AI CLINICAL ASSISTANT
                        </span>
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontWeight: '900',
                        background: 'linear-gradient(135deg, #0066FF 0%, #00C9FF 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '10px',
                        fontFamily: "'Space Grotesk', sans-serif"
                    }}>
                        Conversational Diagnosis
                    </h1>
                    <p style={{ color: '#E8EDF4', fontSize: '1.1rem' }}>
                        Chat-based skin cancer assessment powered by AI
                    </p>
                </div>

                {/* Chat Container */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '25px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '600px'
                }}>
                    {/* Messages Area */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '30px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px'
                    }}>
                        {messages.map((msg, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                justifyContent: msg.type === 'bot' ? 'flex-start' : 'flex-end',
                                animation: 'slideInUp 0.3s ease-out'
                            }}>
                                <div style={{
                                    maxWidth: '75%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px'
                                }}>
                                    {/* Message Bubble */}
                                    <div style={{
                                        background: msg.type === 'bot'
                                            ? 'rgba(0, 102, 255, 0.15)'
                                            : 'linear-gradient(135deg, #0066FF 0%, #00C9FF 100%)',
                                        border: msg.type === 'bot' ? '1px solid rgba(0, 102, 255, 0.3)' : 'none',
                                        padding: '15px 20px',
                                        borderRadius: msg.type === 'bot' ? '20px 20px 20px 5px' : '20px 20px 5px 20px',
                                        color: '#F7F9FC',
                                        whiteSpace: 'pre-line',
                                        lineHeight: '1.6',
                                        fontSize: '0.95rem',
                                        boxShadow: msg.type === 'user' ? '0 8px 20px rgba(0, 102, 255, 0.3)' : 'none'
                                    }}>
                                        {msg.text}
                                    </div>

                                    {/* Image Preview */}
                                    {msg.image && (
                                        <img src={msg.image} alt="Uploaded" style={{
                                            maxWidth: '200px',
                                            borderRadius: '15px',
                                            border: '2px solid rgba(0, 102, 255, 0.3)',
                                            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)'
                                        }} />
                                    )}

                                    {/* Quick Reply Buttons */}
                                    {msg.buttons && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {msg.buttons.map((btn, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleQuickReply(btn)}
                                                    style={{
                                                        padding: '10px 20px',
                                                        background: 'rgba(0, 102, 255, 0.2)',
                                                        border: '2px solid rgba(0, 102, 255, 0.4)',
                                                        borderRadius: '12px',
                                                        color: '#00C9FF',
                                                        fontSize: '0.9rem',
                                                        fontWeight: '600',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                    onMouseOver={(e) => {
                                                        e.target.style.background = 'rgba(0, 102, 255, 0.3)';
                                                        e.target.style.transform = 'translateY(-2px)';
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.target.style.background = 'rgba(0, 102, 255, 0.2)';
                                                        e.target.style.transform = 'translateY(0)';
                                                    }}
                                                >
                                                    {btn}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <div style={{
                                    background: 'rgba(0, 102, 255, 0.15)',
                                    border: '1px solid rgba(0, 102, 255, 0.3)',
                                    padding: '15px 20px',
                                    borderRadius: '20px 20px 20px 5px',
                                    display: 'flex',
                                    gap: '5px'
                                }}>
                                    <div style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: '#00C9FF',
                                        animation: 'bounce 1.4s infinite ease-in-out'
                                    }} />
                                    <div style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: '#00C9FF',
                                        animation: 'bounce 1.4s infinite ease-in-out 0.2s'
                                    }} />
                                    <div style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: '#00C9FF',
                                        animation: 'bounce 1.4s infinite ease-in-out 0.4s'
                                    }} />
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div style={{
                        padding: '20px',
                        background: 'rgba(0, 0, 0, 0.2)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        {currentStep === 'image_upload' ? (
                            <div style={{ textAlign: 'center' }}>
                                <label style={{
                                    display: 'inline-block',
                                    padding: '15px 30px',
                                    background: 'linear-gradient(135deg, #0066FF 0%, #00C9FF 100%)',
                                    borderRadius: '12px',
                                    color: 'white',
                                    fontSize: '1rem',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    boxShadow: '0 8px 25px rgba(0, 102, 255, 0.4)'
                                }}>
                                    <i className="fas fa-cloud-upload-alt" style={{ marginRight: '10px' }}></i>
                                    Upload Dermoscopic Image
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </div>
                        ) : (
                            <form onSubmit={handleInput} style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your response..."
                                    style={{
                                        flex: 1,
                                        padding: '15px 20px',
                                        borderRadius: '12px',
                                        border: '2px solid rgba(255, 255, 255, 0.1)',
                                        background: 'rgba(42, 47, 74, 0.5)',
                                        color: '#F7F9FC',
                                        fontSize: '1rem',
                                        outline: 'none'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#0066FF'}
                                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                                />
                                <button
                                    type="submit"
                                    style={{
                                        padding: '15px 30px',
                                        background: 'linear-gradient(135deg, #0066FF 0%, #00C9FF 100%)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        color: 'white',
                                        fontSize: '1rem',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        boxShadow: '0 8px 25px rgba(0, 102, 255, 0.4)'
                                    }}
                                >
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Info Footer */}
                <div style={{
                    marginTop: '20px',
                    padding: '15px',
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '2px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <i className="fas fa-info-circle" style={{ color: '#f59e0b', fontSize: '1.2rem' }}></i>
                    <span style={{ color: '#E8EDF4', fontSize: '0.9rem' }}>
                        This is a clinical decision support tool. Always correlate AI results with clinical examination.
                    </span>
                </div>
            </div>

            <style>{`
                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1); }
                }
            `}</style>
        </section>
    );
};

export default ChatAssessment;
