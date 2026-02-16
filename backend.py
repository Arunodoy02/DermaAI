"""
DermAI Backend - Flask API for Skin Cancer Detection
Final Year Project - CNN Model Integration

This Flask backend receives skin lesion images from the frontend,
processes them through your trained CNN model, and returns predictions.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os
from datetime import datetime

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for frontend

# Configuration
CONFIG = {
    # Model path - UPDATE THIS to where your .keras file is located
    # Option 1: In MAJOR folder
    # 'MODEL_PATH': 'C:/Users/aruno/OneDrive/Desktop/MAJOR/best_densenet121_model.keras',
    # Option 2: In current directory
    # 'MODEL_PATH': './best_densenet121_model.keras',
    # Option 3: Specify your actual path here:
    'MODEL_PATH': 'best_densenet121_model.keras',  # Will check current directory
    
    'IMAGE_SIZE': (224, 224),  # DenseNet121 standard
    'MAX_FILE_SIZE': 10 * 1024 * 1024,  # 10MB
    'ALLOWED_EXTENSIONS': {'png', 'jpg', 'jpeg'},
}

# HAM10000 Dataset Class Names (7 classes)
# These MUST match the order from your training: df['dx'].unique()
# Update these to match your actual class order if different
CLASS_NAMES = [
    'akiec',  # Actinic Keratoses and Intraepithelial Carcinoma
    'bcc',    # Basal Cell Carcinoma
    'bkl',    # Benign Keratosis
    'df',     # Dermatofibroma
    'mel',    # Melanoma
    'nv',     # Melanocytic Nevi
    'vasc'    # Vascular Lesions
]

# Full names for display (maps short codes to readable names)
CLASS_DISPLAY_NAMES = {
    'akiec': 'Actinic Keratoses',
    'bcc': 'Basal Cell Carcinoma',
    'bkl': 'Benign Keratosis',
    'df': 'Dermatofibroma',
    'mel': 'Melanoma',
    'nv': 'Melanocytic Nevi',
    'vasc': 'Vascular Lesions'
}

# Additional information for each class
CLASS_INFO = {
    'mel': {
        'severity': 'high',
        'description': 'Melanoma - Most dangerous form of skin cancer',
        'action': 'Seek immediate medical attention from a dermatologist'
    },
    'bcc': {
        'severity': 'medium',
        'description': 'Basal Cell Carcinoma - Most common skin cancer',
        'action': 'Schedule appointment with dermatologist'
    },
    'akiec': {
        'severity': 'medium',
        'description': 'Actinic Keratoses - Precancerous lesion',
        'action': 'Consult dermatologist for treatment options'
    },
    'bkl': {
        'severity': 'low',
        'description': 'Benign Keratosis - Non-cancerous growth',
        'action': 'Monitor for changes, routine check-up recommended'
    },
    'nv': {
        'severity': 'low',
        'description': 'Melanocytic Nevi - Common mole, usually benign',
        'action': 'Monitor for changes in size, color, or shape'
    },
    'df': {
        'severity': 'low',
        'description': 'Dermatofibroma - Benign fibrous nodule',
        'action': 'Generally harmless, monitor if concerned'
    },
    'vasc': {
        'severity': 'low',
        'description': 'Vascular Lesions - Blood vessel related',
        'action': 'Usually benign, consult doctor if changing'
    }
}

# Load the trained model
def load_model():
    """Load the trained CNN model with proper error handling"""
    
    # Try multiple model paths - prioritize .h5 for TensorFlow 2.13
    model_paths = [
        'best_densenet121_model.h5',
        CONFIG['MODEL_PATH'],
        os.path.join(os.path.dirname(__file__), 'best_densenet121_model.h5'),
        'best_densenet121_model.keras',
        os.path.join(os.path.dirname(__file__), 'best_densenet121_model.keras'),
    ]
    
    for model_path in model_paths:
        if not os.path.exists(model_path):
            continue
            
        try:
            print(f"[INFO] Attempting to load model from: {model_path}")
            
            # Load model without compile (simpler approach for TF 2.13)
            model = tf.keras.models.load_model(model_path, compile=False)
            
            # Recompile the model with appropriate loss and metrics
            model.compile(
                optimizer='adam',
                loss='categorical_crossentropy',
                metrics=['accuracy']
            )
            
            print(f"[OK] SUCCESS! Model loaded from {model_path}")
            print(f"[OK] Model input shape: {model.input_shape}")
            print(f"[OK] Model output shape: {model.output_shape}")
            return model
            
        except Exception as e:
            print(f"[WARNING] Failed to load from {model_path}: {str(e)[:80]}")
            continue
    
    # If all attempts failed
    print(f"[WARNING] Could not load model from any location")
    print("[INFO] The API will run in DEMO MODE")
    print("[INFO] To use real predictions, ensure model file is present:")
    print("       - best_densenet121_model.h5 or")
    print("       - best_densenet121_model.keras")
    return None

# Initialize model
model = load_model()

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in CONFIG['ALLOWED_EXTENSIONS']

def preprocess_image(image_file):
    """
    Preprocess image EXACTLY as in your training code
    
    Your training uses:
    1. Resize to 224x224
    2. Keep values in [0, 255] range (NOT normalized to [0,1])
    3. Apply tf.keras.applications.densenet.preprocess_input
    
    Args:
        image_file: File object from request
        
    Returns:
        Preprocessed numpy array ready for model
    """
    try:
        # Read image
        image = Image.open(io.BytesIO(image_file.read()))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize to 224x224 (DenseNet121 input size)
        image = image.resize(CONFIG['IMAGE_SIZE'])
        
        # Convert to numpy array
        image_array = np.array(image, dtype='float32')
        
        # IMPORTANT: Do NOT divide by 255 here!
        # Your training code keeps values in [0, 255] range
        # and applies preprocess_input which expects this range
        
        # Add batch dimension: (224, 224, 3) -> (1, 224, 224, 3)
        image_array = np.expand_dims(image_array, axis=0)
        
        # Apply DenseNet preprocessing (this is what your training code does)
        from tensorflow.keras.applications.densenet import preprocess_input
        image_array = preprocess_input(image_array)
        
        print(f"[OK] Image preprocessed - Shape: {image_array.shape}, Range: [{image_array.min():.3f}, {image_array.max():.3f}]")
        
        return image_array
    
    except Exception as e:
        raise ValueError(f"Error preprocessing image: {str(e)}")

def generate_demo_predictions():
    """
    Generate realistic demo predictions when model is not available
    Used for testing frontend without trained model
    """
    # Generate random probabilities
    predictions = np.random.dirichlet(np.ones(len(CLASS_NAMES)))
    
    # Make one class more dominant
    dominant_idx = np.random.randint(0, len(CLASS_NAMES))
    predictions[dominant_idx] += 0.3
    
    # Re-normalize
    predictions = predictions / predictions.sum()
    
    return predictions

@app.route('/', methods=['GET'])
def home():
    """Health check endpoint"""
    return jsonify({
        'status': 'online',
        'service': 'DermAI Backend API',
        'version': '1.0.0',
        'model_loaded': model is not None,
        'endpoints': {
            'predict': '/predict [POST]',
            'health': '/ [GET]'
        }
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Main prediction endpoint
    
    Expects:
        - multipart/form-data with 'file' field containing image
        
    Returns:
        JSON with prediction results
    """
    try:
        print("[DEBUG] Predict endpoint called - Request received!")
        print(f"[DEBUG] Request files: {request.files}")
        print(f"[DEBUG] Request method: {request.method}")
        
        # Check if file is in request
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Validate file type
        if not allowed_file(file.filename):
            return jsonify({
                'error': f'Invalid file type. Allowed: {", ".join(CONFIG["ALLOWED_EXTENSIONS"])}'
            }), 400
        
        # Preprocess image
        try:
            image_array = preprocess_image(file)
        except ValueError as e:
            return jsonify({'error': str(e)}), 400
        
        # Make prediction
        if model is not None:
            # Use actual model
            predictions = model.predict(image_array, verbose=0)[0]
        else:
            # Use demo mode
            predictions = generate_demo_predictions()
        
        # Get top prediction
        top_index = np.argmax(predictions)
        top_prediction = CLASS_NAMES[top_index]  # Short code like 'mel'
        top_display_name = CLASS_DISPLAY_NAMES.get(top_prediction, top_prediction)  # Full name
        top_confidence = float(predictions[top_index] * 100)
        
        # Prepare all predictions with both short codes and display names
        all_predictions = {
            CLASS_DISPLAY_NAMES.get(CLASS_NAMES[i], CLASS_NAMES[i]): float(predictions[i] * 100)
            for i in range(len(CLASS_NAMES))
        }
        
        # Get additional info
        class_details = CLASS_INFO.get(top_prediction, {})
        
        # Log prediction
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"[{timestamp}] Prediction: {top_display_name} ({top_confidence:.2f}%)")
        
        # Return response
        return jsonify({
            'prediction': top_display_name,  # Use display name for frontend
            'prediction_code': top_prediction,  # Include short code too
            'confidence': round(top_confidence, 2),
            'all_predictions': {k: round(v, 2) for k, v in all_predictions.items()},
            'severity': class_details.get('severity', 'unknown'),
            'description': class_details.get('description', ''),
            'recommended_action': class_details.get('action', ''),
            'timestamp': timestamp,
            'model_version': '1.0.0'
        })
    
    except Exception as e:
        # Log error
        print(f"[ERROR] Error in prediction: {str(e)}")
        
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Detailed health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'model_path': CONFIG['MODEL_PATH'],
        'supported_classes': CLASS_NAMES,
        'image_size': CONFIG['IMAGE_SIZE'],
        'max_file_size': f"{CONFIG['MAX_FILE_SIZE'] / (1024*1024):.0f}MB"
    })

@app.errorhandler(413)
def request_entity_too_large(error):
    """Handle file too large error"""
    return jsonify({
        'error': 'File too large',
        'max_size': f"{CONFIG['MAX_FILE_SIZE'] / (1024*1024):.0f}MB"
    }), 413

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("=" * 60)
    print("DermAI Backend Starting...")
    print("=" * 60)
    print(f"Model Path: {CONFIG['MODEL_PATH']}")
    print(f"Classes: {len(CLASS_NAMES)} - {', '.join(CLASS_NAMES)}")
    print(f"Image Size: {CONFIG['IMAGE_SIZE']}")
    print(f"Model Status: {'Loaded' if model else 'Demo Mode'}")
    print("=" * 60)
    print("Server running on http://localhost:5000")
    print("API Endpoint: http://localhost:5000/predict")
    print("=" * 60)
    
    # Run Flask app
    # For production, use a proper WSGI server like gunicorn
    app.run(
        host='0.0.0.0',  # Makes it accessible from other devices
        port=5000,
        debug=True,  # Set to False in production
        load_dotenv=False  # Disable dotenv loading to avoid import issues
    )
