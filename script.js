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

// 今日の日付を記事に反映（デモ）
const dateEl = document.querySelector('.article-card.featured time');
if (dateEl) {
  const now = new Date();
  const formatted = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
  dateEl.textContent = formatted;
}


// ========================================
// A. カテゴリフィルター + B. ページネーション
// ========================================

const ARTICLES_PER_PAGE = 12;

// 記事番号 → カテゴリのマッピング
const ARTICLE_CATS = {
  'article-001': 'mikan',
  'article-002': 'mikan',
  'article-003': 'mikan',
  'article-004': 'mikan',
  'article-005': 'mikan',
  'article-006': 'mikan',
  'article-007': 'mikan',
  'article-008': 'mikan',
  'article-009': 'mikan',
  'article-010': 'mikan',
  'article-011': 'mikan',
  'article-012': 'mikan',
  'article-013': 'mikan',
  'article-014': 'mikan',
  'article-015': 'mikan',
  'article-016': 'mikan',
  'article-017': 'mikan',
  'article-018': 'mikan',
  'article-019': 'mikan',
  'article-020': 'mikan',
  'article-021': 'orange',
  'article-022': 'vitamin',
  'article-023': 'supple',
  'article-024': 'orange',
  'article-025': 'orange',
  'article-026': 'orange',
  'article-027': 'orange',
  'article-028': 'vitamin',
  'article-029': 'supple',
  'article-030': 'supple',
  'article-031': 'supple',
  'article-032': 'orange',
  'article-033': 'orange',
  'article-034': 'orange',
  'article-035': 'orange',
  'article-036': 'supple',
};

// 記事カードに data-cat を付与（HTMLを変更せずJSで処理）
const allCards = Array.from(document.querySelectorAll('.article-card'));

allCards.forEach(card => {
  const link = card.querySelector('a[href*="article-"]');
  if (link) {
    const match = link.getAttribute('href').match(/article-(\d+)/);
    if (match) {
      const key = `article-${match[1]}`;
      card.dataset.cat = ARTICLE_CATS[key] || 'mikan';
    }
  }
  // アニメーション用スタイルをリセット
  card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
});

let currentFilter = 'all';
let currentPage = 1;

function getFilteredCards() {
  if (currentFilter === 'all') return allCards;
  return allCards.filter(c => c.dataset.cat === currentFilter);
}

function renderPage() {
  const filtered = getFilteredCards();
  const totalPages = Math.max(1, Math.ceil(filtered.length / ARTICLES_PER_PAGE));
  if (currentPage > totalPages) currentPage = 1;

  const start = (currentPage - 1) * ARTICLES_PER_PAGE;
  const end = start + ARTICLES_PER_PAGE;
  const pageCards = filtered.slice(start, end);

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

  renderPagination(filtered.length, totalPages);
}

function renderPagination(total, totalPages) {
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

// ---- フィルタータブのクリックイベント ----
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    currentPage = 1;
    renderPage();
  });
});


// ========================================
// D. サイドバー・フッターカテゴリリンクをフィルターと連動
// ========================================

document.querySelectorAll('.filter-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const filter = link.dataset.filter;
    // フィルタータブを切り替え
    const targetBtn = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
    if (targetBtn) {
      targetBtn.click();
    }
    // 記事一覧セクションにスクロール
    const articlesSection = document.getElementById('articles');
    if (articlesSection) {
      const top = articlesSection.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


// ========================================
// 初期表示
// ========================================
renderPage();
