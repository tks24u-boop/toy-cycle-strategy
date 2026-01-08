// =====================================
// まにまにパパの情報発信サイト - メインJavaScript
// =====================================

/**
 * 自分のnote記事を読み込んで表示
 */
async function loadMyArticles() {
  try {
    const response = await fetch('../data/my-articles.json');
    const data = await response.json();

    const container = document.querySelector('.articles-grid');
    if (!container) return;

    if (data.articles.length === 0) {
      container.innerHTML = '<p class="text-center">まだ記事がありません</p>';
      return;
    }

    container.innerHTML = data.articles.map(article => `
      <div class="article-card" onclick="window.open('${article.url}', '_blank', 'noopener,noreferrer')">
        ${article.thumbnail ?
          `<img src="${article.thumbnail}" alt="${article.title}" loading="lazy">` :
          `<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%234A90E2' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='24' font-family='sans-serif'%3Enote%3C/text%3E%3C/svg%3E" alt="${article.title}">`
        }
        <div class="content">
          <div class="meta">
            <span class="category-tag">${article.category}</span>
            <span class="date">${article.date}</span>
          </div>
          <h3>${article.title}</h3>
          <p class="description">${article.description || ''}</p>
          <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="read-more">続きを読む →</a>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('note記事の読み込みエラー:', error);
    const container = document.querySelector('.articles-grid');
    if (container) {
      container.innerHTML = '<p class="text-center">記事の読み込みに失敗しました</p>';
    }
  }
}

/**
 * 参考記事を読み込んで表示
 */
async function loadReferenceArticles() {
  try {
    const response = await fetch('../data/reference-articles.json');
    const data = await response.json();

    const container = document.querySelector('.reference-list');
    if (!container) return;

    if (data.articles.length === 0) {
      container.innerHTML = '<p class="text-center">まだ参考記事がありません</p>';
      return;
    }

    // 最新5件のみ表示
    const recentArticles = data.articles.slice(0, 5);

    container.innerHTML = recentArticles.map(article => `
      <div class="reference-card">
        <h3><a href="${article.articleUrl}" target="_blank" rel="noopener noreferrer">${article.title}</a></h3>
        <p class="author">
          by <a href="${article.authorUrl}" target="_blank" rel="noopener noreferrer">${article.author}</a>
        </p>
        <div class="my-comment">
          <strong>💬 私のコメント：</strong>
          <p>${article.myComment}</p>
        </div>
        <p class="date">追加日: ${article.addedDate}</p>
      </div>
    `).join('');
  } catch (error) {
    console.error('参考記事の読み込みエラー:', error);
    const container = document.querySelector('.reference-list');
    if (container) {
      container.innerHTML = '<p class="text-center">参考記事の読み込みに失敗しました</p>';
    }
  }
}

/**
 * メルカリ商品を読み込んで表示
 */
async function loadMercariItems() {
  try {
    const response = await fetch('../data/mercari-items.json');
    const data = await response.json();

    const container = document.querySelector('.mercari-grid');
    if (!container) return;

    // activeな商品のみフィルター
    const activeItems = data.items.filter(item => item.status === 'active');

    if (activeItems.length === 0) {
      container.innerHTML = '<p class="text-center">現在出品中の商品はありません</p>';
      return;
    }

    container.innerHTML = activeItems.map(item => `
      <div class="mercari-card">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        <div class="content">
          <h3>${item.name}</h3>
          <p class="price">¥${item.price.toLocaleString()}</p>
          <p class="description">${item.description}</p>
          <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="btn">
            メルカリで見る
          </a>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('メルカリ商品の読み込みエラー:', error);
    const container = document.querySelector('.mercari-grid');
    if (container) {
      container.innerHTML = '<p class="text-center">商品の読み込みに失敗しました</p>';
    }
  }
}

/**
 * ページ読み込み時の初期化
 */
document.addEventListener('DOMContentLoaded', () => {
  // 各セクションのデータを読み込む
  loadMyArticles();
  loadReferenceArticles();
  loadMercariItems();

  // トップに戻るボタンの表示制御（あれば）
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.style.display = 'block';
      } else {
        backToTopBtn.style.display = 'none';
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
