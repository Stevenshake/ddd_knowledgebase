import { createContext, useContext, useState, useCallback } from 'react';

const BlogContext = createContext(null);

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};

export const BlogProvider = ({ children }) => {
  const [articles, setArticles] = useState([
    {
      id: '1',
      slug: 'welcome-to-blog',
      title: 'Добро пожаловать в блог',
      banner: '/articles/welcome-to-blog/banner.jpg',
      excerpt: 'Это первая статья нашего нового блога. Здесь мы будем публиковать интересные материалы.',
      content: `# Добро пожаловать!

Это первая статья нашего нового блога. Мы рады приветствовать вас!

## Что вас ждет

Здесь вы найдете много интересного контента.`,
      gallery: [],
      order: 0,
      createdAt: new Date().toISOString(),
    },
  ]);

  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const getArticles = useCallback(() => {
    return [...articles].sort((a, b) => a.order - b.order);
  }, [articles]);

  const getArticleBySlug = useCallback((slug) => {
    return articles.find(article => article.slug === slug);
  }, [articles]);

  const addArticle = useCallback((article) => {
    const newArticle = {
      ...article,
      id: Date.now().toString(),
      order: articles.length,
      createdAt: new Date().toISOString(),
    };
    setArticles(prev => [...prev, newArticle]);
    return newArticle;
  }, [articles.length]);

  const updateArticle = useCallback((slug, updates) => {
    setArticles(prev => prev.map(article => 
      article.slug === slug ? { ...article, ...updates } : article
    ));
  }, []);

  const deleteArticle = useCallback((id) => {
    setArticles(prev => prev.filter(article => article.id !== id));
  }, []);

  const reorderArticles = useCallback((newOrder) => {
    setArticles(newOrder);
  }, []);

  const toggleViewMode = useCallback(() => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  }, []);

  const value = {
    articles: getArticles(),
    getArticleBySlug,
    addArticle,
    updateArticle,
    deleteArticle,
    reorderArticles,
    viewMode,
    toggleViewMode,
  };

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  );
};
