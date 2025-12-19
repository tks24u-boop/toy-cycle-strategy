const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

// node-fetch v2 (CommonJS対応)
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

// 管理者パスワード（環境変数から取得、デフォルトは 'admin123'）
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// ミドルウェア
app.use(cors());
app.use(express.json());

// データファイルパス
const DATA_FILE = path.join(__dirname, 'data', 'articles.json');

// データ読み込み
function loadArticles() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { articles: [] };
    }
}

// データ保存
function saveArticles(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// OGP情報を取得
async function fetchOGP(url) {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'ja,en-US;q=0.7,en;q=0.3',
            },
            timeout: 10000
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const html = await response.text();
        const $ = cheerio.load(html);
        
        // OGP情報を抽出
        const ogp = {
            title: $('meta[property="og:title"]').attr('content') || 
                   $('meta[name="twitter:title"]').attr('content') || 
                   $('title').text() || '',
            description: $('meta[property="og:description"]').attr('content') || 
                        $('meta[name="twitter:description"]').attr('content') || 
                        $('meta[name="description"]').attr('content') || '',
            image: $('meta[property="og:image"]').attr('content') || 
                   $('meta[name="twitter:image"]').attr('content') || '',
            url: $('meta[property="og:url"]').attr('content') || url,
            siteName: $('meta[property="og:site_name"]').attr('content') || '',
        };
        
        // ソース（ドメイン）を抽出
        try {
            const urlObj = new URL(url);
            let source = urlObj.hostname.replace('www.', '');
            
            // 特定サイトの表示名を調整
            if (source.includes('note.com')) source = 'note';
            else if (source.includes('twitter.com') || source.includes('x.com')) source = 'X (Twitter)';
            else if (source.includes('youtube.com')) source = 'YouTube';
            else if (source.includes('ameblo.jp')) source = 'Ameba';
            
            ogp.source = source;
        } catch {
            ogp.source = 'Web';
        }
        
        return ogp;
    } catch (error) {
        console.error('OGP取得エラー:', error.message);
        throw error;
    }
}

// 認証ミドルウェア（管理者API用）
function requireAuth(req, res, next) {
    const authHeader = req.headers['x-admin-password'];
    
    if (!authHeader || authHeader !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: '認証が必要です' });
    }
    
    next();
}

// 静的ファイル配信（admin.html以外）
app.use(express.static('public', {
    index: 'index.html'
}));

// API: 認証確認
app.post('/api/auth/verify', (req, res) => {
    const { password } = req.body;
    
    if (password === ADMIN_PASSWORD) {
        res.json({ success: true });
    } else {
        res.status(401).json({ error: 'パスワードが正しくありません' });
    }
});

// API: 全記事取得（公開）
app.get('/api/articles', (req, res) => {
    const data = loadArticles();
    const { category } = req.query;
    
    let articles = data.articles;
    
    // カテゴリフィルタ
    if (category && category !== 'all') {
        articles = articles.filter(a => a.category === category);
    }
    
    // 日付順（新しい順）でソート
    articles.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
    
    res.json({ articles });
});

// API: 人気記事取得（公開）
app.get('/api/articles/popular', (req, res) => {
    const data = loadArticles();
    const limit = parseInt(req.query.limit) || 10;
    
    const articles = data.articles
        .sort((a, b) => b.views - a.views)
        .slice(0, limit);
    
    res.json({ articles });
});

// API: OGPプレビュー取得（認証必要）
app.post('/api/ogp/preview', requireAuth, async (req, res) => {
    const { url } = req.body;
    
    if (!url) {
        return res.status(400).json({ error: 'URLが必要です' });
    }
    
    try {
        const ogp = await fetchOGP(url);
        res.json(ogp);
    } catch (error) {
        res.status(500).json({ error: 'OGP情報の取得に失敗しました: ' + error.message });
    }
});

// API: 記事追加（認証必要）
app.post('/api/articles', requireAuth, async (req, res) => {
    const { url, title, description, image, category, source } = req.body;
    
    if (!url || !title || !category) {
        return res.status(400).json({ error: 'URL、タイトル、カテゴリは必須です' });
    }
    
    const data = loadArticles();
    
    // 重複チェック
    if (data.articles.some(a => a.url === url)) {
        return res.status(400).json({ error: 'この記事は既に登録されています' });
    }
    
    const newArticle = {
        id: uuidv4(),
        url,
        title,
        description: description || '',
        image: image || '',
        category,
        source: source || 'Web',
        addedDate: new Date().toISOString(),
        views: 0
    };
    
    data.articles.unshift(newArticle);
    saveArticles(data);
    
    res.json({ success: true, article: newArticle });
});

// API: 記事削除（認証必要）
app.delete('/api/articles/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    const data = loadArticles();
    
    const index = data.articles.findIndex(a => a.id === id);
    if (index === -1) {
        return res.status(404).json({ error: '記事が見つかりません' });
    }
    
    data.articles.splice(index, 1);
    saveArticles(data);
    
    res.json({ success: true });
});

// API: 閲覧数カウント（公開）
app.post('/api/articles/:id/view', (req, res) => {
    const { id } = req.params;
    const data = loadArticles();
    
    const article = data.articles.find(a => a.id === id);
    if (article) {
        article.views = (article.views || 0) + 1;
        saveArticles(data);
    }
    
    res.json({ success: true });
});

// サーバー起動
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 トイ・サイクル戦略室 サーバー起動`);
    console.log(`   http://localhost:${PORT}`);
    console.log(`   管理画面: http://localhost:${PORT}/admin.html`);
    console.log(`   管理者パスワード: ${ADMIN_PASSWORD === 'admin123' ? '(デフォルト: admin123)' : '(環境変数で設定済み)'}`);
});
