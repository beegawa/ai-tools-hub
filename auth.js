// AI Tools Hub - Authentication JavaScript

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isLoading = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFormValidation();
        this.setupPasswordStrength();
        this.checkExistingAuth();
        this.setupFormSwitching();
    }

    // Check if user is already logged in
    checkExistingAuth() {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (token && user) {
            // Redirect to main page if already logged in
            window.location.href = 'index.html';
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // Form switching
        const switchToRegister = document.getElementById('switchToRegister');
        const switchToLogin = document.getElementById('switchToLogin');

        if (switchToRegister) {
            switchToRegister.addEventListener('click', (e) => {
                e.preventDefault();
                this.showRegisterForm();
            });
        }

        if (switchToLogin) {
            switchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginForm();
            });
        }

        // Social login buttons (placeholder)
        this.setupSocialLogin();

        // Remember me functionality
        this.setupRememberMe();

        // Forgot password
        this.setupForgotPassword();
    }

    // Form switching
    setupFormSwitching() {
        const loginCard = document.querySelector('.auth-card:first-child');
        const registerCard = document.getElementById('registerCard');

        if (!loginCard || !registerCard) return;

        // Initially show login form
        this.showLoginForm();
    }

    showLoginForm() {
        const loginCard = document.querySelector('.auth-card:first-child');
        const registerCard = document.getElementById('registerCard');

        if (loginCard && registerCard) {
            loginCard.style.display = 'block';
            registerCard.style.display = 'none';
        }
    }

    showRegisterForm() {
        const loginCard = document.querySelector('.auth-card:first-child');
        const registerCard = document.getElementById('registerCard');

        if (loginCard && registerCard) {
            loginCard.style.display = 'none';
            registerCard.style.display = 'block';
        }
    }

    // Login handler
    async handleLogin() {
        if (this.isLoading) return;

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Validate inputs
        if (!this.validateEmail(email)) {
            this.showError('email', '올바른 이메일 주소를 입력해주세요.');
            return;
        }

        if (!password) {
            this.showError('password', '비밀번호를 입력해주세요.');
            return;
        }

        this.setLoading(true);
        this.clearErrors();

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Store auth data
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Handle remember me
                if (document.getElementById('rememberMe')?.checked) {
                    localStorage.setItem('rememberMe', 'true');
                    localStorage.setItem('rememberedEmail', email);
                }

                this.showSuccess('로그인 성공! 메인 페이지로 이동합니다...');

                // Redirect after short delay
                setTimeout(() => {
                    const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || 'index.html';
                    window.location.href = redirectUrl;
                }, 1500);

            } else {
                this.showAlert(data.error || '로그인에 실패했습니다.', 'error');

                // Show specific field errors
                if (data.field) {
                    this.showError(data.field, data.error);
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showAlert('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    // Register handler
    async handleRegister() {
        if (this.isLoading) return;

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;

        // Validate inputs
        const validation = this.validateRegistrationForm(name, email, password);
        if (!validation.isValid) {
            validation.errors.forEach(error => {
                this.showError(error.field, error.message);
            });
            return;
        }

        this.setLoading(true);
        this.clearErrors();

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Store auth data
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                this.showSuccess('회원가입 성공! 메인 페이지로 이동합니다...');

                // Redirect after short delay
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);

            } else {
                this.showAlert(data.error || '회원가입에 실패했습니다.', 'error');

                // Show specific field errors
                if (data.field) {
                    this.showError(data.field, data.error);
                }
            }
        } catch (error) {
            console.error('Register error:', error);
            this.showAlert('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    // Form validation
    setupFormValidation() {
        // Real-time validation
        const inputs = document.querySelectorAll('input[type="email"], input[type="password"], input[type="text"]');

        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearFieldError(input);

                // Real-time password strength check
                if (input.type === 'password' && input.id.includes('Password')) {
                    this.updatePasswordStrength(input);
                }
            });
        });
    }

    validateField(input) {
        const value = input.value.trim();
        const fieldName = input.id;

        switch (input.type) {
            case 'email':
                if (!this.validateEmail(value)) {
                    this.showError(fieldName, '올바른 이메일 주소를 입력해주세요.');
                    return false;
                }
                break;

            case 'password':
                if (fieldName.includes('register') || fieldName.includes('Register')) {
                    const strength = this.checkPasswordStrength(value);
                    if (strength.score < 2) {
                        this.showError(fieldName, '비밀번호가 너무 약합니다. 더 강한 비밀번호를 사용해주세요.');
                        return false;
                    }
                }
                break;

            case 'text':
                if (fieldName === 'name' && value.length < 2) {
                    this.showError(fieldName, '이름은 2글자 이상 입력해주세요.');
                    return false;
                }
                break;
        }

        this.clearFieldError(input);
        return true;
    }

    validateRegistrationForm(name, email, password) {
        const errors = [];

        if (!name || name.length < 2) {
            errors.push({ field: 'name', message: '이름은 2글자 이상 입력해주세요.' });
        }

        if (!this.validateEmail(email)) {
            errors.push({ field: 'registerEmail', message: '올바른 이메일 주소를 입력해주세요.' });
        }

        const passwordStrength = this.checkPasswordStrength(password);
        if (passwordStrength.score < 2) {
            errors.push({ field: 'registerPassword', message: '비밀번호가 너무 약합니다. 8자 이상, 대소문자, 숫자, 특수문자를 포함해주세요.' });
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Password strength checker
    setupPasswordStrength() {
        const passwordInputs = document.querySelectorAll('input[type="password"]');

        passwordInputs.forEach(input => {
            if (input.id.includes('register') || input.id.includes('Register')) {
                this.createPasswordStrengthIndicator(input);
            }
        });
    }

    createPasswordStrengthIndicator(input) {
        const container = input.parentElement;

        // Create strength indicator
        const strengthIndicator = document.createElement('div');
        strengthIndicator.className = 'password-strength';
        strengthIndicator.innerHTML = '<div class="password-strength-bar"></div>';

        // Create requirements list
        const requirements = document.createElement('div');
        requirements.className = 'password-requirements';
        requirements.innerHTML = `
            <div class="requirement" data-requirement="length">
                <i class="fas fa-times"></i>
                <span>8자 이상</span>
            </div>
            <div class="requirement" data-requirement="lowercase">
                <i class="fas fa-times"></i>
                <span>소문자 포함</span>
            </div>
            <div class="requirement" data-requirement="uppercase">
                <i class="fas fa-times"></i>
                <span>대문자 포함</span>
            </div>
            <div class="requirement" data-requirement="number">
                <i class="fas fa-times"></i>
                <span>숫자 포함</span>
            </div>
            <div class="requirement" data-requirement="special">
                <i class="fas fa-times"></i>
                <span>특수문자 포함</span>
            </div>
        `;

        container.appendChild(strengthIndicator);
        container.appendChild(requirements);
    }

    updatePasswordStrength(input) {
        const password = input.value;
        const strength = this.checkPasswordStrength(password);
        const container = input.parentElement;

        // Update strength bar
        const strengthBar = container.querySelector('.password-strength-bar');
        if (strengthBar) {
            strengthBar.className = `password-strength-bar strength-${strength.level}`;
        }

        // Update requirements
        const requirements = container.querySelectorAll('.requirement');
        requirements.forEach(req => {
            const requirement = req.dataset.requirement;
            const icon = req.querySelector('i');

            if (strength.requirements[requirement]) {
                req.classList.add('met');
                req.classList.remove('unmet');
                icon.className = 'fas fa-check';
            } else {
                req.classList.add('unmet');
                req.classList.remove('met');
                icon.className = 'fas fa-times';
            }
        });
    }

    checkPasswordStrength(password) {
        const requirements = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        const score = Object.values(requirements).filter(Boolean).length;

        let level = 'weak';
        if (score >= 5) level = 'strong';
        else if (score >= 4) level = 'good';
        else if (score >= 3) level = 'fair';

        return { requirements, score, level };
    }

    // Social login setup (placeholder)
    setupSocialLogin() {
        const socialButtons = document.querySelectorAll('.btn-social');

        socialButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const provider = button.classList.contains('btn-google') ? 'Google' : 
                               button.classList.contains('btn-facebook') ? 'Facebook' : 'GitHub';

                this.showAlert(`${provider} 로그인은 곧 지원될 예정입니다.`, 'info');
            });
        });
    }

    // Remember me functionality
    setupRememberMe() {
        const rememberMe = document.getElementById('rememberMe');
        const emailInput = document.getElementById('email');

        // Load remembered email
        if (localStorage.getItem('rememberMe') === 'true') {
            const rememberedEmail = localStorage.getItem('rememberedEmail');
            if (rememberedEmail && emailInput) {
                emailInput.value = rememberedEmail;
                if (rememberMe) rememberMe.checked = true;
            }
        }
    }

    // Forgot password functionality
    setupForgotPassword() {
        const forgotPasswordLinks = document.querySelectorAll('.forgot-password a');

        forgotPasswordLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleForgotPassword();
            });
        });
    }

    handleForgotPassword() {
        const email = prompt('비밀번호를 재설정할 이메일 주소를 입력해주세요:');

        if (email && this.validateEmail(email)) {
            this.showAlert('비밀번호 재설정 링크가 이메일로 전송되었습니다. (데모 버전에서는 실제로 전송되지 않습니다)', 'info');
        } else if (email) {
            this.showAlert('올바른 이메일 주소를 입력해주세요.', 'error');
        }
    }

    // Loading state management
    setLoading(isLoading) {
        this.isLoading = isLoading;

        const submitButtons = document.querySelectorAll('button[type="submit"]');
        submitButtons.forEach(button => {
            if (isLoading) {
                button.classList.add('btn-loading');
                button.disabled = true;
            } else {
                button.classList.remove('btn-loading');
                button.disabled = false;
            }
        });
    }

    // Error handling
    showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        const formGroup = field.parentElement;
        formGroup.classList.add('error');

        // Remove existing error message
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add new error message
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        formGroup.appendChild(errorElement);
    }

    clearFieldError(field) {
        const formGroup = field.parentElement;
        formGroup.classList.remove('error');

        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    clearErrors() {
        const errorGroups = document.querySelectorAll('.form-group.error');
        errorGroups.forEach(group => {
            group.classList.remove('error');
            const errorMessage = group.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        });
    }

    // Success message
    showSuccess(message) {
        this.showAlert(message, 'success');
    }

    // Alert system
    showAlert(message, type = 'info') {
        // Remove existing alerts
        const existingAlerts = document.querySelectorAll('.auth-alert');
        existingAlerts.forEach(alert => alert.remove());

        // Create new alert
        const alert = document.createElement('div');
        alert.className = `auth-alert alert-${type}`;
        alert.textContent = message;

        // Style the alert
        Object.assign(alert.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '10000',
            minWidth: '300px',
            animation: 'slideInRight 0.3s ease'
        });

        // Set background color based on type
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#17a2b8',
            warning: '#ffc107'
        };
        alert.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(alert);

        // Auto remove after 5 seconds
        setTimeout(() => {
            alert.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.parentNode.removeChild(alert);
                }
            }, 300);
        }, 5000);
    }

    // Keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Enter key to submit forms
            if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
                const form = e.target.closest('form');
                if (form) {
                    const submitButton = form.querySelector('button[type="submit"]');
                    if (submitButton && !submitButton.disabled) {
                        submitButton.click();
                    }
                }
            }

            // Escape key to clear errors
            if (e.key === 'Escape') {
                this.clearErrors();
            }
        });
    }

    // Accessibility improvements
    setupAccessibility() {
        // Add ARIA labels
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            if (!input.getAttribute('aria-label')) {
                const label = input.parentElement.querySelector('label');
                if (label) {
                    input.setAttribute('aria-label', label.textContent);
                }
            }
        });

        // Add role attributes
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.setAttribute('role', 'form');
        });

        // Add live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        document.body.appendChild(liveRegion);

        this.liveRegion = liveRegion;
    }

    // Announce to screen readers
    announce(message) {
        if (this.liveRegion) {
            this.liveRegion.textContent = message;
        }
    }

    // Performance monitoring
    trackAuthPerformance() {
        // Track form submission times
        const startTime = performance.now();

        return {
            end: () => {
                const endTime = performance.now();
                const duration = endTime - startTime;
                console.log(`Auth operation completed in ${duration.toFixed(2)}ms`);
            }
        };
    }

    // Security enhancements
    setupSecurityFeatures() {
        // Prevent form submission on suspicious activity
        let failedAttempts = 0;
        const maxAttempts = 5;

        this.checkFailedAttempts = () => {
            failedAttempts++;
            if (failedAttempts >= maxAttempts) {
                this.showAlert('너무 많은 로그인 시도가 감지되었습니다. 잠시 후 다시 시도해주세요.', 'error');
                this.setLoading(true);

                setTimeout(() => {
                    failedAttempts = 0;
                    this.setLoading(false);
                }, 60000); // 1 minute lockout

                return false;
            }
            return true;
        };

        // Clear failed attempts on successful login
        this.clearFailedAttempts = () => {
            failedAttempts = 0;
        };
    }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const authManager = new AuthManager();

    // Make it globally accessible for debugging
    window.authManager = authManager;
});

// Add CSS animations
const authStyle = document.createElement('style');
authStyle.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }

    .auth-alert {
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        border-left: 4px solid rgba(255,255,255,0.3);
    }

    .form-group.error input {
        animation: shake 0.5s ease-in-out;
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }

    .btn-loading {
        position: relative;
        color: transparent !important;
    }

    .btn-loading::after {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        top: 50%;
        left: 50%;
        margin-left: -10px;
        margin-top: -10px;
        border: 2px solid #ffffff;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(authStyle);
