# DenseNet121 Model Integration Guide

## 🎯 Complete Step-by-Step Integration

### Step 1: Prepare Your Model File

Place your trained DenseNet121 model in the project:

```bash
# Create models directory
mkdir models

# Copy your model file
# For example: skin_cancer_densenet121.h5 or .keras
```

**Supported formats:**
- `.h5` (HDF5 format)
- `.keras` (Keras 3.0 format)
- SavedModel directory

---

### Step 2: Update Backend Configuration

Open `backend.py` and update these lines:

#### A. Model Path (Line 24)
```python
CONFIG = {
    'MODEL_PATH': 'models/your_densenet121_model.h5',  # ← Update this
    'IMAGE_SIZE': (224, 224),  # DenseNet121 standard input
    'MAX_FILE_SIZE': 10 * 1024 * 1024,
    'ALLOWED_EXTENSIONS': {'png', 'jpg', 'jpeg'},
}
```

#### B. Class Names (Line 31-36)
**IMPORTANT:** Update to match YOUR model's output classes in the EXACT order:

```python
CLASS_NAMES = [
    'Class_0_Name',  # Replace with your actual class names
    'Class_1_Name',  # in the order your model was trained
    'Class_2_Name',
    'Class_3_Name',
    # Add or remove based on your number of classes
]
```

**Example for 7-class skin cancer model:**
```python
CLASS_NAMES = [
    'Actinic Keratoses',
    'Basal Cell Carcinoma',
    'Benign Keratosis',
    'Dermatofibroma',
    'Melanoma',
    'Melanocytic Nevi',
    'Vascular Lesions'
]
```

**Example for 2-class model:**
```python
CLASS_NAMES = [
    'Benign',
    'Malignant'
]
```

---

### Step 3: Verify Preprocessing

The `backend.py` is now DenseNet121-ready with:
- ✅ Input size: 224x224
- ✅ RGB conversion
- ✅ Normalization: /255.0 (default)

**If your model was trained with different preprocessing:**

#### Option A: ImageNet preprocessing
Uncomment lines 114-115 in `backend.py`:
```python
from tensorflow.keras.applications.densenet import preprocess_input
image_array = preprocess_input(image_array)
```

#### Option B: Custom normalization
If you used custom normalization during training:
```python
# Replace line 110 with your normalization
# Example: Mean/Std normalization
mean = np.array([0.485, 0.456, 0.406])
std = np.array([0.229, 0.224, 0.225])
image_array = (image_array - mean) / std
```

---

### Step 4: Update Frontend Class Names

If you changed the class names in backend, update the frontend too:

**File:** `src/components/Detection.jsx` (Lines 15-36)

```javascript
const CANCER_TYPES = {
    'Your_Class_1': {
        icon: '⚠️',
        description: 'Description here',
        severity: 'danger'  // or 'warning' or 'safe'
    },
    'Your_Class_2': {
        icon: '🔵',
        description: 'Description here',
        severity: 'warning'
    },
    // Add all your classes
};
```

---

### Step 5: Install Dependencies

```bash
pip install -r requirements.txt
```

**Required packages:**
- tensorflow (or tensorflow-cpu)
- flask
- flask-cors
- pillow
- numpy

If you have GPU:
```bash
pip install tensorflow-gpu
```

---

### Step 6: Test Model Loading

Before running the full backend, test if your model loads:

```python
# test_model.py
import tensorflow as tf

model_path = 'models/your_model.h5'
model = tf.keras.models.load_model(model_path)

print("✓ Model loaded successfully!")
print(f"Input shape: {model.input_shape}")
print(f"Output shape: {model.output_shape}")
print(f"Number of classes: {model.output_shape[-1]}")

# Test with dummy data
import numpy as np
dummy_input = np.random.rand(1, 224, 224, 3).astype('float32')
prediction = model.predict(dummy_input)
print(f"Prediction shape: {prediction.shape}")
print(f"Sample output: {prediction[0]}")
```

Run:
```bash
python test_model.py
```

---

### Step 7: Run Backend

Open a **new terminal** (keep React running):

```bash
python backend.py
```

**Expected output:**
```
============================================================
🧠 DermAI Backend Starting...
============================================================
📦 Model Path: models/your_densenet121_model.h5
🎯 Classes: 4 - Class1, Class2, Class3, Class4
📐 Image Size: (224, 224)
✅ Model loaded successfully from models/your_densenet121_model.h5
============================================================
🚀 Server running on http://localhost:5000
📍 API Endpoint: http://localhost:5000/predict
============================================================
```

---

### Step 8: Test Full Integration

1. **Frontend running:** `npm start` (already running ✓)
2. **Backend running:** `python backend.py` (new terminal)
3. **Open browser:** http://localhost:3000
4. **Upload test image**
5. **Check results!**

---

## 🔧 Common Issues & Solutions

### Issue 1: "Model not found"
```
❌ Error: Model not found at models/your_model.h5
```

**Solution:**
- Check model path is correct
- Verify file exists: `ls models/` or `dir models\`
- Use absolute path if needed

### Issue 2: "Input shape mismatch"
```
❌ Error: expected input shape (None, 224, 224, 3), got (None, 299, 299, 3)
```

**Solution:**
Update `CONFIG['IMAGE_SIZE']` to match your model:
```python
'IMAGE_SIZE': (299, 299),  # If your model uses 299x299
```

### Issue 3: "Wrong number of classes"
```
❌ Error: model predicts 7 classes but CLASS_NAMES has 4
```

**Solution:**
Update `CLASS_NAMES` to match your model's output classes.

### Issue 4: "CORS Error" in browser console
```
❌ Access to fetch at 'http://localhost:5000/predict' blocked by CORS
```

**Solution:**
- Ensure `flask-cors` is installed: `pip install flask-cors`
- Verify `CORS(app)` is in `backend.py` (line 10)

### Issue 5: Predictions are always random
**Solution:**
Backend might be in demo mode. Check terminal for:
```
⚠️ Warning: Model not found at models/...
💡 The API will run in demo mode
```
Fix the model path in CONFIG.

---

## 📊 Model Information Checklist

Before running, ensure you know:

- [ ] **Model file location:** `models/your_model.h5`
- [ ] **Input size:** Usually 224x224 for DenseNet121
- [ ] **Number of classes:** How many outputs?
- [ ] **Class names:** In correct order
- [ ] **Normalization used:** /255.0 or preprocess_input?
- [ ] **Color mode:** RGB (not grayscale)

---

## 🧪 Quick Test Script

Save as `test_integration.py`:

```python
import requests
import json

# Test if backend is running
try:
    response = requests.get('http://localhost:5000/')
    print("✓ Backend is online")
    print(json.dumps(response.json(), indent=2))
except:
    print("❌ Backend is not running. Start with: python backend.py")

# Test health check
try:
    response = requests.get('http://localhost:5000/health')
    print("\n✓ Health check:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"❌ Health check failed: {e}")
```

Run: `python test_integration.py`

---

## 📝 Example: Complete Configuration

Here's a complete example for a 7-class skin cancer DenseNet121 model:

```python
# backend.py configuration
CONFIG = {
    'MODEL_PATH': 'models/densenet121_skin_cancer.h5',
    'IMAGE_SIZE': (224, 224),
    'MAX_FILE_SIZE': 10 * 1024 * 1024,
    'ALLOWED_EXTENSIONS': {'png', 'jpg', 'jpeg'},
}

CLASS_NAMES = [
    'Actinic Keratoses',
    'Basal Cell Carcinoma',
    'Benign Keratosis',
    'Dermatofibroma',
    'Melanoma',
    'Melanocytic Nevi',
    'Vascular Lesions'
]
```

---

## ✅ Final Checklist

Before presenting:

- [ ] Model loads without errors
- [ ] Backend returns predictions (not demo mode)
- [ ] Frontend displays results correctly
- [ ] Class names match between frontend/backend
- [ ] Test with multiple sample images
- [ ] Download report feature works
- [ ] Mobile responsive design works
- [ ] Confidence bars display correctly

---

## 🎓 For Your Presentation

**Talking Points:**
1. "We trained a DenseNet121 model with X classes"
2. "The model achieves Y accuracy on our test set"
3. "Images are preprocessed to 224x224 RGB"
4. "Backend uses Flask for API, Frontend uses React"
5. "Real-time prediction with confidence scores"

**Demo Flow:**
1. Show the trained model file
2. Explain the architecture (DenseNet121)
3. Upload sample image
4. Show loading state
5. Display results with confidence
6. Download report
7. Try different images

---

Need help with any specific step? Let me know! 🚀
