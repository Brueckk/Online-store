// client/js/auth.js
async function login(username, password) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      alert('Login successful');
    } else {
      alert('Login failed');
    }
  }
  