// PASTE THIS IN BROWSER CONSOLE (F12 → Console tab)
// This will test if the backend is reachable

async function testConnection() {
    console.log('====================================');
    console.log('🧪 TESTING BACKEND CONNECTION');
    console.log('====================================');

    // Test 1: Check if backend is running
    console.log('\n1️⃣ Testing /health endpoint...');
    try {
        const health = await fetch('http://localhost:5000/health');
        const healthData = await health.json();
        console.log('✅ Backend is running!');
        console.log('Health data:', healthData);
    } catch (error) {
        console.error('❌ Backend not reachable:', error);
        console.error('Make sure python backend.py is running!');
        return;
    }

    // Test 2: Test CORS
    console.log('\n2️⃣ Testing CORS...');
    try {
        const corsTest = await fetch('http://localhost:5000/', {
            method: 'GET',
            headers: {
                'Origin': 'http://localhost:3000'
            }
        });
        console.log('✅ CORS is working!');
    } catch (error) {
        console.error('❌ CORS error:', error);
    }

    // Test 3: Try to upload a dummy image
    console.log('\n3️⃣ Testing image upload...');
    try {
        // Create a tiny test image
        const canvas = document.createElement('canvas');
        canvas.width = 10;
        canvas.height = 10;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, 10, 10);

        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        console.log('Created test image:', blob.size, 'bytes');

        const formData = new FormData();
        formData.append('file', blob, 'test.png');

        console.log('Sending POST to http://localhost:5000/predict...');
        const response = await fetch('http://localhost:5000/predict', {
            method: 'POST',
            body: formData
        });

        console.log('Response status:', response.status, response.statusText);

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Upload works! Response:', data);
        } else {
            const errorText = await response.text();
            console.error('❌ Upload failed:', errorText);
        }
    } catch (error) {
        console.error('❌ Upload test failed:', error);
        console.error('Error details:', error.message);
    }

    console.log('\n====================================');
    console.log('TEST COMPLETE!');
    console.log('====================================');
}

// Run the test
testConnection();
