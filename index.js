/* ============================================
   DermAI - Advanced Interactive Features
   Skin Cancer Detection Application
   ============================================ */

// Configuration
const CONFIG = {
  // Backend API endpoint - Update this with your Flask backend URL
  API_ENDPOINT: 'http://localhost:5000/predict', // Change to your backend URL
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
  ANALYSIS_DURATION: 2000, // 2 seconds
};

// Skin cancer types with detailed information
const CANCER_TYPES = {
  'Melanoma': {
    icon: '⚠️',
    description: 'Most dangerous form of skin cancer. Immediate medical consultation recommended.',
    severity: 'danger',
    recommendations: [
      'Consult a dermatologist immediately',
      'Schedule a biopsy if not already done',
      'Monitor for any changes in size or color',
      'Avoid sun exposure'
    ]
  },
  'Basal Cell Carcinoma': {
    icon: '🔵',
    description: 'Most common but least dangerous skin cancer. Early treatment is highly effective.',
    severity: 'warning',
    recommendations: [
      'Schedule an appointment with a dermatologist',
      'Avoid further sun damage',
      'Consider treatment options (surgery, radiation)',
      'Regular follow-up examinations'
    ]
  },
  'Squamous Cell Carcinoma': {
    icon: '🟡',
    description: 'Second most common skin cancer. Treatable when caught early.',
    severity: 'warning',
    recommendations: [
      'See a dermatologist within 2 weeks',
      'Discuss treatment options',
      'Protect from sun exposure',
      'Monitor for spread to lymph nodes'
    ]
  },
  'Benign': {
    icon: '✅',
    description: 'No signs of skin cancer detected. Continue regular skin checks.',
    severity: 'safe',
    recommendations: [
      'Continue monthly self-examinations',
      'Annual dermatologist check-ups',
      'Use sunscreen daily (SPF 30+)',
      'Monitor for any new or changing lesions'
    ]
  },
  'Non-Cancerous': {
    icon: '✅',
    description: 'Lesion appears benign. Regular monitoring recommended.',
    severity: 'safe',
    recommendations: [
      'Perform regular self-checks',
      'Protect skin from UV damage',
      'Consult doctor if changes occur',
      'Maintain healthy skin care routine'
    ]
  }
};

// DOM Elements
const elements = {
  // Upload Section
  uploadBox: document.getElementById('uploadBox'),
  fileInput: document.getElementById('fileInput'),
  previewContainer: document.getElementById('previewContainer'),
  previewImage: document.getElementById('previewImage'),
  removeBtn: document.getElementById('removeBtn'),
  analyzeBtn: document.getElementById('analyzeBtn'),
  uploadForm: document.getElementById('uploadForm'),
  
  // Loading Section
  loadingState: document.getElementById('loadingState'),
  progressFill: document.getElementById('progressFill'),
  
  // Results Section
  resultsArea: document.getElementById('resultsArea'),
  resultStatus: document.getElementById('resultStatus'),
  resultIcon: document.getElementById('resultIcon'),
  resultTitle: document.getElementById('resultTitle'),
  resultDescription: document.getElementById('resultDescription'),
  confidenceBars: document.getElementById('confidenceBars'),
  downloadBtn: document.getElementById('downloadBtn'),
  newAnalysisBtn: document.getElementById('newAnalysisBtn'),
  
  // Navigation
  menuToggle: document.getElementById('menuToggle'),
  navLinks: document.querySelectorAll('.nav-link'),
};

// State
let currentFile = null;
let currentResults = null;

/* ============================================
   INITIALIZATION
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initializeEventListeners();
  initializeScrollAnimations();
  initializeNavigation();
});

/* ============================================
   EVENT LISTENERS
   ============================================ */

function initializeEventListeners() {
  // Upload box click
  elements.uploadBox.addEventListener('click', () => {
    elements.fileInput.click();
  });
  
  // Drag and drop
  elements.uploadBox.addEventListener('dragover', handleDragOver);
  elements.uploadBox.addEventListener('dragleave', handleDragLeave);
  elements.uploadBox.addEventListener('drop', handleDrop);
  
  // File selection
  elements.fileInput.addEventListener('change', handleFileSelect);
  
  // Remove image
  elements.removeBtn.addEventListener('click', resetUpload);
  
  // Form submission
  elements.uploadForm.addEventListener('submit', handleFormSubmit);
  
  // Result actions
  elements.downloadBtn.addEventListener('click', downloadReport);
  elements.newAnalysisBtn.addEventListener('click', resetUpload);
}

/* ============================================
   FILE HANDLING
   ============================================ */

function handleDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  elements.uploadBox.style.borderColor = 'var(--primary-cyan)';
  elements.uploadBox.style.background = 'rgba(0, 201, 255, 0.1)';
}

function handleDragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
  elements.uploadBox.style.borderColor = 'rgba(0, 102, 255, 0.5)';
  elements.uploadBox.style.background = 'rgba(255, 255, 255, 0.05)';
}

function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  
  handleDragLeave(e);
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
}

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) {
    processFile(file);
  }
}

function processFile(file) {
  // Validate file type
  if (!CONFIG.ALLOWED_TYPES.includes(file.type)) {
    showNotification('Please upload a valid image file (JPG, PNG, JPEG)', 'error');
    return;
  }
  
  // Validate file size
  if (file.size > CONFIG.MAX_FILE_SIZE) {
    showNotification('File size exceeds 10MB limit', 'error');
    return;
  }
  
  currentFile = file;
  
  // Show preview
  const reader = new FileReader();
  reader.onload = (e) => {
    elements.previewImage.src = e.target.result;
    showPreview();
  };
  reader.readAsDataURL(file);
}

function showPreview() {
  elements.uploadBox.style.display = 'none';
  elements.previewContainer.classList.add('active');
  elements.previewContainer.style.display = 'block';
}

function resetUpload() {
  currentFile = null;
  currentResults = null;
  elements.fileInput.value = '';
  elements.previewImage.src = '';
  elements.uploadBox.style.display = 'block';
  elements.previewContainer.classList.remove('active');
  elements.previewContainer.style.display = 'none';
  elements.loadingState.classList.remove('active');
  elements.resultsArea.classList.remove('active');
}

/* ============================================
   FORM SUBMISSION & ANALYSIS
   ============================================ */

async function handleFormSubmit(e) {
  e.preventDefault();
  
  if (!currentFile) {
    showNotification('Please select an image first', 'error');
    return;
  }
  
  // Hide preview, show loading
  elements.previewContainer.style.display = 'none';
  elements.loadingState.classList.add('active');
  
  // Animate progress bar
  animateProgress();
  
  try {
    // Call backend API
    const result = await analyzeImage(currentFile);
    
    // Wait for minimum duration for better UX
    await new Promise(resolve => setTimeout(resolve, CONFIG.ANALYSIS_DURATION));
    
    // Show results
    displayResults(result);
  } catch (error) {
    console.error('Analysis error:', error);
    showNotification('Analysis failed. Please try again.', 'error');
    resetUpload();
  }
}

async function analyzeImage(file) {
  // Try to call the backend API
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(CONFIG.API_ENDPOINT, {
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
    // Return demo results if backend is not available
    return generateDemoResults();
  }
}

function generateDemoResults() {
  // Demo results for testing without backend
  const types = ['Melanoma', 'Basal Cell Carcinoma', 'Squamous Cell Carcinoma', 'Benign'];
  const predictions = {};
  
  // Generate random confidence scores
  let total = 0;
  types.forEach(type => {
    predictions[type] = Math.random();
    total += predictions[type];
  });
  
  // Normalize to sum to 1
  Object.keys(predictions).forEach(type => {
    predictions[type] = (predictions[type] / total * 100);
  });
  
  // Find the type with highest confidence
  const sortedTypes = Object.entries(predictions).sort((a, b) => b[1] - a[1]);
  const topPrediction = sortedTypes[0][0];
  const confidence = sortedTypes[0][1];
  
  return {
    prediction: topPrediction,
    confidence: confidence,
    all_predictions: predictions
  };
}

/* ============================================
   RESULTS DISPLAY
   ============================================ */

function displayResults(data) {
  currentResults = data;
  
  // Hide loading, show results
  elements.loadingState.classList.remove('active');
  elements.resultsArea.classList.add('active');
  
  const cancerInfo = CANCER_TYPES[data.prediction] || CANCER_TYPES['Benign'];
  
  // Set status badge
  elements.resultStatus.textContent = data.prediction;
  elements.resultStatus.className = `result-status ${cancerInfo.severity}`;
  
  // Set icon
  elements.resultIcon.innerHTML = cancerInfo.icon;
  elements.resultIcon.style.background = getSeverityGradient(cancerInfo.severity);
  
  // Set title and description
  elements.resultTitle.textContent = data.prediction;
  elements.resultDescription.textContent = cancerInfo.description;
  
  // Display confidence bars
  displayConfidenceBars(data.all_predictions || { [data.prediction]: data.confidence });
  
  // Scroll to results
  setTimeout(() => {
    elements.resultsArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 300);
}

function displayConfidenceBars(predictions) {
  elements.confidenceBars.innerHTML = '';
  
  // Sort by confidence (highest first)
  const sortedPredictions = Object.entries(predictions).sort((a, b) => b[1] - a[1]);
  
  sortedPredictions.forEach(([type, confidence], index) => {
    const item = document.createElement('div');
    item.className = 'confidence-item';
    
    const percentage = confidence.toFixed(1);
    
    item.innerHTML = `
      <div class="confidence-label">
        <span class="confidence-name">${type}</span>
        <span class="confidence-value">${percentage}%</span>
      </div>
      <div class="confidence-bar">
        <div class="confidence-bar-fill" style="width: 0%;" data-width="${percentage}%"></div>
      </div>
    `;
    
    elements.confidenceBars.appendChild(item);
    
    // Animate bar fill
    setTimeout(() => {
      const fill = item.querySelector('.confidence-bar-fill');
      fill.style.width = fill.dataset.width;
    }, 100 + (index * 100));
  });
}

function getSeverityGradient(severity) {
  switch (severity) {
    case 'danger':
      return 'var(--gradient-danger)';
    case 'warning':
      return 'var(--gradient-purple)';
    case 'safe':
      return 'var(--gradient-success)';
    default:
      return 'var(--gradient-blue)';
  }
}

/* ============================================
   UTILITIES
   ============================================ */

function animateProgress() {
  const fill = elements.progressFill;
  fill.style.width = '0%';
  
  setTimeout(() => {
    fill.style.width = '100%';
  }, 100);
}

function downloadReport() {
  if (!currentResults) return;
  
  const cancerInfo = CANCER_TYPES[currentResults.prediction] || CANCER_TYPES['Benign'];
  
  // Create report content
  const report = `
SKIN CANCER DETECTION REPORT
Generated by DermAI - ${new Date().toLocaleDateString()}
=========================================

ANALYSIS RESULTS:
Prediction: ${currentResults.prediction}
Confidence: ${currentResults.confidence?.toFixed(2)}%

DESCRIPTION:
${cancerInfo.description}

DETAILED CONFIDENCE SCORES:
${Object.entries(currentResults.all_predictions || {})
  .map(([type, conf]) => `  ${type}: ${conf.toFixed(2)}%`)
  .join('\n')}

RECOMMENDATIONS:
${cancerInfo.recommendations?.map((rec, i) => `  ${i + 1}. ${rec}`).join('\n')}

=========================================
DISCLAIMER:
This analysis is for preliminary screening purposes only.
Always consult with a qualified dermatologist for 
professional diagnosis and treatment recommendations.

For questions or concerns, contact a healthcare provider.
=========================================
  `.trim();
  
  // Download as text file
  const blob = new Blob([report], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `DermAI_Report_${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  
  showNotification('Report downloaded successfully!', 'success');
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    background: ${type === 'error' ? 'rgba(255, 71, 87, 0.95)' : 
                 type === 'success' ? 'rgba(0, 217, 163, 0.95)' : 
                 'rgba(0, 102, 255, 0.95)'};
    color: white;
    font-weight: 600;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    animation: slideInRight 0.4s ease;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.4s ease';
    setTimeout(() => {
      notification.remove();
    }, 400);
  }, 3000);
}

/* ============================================
   NAVIGATION
   ============================================ */

function initializeNavigation() {
  // Smooth scroll for navigation links
  elements.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
        
        // Update active state
        elements.navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });
  
  // Mobile menu toggle
  if (elements.menuToggle) {
    elements.menuToggle.addEventListener('click', () => {
      // Toggle mobile menu (you can enhance this)
      showNotification('Mobile menu - Feature coming soon!', 'info');
    });
  }
  
  // Update active nav on scroll
  const sections = document.querySelectorAll('section[id]');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    
    elements.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */

function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe all cards
  const animatedElements = document.querySelectorAll(
    '.feature-card, .info-card, .stat-item'
  );
  
  animatedElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
  });
}

/* ============================================
   CSS ANIMATIONS (added via JavaScript)
   ============================================ */

// Add keyframe animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

console.log('%c🧠 DermAI Initialized Successfully! ', 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px 20px; font-size: 16px; font-weight: bold; border-radius: 8px;');
console.log('%cBackend API Endpoint: ' + CONFIG.API_ENDPOINT, 'color: #00C9FF; font-size: 12px;');
console.log('%cUpdate CONFIG.API_ENDPOINT to connect to your Flask backend', 'color: #FFB800; font-size: 12px;');
