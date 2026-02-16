# 🚀 Quick Integration Reference - DenseNet121

## 3-Minute Setup

### 1. Place Your Model
```bash
# Create models folder
mkdir models

# Copy your DenseNet121 model
cp /path/to/your_model.h5 models/
```

### 2. Test Model First
```bash
python test_model.py
```
Follow the prompts and verify everything works!

### 3. Update backend.py

**Line 24-28:**
```python
CONFIG = {
    'MODEL_PATH': 'models/YOUR_MODEL.h5',  # ← Your model filename
    'IMAGE_SIZE': (224, 224),               # ← DenseNet121 standard
    'MAX_FILE_SIZE': 10 * 1024 * 1024,
    'ALLOWED_EXTENSIONS': {'png', 'jpg', 'jpeg'},
}
```

**Line 31-36:**
```python
CLASS_NAMES = [
    'Your_Class_1',   # ← Replace with your actual
    'Your_Class_2',   #    class names in order
    'Your_Class_3',
    # Match number of classes in your model
]
```

### 4. Run Everything

**Terminal 1 (Frontend - already running):**
```bash
npm start
```

**Terminal 2 (Backend):**
```bash
python backend.py
```

### 5. Test
Open: http://localhost:3000
Upload image → Analyze → See results!

---

## Common Model Configurations

### HAM10000 Dataset (7 classes)
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

### Binary Classification
```python
CLASS_NAMES = [
    'Benign',
    'Malignant'
]
```

### ISIC 2019 (8 classes)
```python
CLASS_NAMES = [
    'Melanoma',
    'Melanocytic Nevus',
    'Basal Cell Carcinoma',
    'Actinic Keratosis',
    'Benign Keratosis',
    'Dermatofibroma',
    'Vascular Lesion',
    'Squamous Cell Carcinoma'
]
```

---

## Troubleshooting (30 seconds)

| Issue | Solution |
|-------|----------|
| Model not found | Check path in CONFIG['MODEL_PATH'] |
| Wrong input size | Update CONFIG['IMAGE_SIZE'] to match model |
| Wrong predictions | Verify CLASS_NAMES order matches training |
| CORS error | Install: `pip install flask-cors` |
| Tensorflow error | Install: `pip install tensorflow` |

---

## Files to Modify

✅ **backend.py** (2 changes)
- Line 24: MODEL_PATH
- Line 31: CLASS_NAMES

✅ **src/components/Detection.jsx** (optional)
- Line 15-36: Update CANCER_TYPES if needed

---

## Verification Checklist

- [ ] Model file in `models/` folder
- [ ] `test_model.py` runs successfully
- [ ] CONFIG updated in backend.py
- [ ] CLASS_NAMES matches model output
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] Backend starts without errors
- [ ] Can upload and analyze images

---

## Need Help?

📖 Full guide: `DENSENET121_INTEGRATION.md`
🧪 Test script: `python test_model.py`
💡 Backend logs: Check terminal running `python backend.py`

---

**Your model is ready to go! Good luck with your presentation! 🎓**
