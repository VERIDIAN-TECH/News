document.addEventListener('DOMContentLoaded', function() {
    const postsContainer = document.getElementById('posts-container');
    const loading = document.getElementById('loading');
    
    // Функция парсинга даты в формате DD.MM.YYYY HH:MM
    function parseDate(dateString) {
        const [datePart, timePart] = dateString.split(' ');
        const [day, month, year] = datePart.split('.').map(Number);
        const [hours, minutes] = timePart.split(':').map(Number);
        
        return new Date(year, month - 1, day, hours, minutes);
    }
    
    // Сортировка постов по дате (новые сверху)
    function sortPostsByDate(postsArray) {
        return postsArray.sort((a, b) => {
            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);
            return dateB - dateA; // По убыванию (новые первыми)
        });
    }
    
    // Создание HTML для социального ссылки
    function createSocialLinks(socialArray) {
        if (!socialArray || socialArray.length === 0) return '';
        
        return socialArray.slice(0, 3).map(social => `
            <a href="${social.url}" target="_blank" rel="noopener noreferrer" class="social-link" title="${social.url}">
                ${social.icon}
            </a>
        `).join('');
    }
    
    // Создание карточки поста
    function createPostCard(post) {
        const coverHtml = post.cover ? `<img src="${post.cover}" alt="Cover" class="post-cover">` : '';
        
        return `
            <article class="post-card">
                ${coverHtml}
                <div class="post-content">
                    <div class="post-text">${post.text}</div>
                    <div class="post-meta">
                        <div class="post-author">
                            <span class="author-label">Автор:</span>
                            <span class="author-name">${post.author}</span>
                        </div>
                        <div class="post-date">${post.date}</div>
                        <div class="post-social">
                            ${createSocialLinks(post.social)}
                        </div>
                    </div>
                </div>
            </article>
        `;
    }
    
    // Рендеринг постов
    function renderPosts() {
        try {
            if (typeof posts === 'undefined') {
                throw new Error('Posts data not found');
            }
            
            const sortedPosts = sortPostsByDate([...posts]);
            postsContainer.innerHTML = sortedPosts.map(createPostCard).join('');
            loading.style.display = 'none';
        } catch (error) {
            console.error('Error loading posts:', error);
            postsContainer.innerHTML = '<div class="loading">Ошибка загрузки постов</div>';
            loading.style.display = 'none';
        }
    }
    
    // Инициализация
    renderPosts();
});
