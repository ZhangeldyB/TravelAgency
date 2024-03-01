async function loginUser() {
    const form = document.getElementById('login-form');
    const errorDiv = document.getElementById('error-message');

    const formData = new FormData(form);
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      if (response.status === 200){
        const responseData = await response.json();
        if (responseData.message == 'admin') {
            window.location.href = '/admin';
        } else{
            window.location.href = '/travelagency';
        }
      } else if (response.status === 401) {
        errorDiv.textContent = 'Invalid username or password.';
        setTimeout(() => {
          errorDiv.textContent = '';
        }, 3000);
      }
    } catch (error) {
      console.error('Error during login:', error);
      errorDiv.textContent = 'An error occurred. Please try again.';
      setTimeout(() => {
        errorDiv.textContent = '';
      }, 3000);
    }
  }