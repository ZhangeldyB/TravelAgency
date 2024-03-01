async function registerUser() {
    const form = document.getElementById('registration-form');
    const errorDiv = document.getElementById('error-message');

    const formData = new FormData(form);
    try {
      const response = await fetch('/main', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      if (response.status === 200) {
        window.location.href = '/travelagency';
      } else if (response.status === 400) {
        errorDiv.textContent = 'Credentials are wrong.';
        setTimeout(() => {
          errorDiv.textContent = '';
        }, 3000);
        location.reload();
      }
    } catch (error) {
      console.error('Error during registration:', error);
      errorDiv.textContent = 'An error occurred. Please try again.';
      setTimeout(() => {
        errorDiv.textContent = '';
      }, 3000);
    }
  }