document.addEventListener('DOMContentLoaded', () => {
    const feedContainer = document.getElementById('news-feed');
    const statusMsg = document.getElementById('status-message');
    
    // Элементы модального окна
    const modal = document.getElementById('post-modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.getElementById('close-modal');

    // Проверка данных
    if (typeof posts === 'undefined' || !Array.isArray(posts)) {
        statusMsg.textContent = "Ошибка: Файл posts.js не найден или поврежден.";
        return;
    }

    // Парсинг даты
    const parseDate = (dateStr) => {
        try {
            const [datePart, timePart] = dateStr.split(' ');
            const [day, month, year] = datePart.split('.').map(Number);
            const [hours, minutes] = timePart.split(':').map(Number);
            return new Date(year, month - 1, day, hours, minutes).getTime();
        } catch (e) { return 0; }
    };

    // Сортировка
    const sortedPosts = [...posts].sort((a, b) => parseDate(b.date) - parseDate(a.date));

    // Генерация превью (карточки)
    sortedPosts.forEach(post => {
        // Если нет фото, ставим заглушку или пустой блок
        const imgHTML = post.cover 
            ? `<div class="post-image-wrap"><img src="${post.cover}" alt="Cover" class="post-cover" loading="lazy"></div>` 
            : `<div class="post-image-wrap" style="background:#1a2235;"></div>`;

        // Обрезаем текст для превью (убираем HTML теги для чистоты обрезки)
        const plainText = post.text.replace(/<br>/g, ' ').replace(/<[^>]*>?/gm, '');
        const snippet = plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;

        const card = document.createElement('article');
        card.className = 'post-card';
        card.innerHTML = `
            ${imgHTML}
            <div class="post-body">
                <time class="post-date">${post.date}</time>
                <div class="post-snippet">${snippet}</div>
                <span class="read-more-hint">Читать полностью →</span>
            </div>
        `;

        // Открытие модалки при клике
        card.addEventListener('click', () => openModal(post));
        feedContainer.appendChild(card);
    });

    statusMsg.style.display = 'none';

    // Логика модального окна
    function openModal(post) {
        const imgHTML = post.cover 
            ? `<img src="${post.cover}" class="modal-hero" alt="Full cover">` 
            : '';
            
        const socialHTML = (post.social || []).map(s => 
            `<a href="${s.url}" target="_blank" style="color:var(--ss-blue); margin-right:10px; text-decoration:none;">${s.icon}</a>`
        ).join('');

        modalBody.innerHTML = `
            ${imgHTML}
            <div class="modal-body-inner">
                <time class="post-date" style="font-size:1rem;">${post.date}</time>
                <h2 style="font-family:'Montserrat'; color:white; margin: 0.5rem 0 1.5rem;">Полный отчет</h2>
                <div class="modal-full-text">${post.text}</div>
                <div class="modal-meta">
                    <span>Автор: <strong style="color:white;">${post.author}</strong></span>
                    <div>${socialHTML}</div>
                </div>
            </div>
        `;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Блокируем скролл фона
    }

    // Закрытие модалки
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeModal);
    
    // Закрытие по клику вне контента
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
});
