const testBackendConnection = async () => {
    try {
        console.log('Testing backend connection...');

        // Test 1: Health check
        const healthResponse = await fetch('http://localhost:5000/health');
        const healthData = await healthResponse.json();
        console.log('✅ Health check:', healthData);

        // Test 2: Register endpoint
        const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: `test${Date.now()}@example.com`,
                password: 'test12345'
            })
        });

        console.log('Register status:', registerResponse.status);
        const registerData = await registerResponse.json();
        console.log('✅ Register response:', registerData);

        if (registerData.token) {
            console.log('✅ Registration successful! Token received.');

            // Test 3: Login endpoint
            const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: `test${Date.now() - 1000}@example.com`,
                    password: 'wrongpassword'
                })
            });

            console.log('Login test status:', loginResponse.status);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    }
};

testBackendConnection();
