// In-memory user storage (persists until page refresh)
        let users = {
            "admin": { "password": "admin123", "role": "admin" },
            "cashier": { "password": "cashier123", "role": "cashier" }
        };

        function toggleToSignup() {
            const loginForm = document.getElementById('loginForm');
            const signupForm = document.getElementById('signupForm');
            const imageContainer = document.getElementById('imageContainer');
            const formContainer = document.getElementById('formContainer');

            loginForm.classList.add('form-hidden');
            signupForm.classList.add('form-hidden');

            setTimeout(() => {
                loginForm.style.display = "none";
                signupForm.style.display = "block";
                imageContainer.classList.add('image-right');
                formContainer.classList.add('form-left');
                loginForm.classList.remove('form-hidden');
                signupForm.classList.remove('form-hidden');
                window.history.pushState({}, 'Signup', '/signup/');
            }, 300);
        }

        function toggleToLogin() {
            const loginForm = document.getElementById('loginForm');
            const signupForm = document.getElementById('signupForm');
            const imageContainer = document.getElementById('imageContainer');
            const formContainer = document.getElementById('formContainer');

            loginForm.classList.add('form-hidden');
            signupForm.classList.add('form-hidden');

            setTimeout(() => {
                loginForm.style.display = "block";
                signupForm.style.display = "none";
                imageContainer.classList.remove('image-right');
                formContainer.classList.remove('form-left');
                loginForm.classList.remove('form-hidden');
                signupForm.classList.remove('form-hidden');
                window.history.pushState({}, 'Login', '/');
            }, 300);
        }

        // Set initial form visibility based on URL
        document.addEventListener('DOMContentLoaded', () => {
            const path = window.location.pathname;
            if (path === '/signup/') {
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('signupForm').style.display = 'block';
                document.getElementById('imageContainer').classList.add('image-right');
                document.getElementById('formContainer').classList.add('form-left');
            } else {
                document.getElementById('loginForm').style.display = 'block';
                document.getElementById('signupForm').style.display = 'none';
            }
        });

        document.getElementById('loginForm').addEventListener('submit', async function (event) {
            event.preventDefault();

            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            const role = document.getElementById('loginRole').value;

            if (!username || !password || !role) {
                alert('Please fill in all fields.');
                return;
            }

            try {
                const response = await fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password, role })
                });

                if (response.redirected) {
                    window.location.href = response.url;
                } else {
                    const data = await response.json();
                    alert(data.detail || 'Login failed.');
                }
            } catch (err) {
                alert('Error logging in: ' + err.message);
            }
        });


        document.getElementById('signupForm').addEventListener('submit', function (event) {
            event.preventDefault();
            const username = document.getElementById('signupUsername').value;
            const password = document.getElementById('signupPassword').value;
            const role = document.getElementById('signupRole').value;

            if (!username || !password || !role) {
                alert('Please fill in all fields.');
                return;
            }

            if (users[username]) {
                alert('Username already exists!');
                return;
            }

            // Add new user to in-memory storage
            users[username] = { password: password, role: role };
            alert('Signup successful! Please login with your new credentials.');
            toggleToLogin();
        });