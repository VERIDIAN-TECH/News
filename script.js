document.addEventListener('DOMContentLoaded', () => {
    const feed = document.getElementById('news-feed');
    const status = document.getElementById('status-message');
    const modal = document.getElementById('post-modal');
    const modalContent = document.getElementById('modal-content-wrapper');
    const closeBtn = document.getElementById('close-modal');

    // Валидация данных
    if (!Array.isArray(posts)) {
        status.textContent = "️ Ошибка загрузки данных. Проверьте posts.js";
        return;
    }

    // Парсинг даты
    const parseDate = (str) => {
        const [d, t] = str.split(' ');
        const [day, month, year] = d.split('.').map(Number);
        const [h, m] = t.split(':').map(Number);
        return new Date(year, month - 1, day, h, m).getTime();
    };

    // Сортировка и рендер
    const sorted = [...posts].sort((a, b) => parseDate(b.date) - parseDate(a.date));

    sorted.forEach(post => {
        const plainText = post.text.replace(/<br>/g, ' ').replace(/<[^>]*>?/gm, '');
        const snippet = plainText.length > 120 ? plainText.slice(0, 120) + '...' : plainText;
        
        const card = document.createElement('article');
        card.className = 'post-card';
        card.innerHTML = `
            <div class="card-img-wrap">
                ${post.cover ? `<img src="${post.cover}" class="card-img" loading="lazy" alt="">` : ''}
            </div>
            <div class="card-body">
                <time class="card-date">${post.date}</time>
                <p class="card-snippet">${snippet}</p>
                <div class="card-author">${post.author}</div>
            </div>
        `;
        
        card.addEventListener('click', () => openModal(post));
        feed.appendChild(card);
    });

    status.style.display = 'none';

    // Логика модального окна
    function openModal(post) {
        const imgHtml = post.cover ? `<img src="${post.cover}" class="modal-hero" alt="">` : '';
        const socialHtml = (post.social || []).map(s => 
            `<a href="${s.url}" target="_blank" style="color:var(--accent-blue); margin-left:10px;">${s.icon}</a>`
        ).join('');

        modalContent.innerHTML = `
            ${imgHtml}
            <div class="modal-inner">
                <div class="modal-meta-row">
                    <span>${post.date}</span>
                    <span>Автор: ${post.author}</span>
                </div>
                <div class="modal-full-text">${post.text}</div>
                <div style="margin-top:2rem; font-size:0.9rem; color:var(--text-secondary);">
                    Соцсети: ${socialHtml || 'Нет'}
                </div>
            </div>
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => e.target === modal && closeModal());
    document.addEventListener('keydown', e => e.key === 'Escape' && closeModal());
});
