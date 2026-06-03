document.addEventListener('DOMContentLoaded', () => {
    const feedContainer = document.getElementById('news-feed');
    const statusMsg = document.getElementById('status-message');

    // 1. Проверка данных
    if (typeof posts === 'undefined' || !Array.isArray(posts) || posts.length === 0) {
        statusMsg.textContent = "Ошибка: Список новостей пуст или файл posts.js не загружен.";
        statusMsg.style.color = "#cc0000";
        return;
    }

    // 2. Функция парсинга даты (ДД.ММ.ГГГГ ЧЧ:ММ)
    const parseDate = (dateStr) => {
        try {
            const [datePart, timePart] = dateStr.split(' ');
            const [day, month, year] = datePart.split('.').map(Number);
            const [hours, minutes] = timePart.split(':').map(Number);
            return new Date(year, month - 1, day, hours, minutes).getTime();
        } catch (e) {
            console.error("Ошибка даты:", dateStr);
            return 0;
        }
    };

    // 3. Сортировка: новые сверху
    const sortedPosts = [...posts].sort((a, b) => parseDate(b.date) - parseDate(a.date));

    // 4. Генерация HTML
    const renderPost = (post) => {
        const imgHTML = post.cover 
            ? `<div class="post-image-wrap"><img src="${post.cover}" alt="Обложка" class="post-cover" loading="lazy"></div>` 
            : '';

        const socialHTML = (post.social || []).slice(0, 3).map(s => 
            `<a href="${s.url}" target="_blank" class="s-link">${s.icon}</a>`
        ).join('');

        return `
            <article class="post-card">
                ${imgHTML}
                <div class="post-body">
                    <div>
                        <time class="post-date">${post.date}</time>
                        <div class="post-text">${post.text}</div>
                    </div>
                    <div class="post-meta">
                        <span class="author-block">Автор: ${post.author}</span>
                        <div class="social-links">${socialHTML}</div>
                    </div>
                </div>
            </article>
        `;
    };

    // 5. Вывод
    feedContainer.innerHTML = sortedPosts.map(renderPost).join('');
    statusMsg.style.display = 'none'; // Скрываем статус после загрузки
});
