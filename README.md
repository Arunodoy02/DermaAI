# DermAI - React Application 🧠

Professional React application for AI-powered skin cancer detection using Convolutional Neural Networks (CNN).

## 🚀 Features

### React Architecture
- **Component-Based Design** - Modular, reusable React components
- **State Management** - React Hooks (useState, useRef, useEffect)
- **Responsive UI** - Mobile-first, fully responsive design
- **Modern JavaScript** - ES6+ features, arrow functions, async/await

### Application Features
- ✨ Professional medical-grade UI with glassmorphism effects
- 📸 Drag & drop file upload with preview
- 🔄 Real-time analysis with loading states
- 📊 Animated confidence score visualization
- 💾 Downloadable analysis reports
- 🎯 Backend API integration (Flask/FastAPI)
- 🎨 CSS custom properties for easy theming
- 📱Full mobile responsiveness

## 📁 Project Structure

```
webpage/
├── public/
│   ├── index.html          # Main HTML template
│   ├── manifest.json       # PWA manifest
│   └── favicon.ico         # App icon
├── src/
│   ├── components/
│   │   ├── Navbar.jsx      # Navigation with scroll tracking
│   │   ├── Hero.jsx        # Hero section with stats
│   │   ├── Features.jsx    # Features grid
│   │   ├── Detection.jsx   # Main upload & analysis component
│   │   ├── InfoSection.jsx # Educational content
│   │   └── Footer.jsx      # Footer with links
│   ├── App.js              # Main App component
│   ├── App.css             # All application styles
│   ├── index.js            # React entry point
│   └── index.css           # Global resets
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Modern web browser

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm start
```

The application will open at `http://localhost:3000`

### Step 3: Build for Production
```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## 🔌 Backend Integration

### Update API Endpoint

In `src/components/Detection.jsx`, update line 9:

```javascript
const API_ENDPOINT = 'http://your-backend-url:5000/predict';
```

### Flask Backend Example

Create a Flask backend (already provided in `backend.py`):

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf

app = Flask(__name__)
CORS(app)

# Load your model
model = tf.keras.models.load_model('your_model.h5')

@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['file']
    # Process image and return predictions
    return jsonify({
        'prediction': 'Melanoma',
        'confidence': 87.5,
        'all_predictions': { ... }
    })

if __name__ == '__main__':
    app.run(port=5000)
```

### Install Backend Dependencies
```bash
pip install -r requirements.txt
```

### Run Backend
```bash
python backend.py
```

## 🎨 Customization

### Change Colors

Edit CSS variables in `src/App.css` (lines 7-60):

```css
:root {
  --primary-blue: #0066FF;
  --primary-cyan: #00C9FF;
  --success-green: #00D9A3;
  /* ... more variables */
}
```

### Add New Features

Create a new component:

```javascript
// src/components/YourComponent.jsx
import React from 'react';

const YourComponent = () => {
  return (
    <div className="your-component">
      {/* Your content */}
    </div>
  );
};

export default YourComponent;
```

Import in `App.js`:

```javascript
import YourComponent from './components/YourComponent';

function App() {
  return (
    <div className="App">
      {/* ... other components */}
      <YourComponent />
    </div>
  );
}
```

## 📦 Available Scripts

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload when you make changes.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## 🌐 Deployment

### Deploy to Netlify
1. Build your app: `npm run build`
2. Drag and drop the `build` folder to [Netlify](https://www.netlify.com/)
3. Your app is live!

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to GitHub Pages
1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json:
```json
"homepage": "https://yourusername.github.io/your-repo",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

3. Deploy:
```bash
npm run deploy
```

## 🧪 Testing

### Component Testing
```javascript
import { render, screen } from '@testing-library/react';
import Hero from './components/Hero';

test('renders hero title', () => {
  render(<Hero />);
  const linkElement = screen.getByText(/Early Detection Saves Lives/i);
  expect(linkElement).toBeInTheDocument();
});
```

Run tests:
```bash
npm test
```

## 📊 Performance Optimization

### Code Splitting
React automatically code-splits at the route level with lazy loading:

```javascript
import React, { lazy, Suspense } from 'react';

const Detection = lazy(() => import('./components/Detection'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Detection />
    </Suspense>
  );
}
```

### Image Optimization
- Use WebP format for images
- Lazy load images below the fold
- Optimize images with tools like ImageOptim

## 🔐 Security Best Practices

- ✅ Input validation on file uploads
- ✅ File size and type restrictions
- ✅ CORS configuration in backend
- ✅ HTTPS in production
- ✅ Environment variables for API keys

## 📱 Progressive Web App (PWA)

The app is PWA-ready. To enable offline functionality:

1. Modify `src/index.js`:
```javascript
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Change from
serviceWorkerRegistration.unregister();

// To
serviceWorkerRegistration.register();
```

2. Users can now install the app and use it offline!

## 🎓 For Your Presentation

### Technical Highlights:
- ✨ **Modern Stack**: React 19, Hooks, Functional Components
- 🎨 **Professional UI**: Glassmorphism, gradients, animations
- 🔄 **State Management**: useState, useRef, useEffect hooks
- 📦 **Component Architecture**: Modular, reusable components
- 🚀 **Performance**: Code splitting, optimized builds
- 📱 **Responsive**: Mobile-first design approach

### Demo Flow:
1. Show component structure in VS Code
2. Demonstrate state management with React DevTools
3. Upload sample image and show real-time state updates
4. Show responsive design on different devices
5. Explain backend integration points
6. Show production build size and optimization

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill
```

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
Ensure Flask backend has CORS enabled:
```python
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
```

## 📚 Learn More

- [React Documentation](https://react.dev/)
- [Create React App Documentation](https://create-react-app.dev/)
- [React Hooks](https://react.dev/reference/react)
- [TensorFlow.js](https://www.tensorflow.org/js) - For client-side ML

## 👥 Contributing

This is a final year project. For educational purposes:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

Academic project for educational purposes.

## 🙏 Acknowledgments

- Built with Create React App
- Icons from Font Awesome
- Fonts from Google Fonts
- Inspired by modern medical applications

---

**Built with ❤️ using React for advancing early skin cancer detection**

*Medical Disclaimer: This tool is for educational and preliminary screening purposes only. Always consult qualified medical professionals for diagnosis and treatment.*
