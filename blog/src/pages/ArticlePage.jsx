import { useParams, Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import ArticleContent from '../components/ArticleContent';
import './ArticlePage.css';

const ArticlePage = () => {
  const { slug } = useParams();
  const { getArticleBySlug } = useBlog();

  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <div className="article-page not-found">
        <h1>Статья не найдена</h1>
        <Link to="/" className="back-link">← Вернуться на главную</Link>
      </div>
    );
  }

  return (
    <article className="article-page">
      <header className="article-header">
        <Link to="/" className="back-link">← Назад к статьям</Link>
        <h1>{article.title}</h1>
        {article.banner && (
          <div className="article-banner">
            <img 
              src={article.banner} 
              alt={article.title}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/1200x400?text=No+Image';
              }}
            />
          </div>
        )}
      </header>

      <div className="article-body">
        <ArticleContent content={article.content} />
      </div>

      {article.gallery && article.gallery.length > 0 && (
        <section className="article-gallery">
          <h2>Галерея</h2>
          <div className="gallery-grid">
            {article.gallery.map((image, index) => (
              <div key={image.id || index} className="gallery-item">
                <img 
                  src={image.url} 
                  alt={image.alt || `Изображение ${index + 1}`}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="article-footer">
        <Link to="/" className="back-link">← Вернуться на главную</Link>
      </footer>
    </article>
  );
};

export default ArticlePage;
