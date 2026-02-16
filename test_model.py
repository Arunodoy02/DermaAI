"""
Quick test script to verify your DenseNet121 model can be loaded
Run this before starting the backend to catch any issues early
"""

import os
import sys

print("=" * 60)
print("🧪 DenseNet121 Model Integration Test")
print("=" * 60)

# Step 1: Check if TensorFlow is installed
print("\n1️⃣ Checking TensorFlow installation...")
try:
    import tensorflow as tf
    print(f"   ✓ TensorFlow version: {tf.__version__}")
except ImportError:
    print("   ❌ TensorFlow not installed!")
    print("   Install with: pip install tensorflow")
    sys.exit(1)

# Step 2: Check if other dependencies are installed
print("\n2️⃣ Checking other dependencies...")
try:
    import numpy as np
    from PIL import Image
    import flask
    from flask_cors import CORS
    print(f"   ✓ NumPy version: {np.__version__}")
    print(f"   ✓ Pillow version: {Image.__version__}")
    print(f"   ✓ Flask version: {flask.__version__}")
    print("   ✓ Flask-CORS installed")
except ImportError as e:
    print(f"   ❌ Missing dependency: {e}")
    print("   Install with: pip install -r requirements.txt")
    sys.exit(1)

# Step 3: Check model file
print("\n3️⃣ Checking model file...")
model_path = input("   Enter your model path (e.g., models/my_model.h5): ").strip()

if not model_path:
    model_path = "models/skin_cancer_model.h5"
    print(f"   Using default: {model_path}")

if not os.path.exists(model_path):
    print(f"   ❌ Model file not found: {model_path}")
    print(f"   Current directory: {os.getcwd()}")
    print(f"   Files in models/: {os.listdir('models') if os.path.exists('models') else 'models/ directory not found'}")
    sys.exit(1)

print(f"   ✓ Model file found: {model_path}")
print(f"   File size: {os.path.getsize(model_path) / (1024*1024):.2f} MB")

# Step 4: Load model
print("\n4️⃣ Loading model...")
try:
    model = tf.keras.models.load_model(model_path, compile=False)
    print("   ✓ Model loaded successfully!")
except Exception as e:
    print(f"   ❌ Error loading model: {e}")
    sys.exit(1)

# Step 5: Check model architecture
print("\n5️⃣ Model Information:")
print(f"   Input shape: {model.input_shape}")
print(f"   Output shape: {model.output_shape}")
print(f"   Number of classes: {model.output_shape[-1]}")
print(f"   Total parameters: {model.count_params():,}")

expected_input = model.input_shape[1:3]
if expected_input != (224, 224):
    print(f"   ⚠️  WARNING: Input size is {expected_input}, not (224, 224)")
    print(f"   Update CONFIG['IMAGE_SIZE'] in backend.py to {expected_input}")

# Step 6: Test prediction with dummy data
print("\n6️⃣ Testing prediction with dummy data...")
try:
    import numpy as np
    dummy_input = np.random.rand(1, *model.input_shape[1:]).astype('float32')
    prediction = model.predict(dummy_input, verbose=0)
    print(f"   ✓ Prediction successful!")
    print(f"   Output shape: {prediction.shape}")
    print(f"   Sample probabilities: {prediction[0]}")
    print(f"   Sum of probabilities: {prediction[0].sum():.4f}")
    
    if abs(prediction[0].sum() - 1.0) < 0.01:
        print("   ✓ Probabilities sum to ~1.0 (softmax output)")
    else:
        print("   ⚠️  Probabilities don't sum to 1.0 - check if model has softmax activation")
        
except Exception as e:
    print(f"   ❌ Prediction failed: {e}")
    sys.exit(1)

# Step 7: Class names check
print("\n7️⃣ Class Names Configuration:")
num_classes = model.output_shape[-1]
print(f"   Your model predicts {num_classes} classes")
print(f"   Make sure CLASS_NAMES in backend.py has exactly {num_classes} entries")
print("\n   Example:")
print("   CLASS_NAMES = [")
for i in range(num_classes):
    print(f"       'Class_{i}_Name',  # Replace with actual class name")
print("   ]")

# Summary
print("\n" + "=" * 60)
print("✅ ALL CHECKS PASSED!")
print("=" * 60)
print("\n📋 Next Steps:")
print("   1. Update backend.py:")
print(f"      - CONFIG['MODEL_PATH'] = '{model_path}'")
print(f"      - CONFIG['IMAGE_SIZE'] = {expected_input}")
print(f"      - CLASS_NAMES = [...] ({num_classes} classes)")
print("   2. Run backend: python backend.py")
print("   3. Test on http://localhost:3000")
print("\n🎉 Your DenseNet121 model is ready to integrate!")
print("=" * 60)
