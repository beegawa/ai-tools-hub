// AI Tools Hub - Main Application JavaScript

class AIToolsHub {
    constructor() {
        this.currentUser = null;
        this.tools = [];
        this.news = [];
        this.currentTool = null;
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.setupEventListeners();
        this.loadTools();
        this.loadNews();
        this.setupModals();
        this.setupSearch();
        this.setupFilters();
    }

    // Authentication Methods
    checkAuthStatus() {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (token && user) {
            this.currentUser = JSON.parse(user);
            this.updateAuthUI();
        }
    }

    updateAuthUI() {
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const userMenu = document.getElementById('userMenu');
        const userName = document.getElementById('userName');
        const adminBtn = document.getElementById('adminBtn');

        if (this.currentUser) {
            loginBtn.style.display = 'none';
            registerBtn.style.display = 'none';
            userMenu.style.display = 'flex';
            userName.textContent = this.currentUser.name;

            if (this.currentUser.role === 'admin') {
                adminBtn.style.display = 'block';
            }
        } else {
            loginBtn.style.display = 'block';
            registerBtn.style.display = 'block';
            userMenu.style.display = 'none';
        }
    }

    async login(email, password) {
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
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                this.currentUser = data.user;
                this.updateAuthUI();
                this.closeModal('loginModal');
                this.showAlert('로그인 성공!', 'success');
            } else {
                this.showAlert(data.error || '로그인 실패', 'error');
            }
        } catch (error) {
            this.showAlert('서버 오류가 발생했습니다.', 'error');
        }
    }

    async register(name, email, password) {
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
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                this.currentUser = data.user;
                this.updateAuthUI();
                this.closeModal('registerModal');
                this.showAlert('회원가입 성공!', 'success');
            } else {
                this.showAlert(data.error || '회원가입 실패', 'error');
            }
        } catch (error) {
            this.showAlert('서버 오류가 발생했습니다.', 'error');
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUser = null;
        this.updateAuthUI();
        this.showAlert('로그아웃되었습니다.', 'info');
    }

    // Tools Methods
    async loadTools(category = 'all', search = '') {
        try {
            const params = new URLSearchParams();
            if (category !== 'all') params.append('category', category);
            if (search) params.append('search', search);

            const response = await fetch(`/api/tools?${params}`);
            const tools = await response.json();

            this.tools = tools;
            this.renderTools();
        } catch (error) {
            console.error('Error loading tools:', error);
            this.showAlert('도구 로딩 중 오류가 발생했습니다.', 'error');
        }
    }

    renderTools() {
        const toolsGrid = document.getElementById('toolsGrid');

        if (this.tools.length === 0) {
            toolsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>검색 결과가 없습니다</h3>
                    <p>다른 키워드로 검색해보세요.</p>
                </div>
            `;
            return;
        }

        toolsGrid.innerHTML = this.tools.map(tool => `
            <div class="tool-card" onclick="app.showToolDetail('${tool.id}')">
                <div class="tool-header">
                    <div class="tool-icon">
                        ${this.getToolIcon(tool.category)}
                    </div>
                    <div class="tool-info">
                        <h3>${tool.name}</h3>
                        <span class="tool-category">${this.getCategoryName(tool.category)}</span>
                    </div>
                </div>
                <p class="tool-description">${tool.description}</p>
                <div class="tool-footer">
                    <span class="tool-price">${tool.price || '무료'}</span>
                    <div class="tool-rating">
                        <span class="stars">${this.renderStars(tool.rating || 0)}</span>
                        <span class="rating-text">(${tool.reviewCount || 0})</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    getToolIcon(category) {
        const icons = {
            text: '<i class="fas fa-pen"></i>',
            image: '<i class="fas fa-image"></i>',
            video: '<i class="fas fa-video"></i>',
            audio: '<i class="fas fa-music"></i>',
            code: '<i class="fas fa-code"></i>',
            productivity: '<i class="fas fa-tasks"></i>'
        };
        return icons[category] || '<i class="fas fa-robot"></i>';
    }

    getCategoryName(category) {
        const names = {
            text: '텍스트 생성',
            image: '이미지 생성',
            video: '비디오 편집',
            audio: '오디오 처리',
            code: '코드 생성',
            productivity: '생산성'
        };
        return names[category] || category;
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += '★';
        }
        if (hasHalfStar) {
            stars += '☆';
        }
        for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
            stars += '☆';
        }

        return stars;
    }

    async showToolDetail(toolId) {
        try {
            const tool = this.tools.find(t => t.id === toolId);
            if (!tool) return;

            this.currentTool = tool;

            // Load reviews
            const response = await fetch(`/api/reviews/${toolId}`);
            const reviews = await response.json();

            const toolDetail = document.getElementById('toolDetail');
            toolDetail.innerHTML = `
                <div class="tool-detail-header">
                    <div class="tool-detail-icon">
                        ${this.getToolIcon(tool.category)}
                    </div>
                    <div class="tool-detail-info">
                        <h2>${tool.name}</h2>
                        <div class="tool-detail-meta">
                            <span class="category-badge">${this.getCategoryName(tool.category)}</span>
                            <span class="tool-price">${tool.price || '무료'}</span>
                            <div class="tool-rating">
                                <span class="stars">${this.renderStars(tool.rating || 0)}</span>
                                <span class="rating-text">(${tool.reviewCount || 0} 리뷰)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <p class="tool-description">${tool.description}</p>

                ${tool.features ? `
                    <div class="tool-features">
                        <h4>주요 기능</h4>
                        <div class="features-list">
                            ${tool.features.split(',').map(feature => 
                                `<span class="feature-tag">${feature.trim()}</span>`
                            ).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="tool-actions">
                    ${tool.website ? `<a href="${tool.website}" target="_blank" class="btn btn-primary">웹사이트 방문</a>` : ''}
                    ${this.currentUser ? `<button onclick="app.openReviewModal('${tool.id}')" class="btn btn-outline">리뷰 작성</button>` : ''}
                </div>

                <div class="reviews-section">
                    <h3>사용자 리뷰</h3>
                    ${reviews.length > 0 ? reviews.map(review => `
                        <div class="review-item">
                            <div class="review-header">
                                <span class="review-author">${review.userName}</span>
                                <span class="review-date">${new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div class="review-rating">${this.renderStars(review.rating)}</div>
                            <p class="review-text">${review.text}</p>
                        </div>
                    `).join('') : '<p>아직 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!</p>'}
                </div>
            `;

            this.openModal('toolModal');
        } catch (error) {
            console.error('Error loading tool detail:', error);
            this.showAlert('도구 정보 로딩 중 오류가 발생했습니다.', 'error');
        }
    }

    // Review Methods
    openReviewModal(toolId) {
        if (!this.currentUser) {
            this.showAlert('리뷰를 작성하려면 로그인이 필요합니다.', 'info');
            return;
        }

        document.getElementById('reviewToolId').value = toolId;
        this.openModal('reviewModal');
    }

    async submitReview(toolId, rating, text) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ toolId, rating, text })
            });

            const data = await response.json();

            if (response.ok) {
                this.closeModal('reviewModal');
                this.showAlert('리뷰가 등록되었습니다!', 'success');
                // Refresh tool detail
                this.showToolDetail(toolId);
                // Reload tools to update ratings
                this.loadTools();
            } else {
                this.showAlert(data.error || '리뷰 등록 실패', 'error');
            }
        } catch (error) {
            this.showAlert('서버 오류가 발생했습니다.', 'error');
        }
    }

    // News Methods
    async loadNews() {
        try {
            const response = await fetch('/api/news');
            const news = await response.json();
            this.news = news;
            this.renderNews();
        } catch (error) {
            console.error('Error loading news:', error);
        }
    }

    renderNews() {
        const newsGrid = document.getElementById('newsGrid');

        if (this.news.length === 0) {
            newsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-newspaper"></i>
                    <h3>뉴스가 없습니다</h3>
                    <p>곧 최신 AI 뉴스를 업데이트할 예정입니다.</p>
                </div>
            `;
            return;
        }

        newsGrid.innerHTML = this.news.map(item => `
            <div class="news-card">
                <div class="news-date">${new Date(item.date).toLocaleDateString()}</div>
                <h3 class="news-title">${item.title}</h3>
                <p class="news-content">${item.content}</p>
                ${item.link ? `<a href="${item.link}" target="_blank" class="news-link">자세히 보기</a>` : ''}
            </div>
        `).join('');
    }

    // Search and Filter Methods
    setupSearch() {
        const heroSearch = document.getElementById('heroSearch');
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');

        const performSearch = () => {
            const query = searchInput.value || heroSearch.value;
            const category = document.getElementById('categoryFilter').value;
            this.loadTools(category, query);

            // Scroll to tools section
            document.getElementById('tools').scrollIntoView({ behavior: 'smooth' });
        };

        if (heroSearch) {
            heroSearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    searchInput.value = heroSearch.value;
                    performSearch();
                }
            });
        }

        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', performSearch);
        }

        // Hero search button
        const heroSearchBtn = document.querySelector('.hero-search .search-btn');
        if (heroSearchBtn) {
            heroSearchBtn.addEventListener('click', () => {
                searchInput.value = heroSearch.value;
                performSearch();
            });
        }
    }

    setupFilters() {
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                const category = categoryFilter.value;
                const search = document.getElementById('searchInput').value;
                this.loadTools(category, search);
            });
        }
    }

    // Modal Methods
    setupModals() {
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });

        // Close modal when clicking close button
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Auth buttons
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const adminBtn = document.getElementById('adminBtn');

        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.openModal('loginModal'));
        }

        if (registerBtn) {
            registerBtn.addEventListener('click', () => this.openModal('registerModal'));
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        if (adminBtn) {
            adminBtn.addEventListener('click', () => {
                window.location.href = 'admin.html';
            });
        }

        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                this.login(email, password);
            });
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('registerName').value;
                const email = document.getElementById('registerEmail').value;
                const password = document.getElementById('registerPassword').value;
                this.register(name, email, password);
            });
        }

        // Review form
        const reviewForm = document.getElementById('reviewForm');
        if (reviewForm) {
            reviewForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const toolId = document.getElementById('reviewToolId').value;
                const rating = document.getElementById('reviewRating').value;
                const text = document.getElementById('reviewText').value;

                if (!rating) {
                    this.showAlert('평점을 선택해주세요.', 'error');
                    return;
                }

                this.submitReview(toolId, parseInt(rating), text);
            });
        }

        // Rating stars
        document.querySelectorAll('.rating-input .star').forEach(star => {
            star.addEventListener('click', (e) => {
                const rating = e.target.dataset.rating;
                document.getElementById('reviewRating').value = rating;

                // Update star display
                document.querySelectorAll('.rating-input .star').forEach((s, index) => {
                    if (index < rating) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Utility Methods
    showAlert(message, type = 'info') {
        // Create alert element
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        alert.style.position = 'fixed';
        alert.style.top = '100px';
        alert.style.right = '20px';
        alert.style.zIndex = '9999';
        alert.style.minWidth = '300px';
        alert.style.animation = 'slideInRight 0.3s ease';

        document.body.appendChild(alert);

        // Remove alert after 3 seconds
        setTimeout(() => {
            alert.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.parentNode.removeChild(alert);
                }
            }, 300);
        }, 3000);
    }

    // Initialize sample data if needed
    async initializeSampleData() {
        try {
            const response = await fetch('/api/tools');
            const tools = await response.json();

            if (tools.length === 0) {
                // Add sample tools if none exist
                const sampleTools = [
                    {
                        name: "ChatGPT",
                        category: "text",
                        description: "OpenAI의 대화형 AI 모델로 텍스트 생성, 질문 답변, 창작 등 다양한 작업을 수행할 수 있습니다.",
                        price: "$20/월",
                        website: "https://chat.openai.com",
                        features: "대화형 AI, 텍스트 생성, 코드 작성, 번역"
                    },
                    {
                        name: "Midjourney",
                        category: "image",
                        description: "텍스트 프롬프트를 통해 고품질의 AI 이미지를 생성하는 도구입니다.",
                        price: "$10/월",
                        website: "https://midjourney.com",
                        features: "이미지 생성, 아트워크 제작, 스타일 변환"
                    },
                    {
                        name: "GitHub Copilot",
                        category: "code",
                        description: "AI 기반 코드 자동완성 도구로 개발 생산성을 크게 향상시킵니다.",
                        price: "$10/월",
                        website: "https://github.com/features/copilot",
                        features: "코드 자동완성, 함수 생성, 주석 작성"
                    }
                ];

                console.log('Sample tools would be added here in a real implementation');
            }
        } catch (error) {
            console.error('Error initializing sample data:', error);
        }
    }
}

// Initialize the application
const app = new AIToolsHub();

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
