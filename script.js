// ハンバーガーメニュー
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

// スムーズスクロール（アンカーリンク）
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

// カードのフェードイン
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.article-card, .feature-card, .ad-product-v').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// 今日の日付を記事に反映（デモ）
const dateEl = document.querySelector('.article-card.featured time');
if (dateEl) {
  const now = new Date();
  const formatted = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
  dateEl.textContent = formatted;
}
