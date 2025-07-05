// AI Tools Hub - Admin Dashboard JavaScript

class AdminDashboard {
    constructor() {
        this.currentUser = null;
        this.tools = [];
        this.users = [];
        this.reviews = [];
        this.news = [];
        this.currentSection = 'dashboard';
        this.editingTool = null;
        this.init();
    }

    init() {
        this.checkAdminAuth();
        this.setupEventListeners();
        this.setupSectionNavigation();
        this.loadDashboardData();
    }

    // Authentication Methods
    checkAdminAuth() {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (!token || !user) {
            window.location.href = 'login.html';
            return;
        }

        this.currentUser = JSON.parse(user);

        if (this.currentUser.role !== 'admin') {
            alert('관리자 권한이 필요합니다.');
            window.location.href = 'index.html';
            return;
        }

        this.updateUserInfo();
    }

    updateUserInfo() {
        const adminName = document.getElementById('adminName');
        if (adminName) {
            adminName.textContent = this.currentUser.name;
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }

    // Dashboard Methods
    async loadDashboardData() {
        try {
            await Promise.all([
                this.loadTools(),
                this.loadUsers(),
                this.loadReviews(),
                this.loadNews()
            ]);

            this.updateDashboardStats();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showAlert('대시보드 데이터 로딩 중 오류가 발생했습니다.', 'error');
        }
    }

    updateDashboardStats() {
        document.getElementById('totalTools').textContent = this.tools.length;
        document.getElementById('totalUsers').textContent = this.users.length;
        document.getElementById('totalReviews').textContent = this.reviews.length;
        document.getElementById('totalNews').textContent = this.news.length;
    }

    // Tools Management
    async loadTools() {
        try {
            const response = await fetch('/api/tools');
            this.tools = await response.json();
            this.renderToolsTable();
        } catch (error) {
            console.error('Error loading tools:', error);
            this.showAlert('도구 데이터 로딩 실패', 'error');
        }
    }

    renderToolsTable() {
        const tbody = document.querySelector('#toolsTable tbody');
        if (!tbody) return;

        if (this.tools.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <i class="fas fa-tools"></i>
                        <p>등록된 도구가 없습니다.</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.tools.map(tool => `
            <tr>
                <td>
                    <div class="tool-name">
                        <strong>${tool.name}</strong>
                        <small>${tool.description.substring(0, 50)}...</small>
                    </div>
                </td>
                <td><span class="category-badge">${this.getCategoryName(tool.category)}</span></td>
                <td>${tool.price || '무료'}</td>
                <td>
                    <div class="rating-display">
                        <span class="stars">${this.renderStars(tool.rating || 0)}</span>
                        <span>${(tool.rating || 0).toFixed(1)}</span>
                    </div>
                </td>
                <td>${tool.reviewCount || 0}</td>
                <td class="actions">
                    <button class="btn btn-sm btn-primary" onclick="admin.editTool('${tool.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="admin.deleteTool('${tool.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    openAddToolModal() {
        this.editingTool = null;
        document.getElementById('toolFormTitle').textContent = '새 도구 추가';
        document.getElementById('toolForm').reset();
        document.getElementById('toolId').value = '';
        this.openModal('toolFormModal');
    }

    editTool(toolId) {
        const tool = this.tools.find(t => t.id === toolId);
        if (!tool) return;

        this.editingTool = tool;
        document.getElementById('toolFormTitle').textContent = '도구 수정';

        // Fill form with tool data
        document.getElementById('toolName').value = tool.name;
        document.getElementById('toolCategory').value = tool.category;
        document.getElementById('toolDescription').value = tool.description;
        document.getElementById('toolPrice').value = tool.price || '';
        document.getElementById('toolWebsite').value = tool.website || '';
        document.getElementById('toolImage').value = tool.image || '';
        document.getElementById('toolFeatures').value = tool.features || '';
        document.getElementById('toolId').value = tool.id;

        this.openModal('toolFormModal');
    }

    async saveTool(formData) {
        try {
            const token = localStorage.getItem('token');
            const isEditing = !!this.editingTool;
            const url = isEditing ? `/api/tools/${this.editingTool.id}` : '/api/tools';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                this.closeModal('toolFormModal');
                this.showAlert(isEditing ? '도구가 수정되었습니다.' : '도구가 추가되었습니다.', 'success');
                await this.loadTools();
                this.updateDashboardStats();
            } else {
                this.showAlert(data.error || '저장 실패', 'error');
            }
        } catch (error) {
            console.error('Error saving tool:', error);
            this.showAlert('서버 오류가 발생했습니다.', 'error');
        }
    }

    async deleteTool(toolId) {
        if (!confirm('정말로 이 도구를 삭제하시겠습니까?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/tools/${toolId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                this.showAlert('도구가 삭제되었습니다.', 'success');
                await this.loadTools();
                this.updateDashboardStats();
            } else {
                const data = await response.json();
                this.showAlert(data.error || '삭제 실패', 'error');
            }
        } catch (error) {
            console.error('Error deleting tool:', error);
            this.showAlert('서버 오류가 발생했습니다.', 'error');
        }
    }

    // Users Management
    async loadUsers() {
        try {
            // In a real implementation, you would have a users API endpoint
            // For now, we'll simulate user data
            this.users = [
                {
                    id: '1',
                    name: this.currentUser.name,
                    email: this.currentUser.email,
                    role: this.currentUser.role,
                    createdAt: new Date().toISOString()
                }
            ];
            this.renderUsersTable();
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }

    renderUsersTable() {
        const tbody = document.querySelector('#usersTable tbody');
        if (!tbody) return;

        if (this.users.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">
                        <i class="fas fa-users"></i>
                        <p>등록된 사용자가 없습니다.</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.users.map(user => `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="role-badge role-${user.role}">${user.role === 'admin' ? '관리자' : '사용자'}</span></td>
                <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                <td class="actions">
                    <button class="btn btn-sm btn-primary" onclick="admin.editUser('${user.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${user.id !== this.currentUser.id ? `
                        <button class="btn btn-sm btn-danger" onclick="admin.deleteUser('${user.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </td>
            </tr>
        `).join('');
    }

    editUser(userId) {
        // Implement user editing functionality
        this.showAlert('사용자 편집 기능은 곧 추가될 예정입니다.', 'info');
    }

    deleteUser(userId) {
        // Implement user deletion functionality
        this.showAlert('사용자 삭제 기능은 곧 추가될 예정입니다.', 'info');
    }

    // Reviews Management
    async loadReviews() {
        try {
            // Load all reviews for all tools
            const reviewPromises = this.tools.map(tool => 
                fetch(`/api/reviews/${tool.id}`).then(res => res.json())
            );

            const reviewArrays = await Promise.all(reviewPromises);
            this.reviews = reviewArrays.flat();
            this.renderReviewsList();
        } catch (error) {
            console.error('Error loading reviews:', error);
        }
    }

    renderReviewsList() {
        const reviewsList = document.getElementById('reviewsList');
        if (!reviewsList) return;

        if (this.reviews.length === 0) {
            reviewsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-star"></i>
                    <h3>리뷰가 없습니다</h3>
                    <p>아직 등록된 리뷰가 없습니다.</p>
                </div>
            `;
            return;
        }

        reviewsList.innerHTML = this.reviews.map(review => {
            const tool = this.tools.find(t => t.id === review.toolId);
            return `
                <div class="review-card">
                    <div class="review-card-header">
                        <div class="review-meta">
                            <span class="review-tool">${tool ? tool.name : '알 수 없는 도구'}</span>
                            <span class="review-user">${review.userName}</span>
                            <span class="review-rating">${this.renderStars(review.rating)}</span>
                        </div>
                        <div class="review-date">${new Date(review.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div class="review-text">${review.text}</div>
                    <div class="review-actions">
                        <button class="btn btn-sm btn-danger" onclick="admin.deleteReview('${review.id}')">
                            <i class="fas fa-trash"></i> 삭제
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    deleteReview(reviewId) {
        if (!confirm('정말로 이 리뷰를 삭제하시겠습니까?')) return;

        // Implement review deletion
        this.showAlert('리뷰 삭제 기능은 곧 추가될 예정입니다.', 'info');
    }

    // News Management
    async loadNews() {
        try {
            const response = await fetch('/api/news');
            this.news = await response.json();
            this.renderNewsList();
        } catch (error) {
            console.error('Error loading news:', error);
        }
    }

    renderNewsList() {
        const newsList = document.getElementById('newsList');
        if (!newsList) return;

        if (this.news.length === 0) {
            newsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-newspaper"></i>
                    <h3>뉴스가 없습니다</h3>
                    <p>아직 등록된 뉴스가 없습니다.</p>
                </div>
            `;
            return;
        }

        newsList.innerHTML = this.news.map(item => `
            <div class="news-item">
                <div class="news-item-header">
                    <div>
                        <div class="news-item-title">${item.title}</div>
                        <div class="news-item-date">${new Date(item.date).toLocaleDateString()}</div>
                    </div>
                </div>
                <div class="news-item-content">${item.content}</div>
                ${item.link ? `<a href="${item.link}" target="_blank" class="news-item-link">원문 보기</a>` : ''}
            </div>
        `).join('');
    }

    // Section Navigation
    setupSectionNavigation() {
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.showSection(section);
            });
        });
    }

    showSection(sectionName) {
        // Update active menu item
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Show/hide sections
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionName).classList.add('active');

        this.currentSection = sectionName;

        // Load section-specific data
        switch (sectionName) {
            case 'dashboard':
                this.updateDashboardStats();
                break;
            case 'tools':
                this.renderToolsTable();
                break;
            case 'users':
                this.renderUsersTable();
                break;
            case 'reviews':
                this.renderReviewsList();
                break;
            case 'news':
                this.renderNewsList();
                break;
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Add tool button
        const addToolBtn = document.getElementById('addToolBtn');
        if (addToolBtn) {
            addToolBtn.addEventListener('click', () => this.openAddToolModal());
        }

        // Tool form submission
        const toolForm = document.getElementById('toolForm');
        if (toolForm) {
            toolForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const formData = {
                    name: document.getElementById('toolName').value,
                    category: document.getElementById('toolCategory').value,
                    description: document.getElementById('toolDescription').value,
                    price: document.getElementById('toolPrice').value,
                    website: document.getElementById('toolWebsite').value,
                    image: document.getElementById('toolImage').value,
                    features: document.getElementById('toolFeatures').value
                };

                this.saveTool(formData);
            });
        }

        // Modal close events
        this.setupModals();
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

    // Utility Methods
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

    // Data Export Methods
    exportData(type) {
        let data, filename;

        switch (type) {
            case 'tools':
                data = this.tools;
                filename = 'ai-tools-export.json';
                break;
            case 'users':
                data = this.users;
                filename = 'users-export.json';
                break;
            case 'reviews':
                data = this.reviews;
                filename = 'reviews-export.json';
                break;
            case 'news':
                data = this.news;
                filename = 'news-export.json';
                break;
            default:
                return;
        }

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showAlert(`${type} 데이터가 내보내기되었습니다.`, 'success');
    }

    // Statistics Methods
    getToolsStatistics() {
        const stats = {
            totalTools: this.tools.length,
            byCategory: {},
            averageRating: 0,
            totalReviews: this.reviews.length
        };

        // Count by category
        this.tools.forEach(tool => {
            stats.byCategory[tool.category] = (stats.byCategory[tool.category] || 0) + 1;
        });

        // Calculate average rating
        const ratingsSum = this.tools.reduce((sum, tool) => sum + (tool.rating || 0), 0);
        stats.averageRating = this.tools.length > 0 ? (ratingsSum / this.tools.length).toFixed(1) : 0;

        return stats;
    }

    // Search and Filter Methods
    setupTableSearch() {
        // Add search functionality to tables
        const searchInputs = document.querySelectorAll('.table-search');
        searchInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const tableId = e.target.dataset.table;
                this.filterTable(tableId, searchTerm);
            });
        });
    }

    filterTable(tableId, searchTerm) {
        const table = document.getElementById(tableId);
        if (!table) return;

        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    }

    // Bulk Operations
    setupBulkOperations() {
        // Add bulk operation functionality
        const selectAllCheckboxes = document.querySelectorAll('.select-all');
        selectAllCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const table = e.target.closest('table');
                const itemCheckboxes = table.querySelectorAll('.item-checkbox');
                itemCheckboxes.forEach(cb => cb.checked = e.target.checked);
                this.updateBulkActions(table);
            });
        });
    }

    updateBulkActions(table) {
        const checkedItems = table.querySelectorAll('.item-checkbox:checked');
        const bulkActions = table.parentElement.querySelector('.bulk-actions');

        if (bulkActions) {
            bulkActions.style.display = checkedItems.length > 0 ? 'block' : 'none';
        }
    }

    // Performance Monitoring
    trackPerformance() {
        // Track page load performance
        if (performance.timing) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Admin dashboard loaded in ${loadTime}ms`);
        }
    }
}

// Global functions for onclick handlers
window.closeModal = function(modalId) {
    admin.closeModal(modalId);
};

// Initialize admin dashboard
const admin = new AdminDashboard();

// Add CSS animations for admin
const adminStyle = document.createElement('style');
adminStyle.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }

    .tool-name {
        display: flex;
        flex-direction: column;
    }

    .tool-name small {
        color: #666;
        margin-top: 2px;
    }

    .rating-display {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .rating-display .stars {
        color: #ffc107;
    }

    .btn-sm {
        padding: 0.25rem 0.5rem;
        font-size: 0.875rem;
    }

    .actions {
        white-space: nowrap;
    }

    .actions .btn {
        margin-right: 0.25rem;
    }

    .empty-state {
        text-align: center;
        padding: 3rem;
        color: #666;
    }

    .empty-state i {
        font-size: 3rem;
        margin-bottom: 1rem;
        color: #ccc;
    }
`;
document.head.appendChild(adminStyle);
