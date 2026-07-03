// ========================================
// パパみかん script.js
// ========================================

// ---- ハンバーガーメニュー ----
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.main-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.style.display === 'block';
    nav.style.display = isOpen ? '' : 'block';
    nav.style.position = isOpen ? '' : 'absolute';
    nav.style.top = isOpen ? '' : '64px';
    nav.style.left = isOpen ? '' : '0';
    nav.style.right = isOpen ? '' : '0';
    nav.style.background = isOpen ? '' : '#fff';
    nav.style.padding = isOpen ? '' : '12px 24px 20px';
    nav.style.borderBottom = isOpen ? '' : '1px solid #E8E0D8';
    nav.style.zIndex = isOpen ? '' : '99';
  });
}

// ---- スムーズスクロール（アンカーリンク）----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ========================================
// 記事一覧のページネーション
// ========================================

const ARTICLES_PER_PAGE = 12;

const allCards = Array.from(document.querySelectorAll('.article-card'));

allCards.forEach(card => {
  // アニメーション用スタイル
  card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
});

let currentPage = 1;

function renderPage() {
  const totalPages = Math.max(1, Math.ceil(allCards.length / ARTICLES_PER_PAGE));
  if (currentPage > totalPages) currentPage = 1;

  const start = (currentPage - 1) * ARTICLES_PER_PAGE;
  const end = start + ARTICLES_PER_PAGE;
  const pageCards = allCards.slice(start, end);

  // 全カードを非表示
  allCards.forEach(card => {
    card.style.display = 'none';
    card.style.opacity = '0';
    card.style.transform = 'translateY(16px)';
  });

  // 表示カードをフェードイン
  pageCards.forEach((card, i) => {
    card.style.display = '';
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * 40);
  });

  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  const paginationEl = document.getElementById('pagination');
  if (!paginationEl) return;

  if (totalPages <= 1) {
    paginationEl.innerHTML = '';
    return;
  }

  let html = '';

  // 前へボタン
  if (currentPage > 1) {
    html += `<button class="page-btn" data-page="${currentPage - 1}">← 前へ</button>`;
  }

  // ページ番号ボタン
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      html += `<button class="page-btn${i === currentPage ? ' current' : ''}" data-page="${i}">${i}</button>`;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      html += `<span class="page-dots">…</span>`;
    }
  }

  // 次へボタン
  if (currentPage < totalPages) {
    html += `<button class="page-btn" data-page="${currentPage + 1}">次へ →</button>`;
  }

  paginationEl.innerHTML = html;

  // ページボタンのクリックイベント
  paginationEl.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentPage = parseInt(btn.dataset.page);
      renderPage();
      // 記事一覧セクションの先頭にスクロール
      const articlesSection = document.getElementById('articles');
      if (articlesSection) {
        const top = articlesSection.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ---- 初期表示 ----
renderPage();
