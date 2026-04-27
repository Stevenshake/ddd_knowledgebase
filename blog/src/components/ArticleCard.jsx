import { Link } from 'react-router-dom';
import './ArticleCard.css';

const ArticleCard = ({ article, viewMode = 'grid' }) => {
  if (viewMode === 'list') {
    return (
      <Link to={`/article/${article.slug}`} className="article-card list">
        <div className="article-banner">
          <img 
            src={article.banner || '/placeholder-banner.jpg'} 
            alt={article.title}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x250?text=No+Image';
            }}
          />
        </div>
        <div className="article-info">
          <h3 className="article-title">{article.title}</h3>
          <p className="article-excerpt">{article.excerpt}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/article/${article.slug}`} className="article-card grid">
      <div className="article-banner">
        <img 
          src={article.banner || '/placeholder-banner.jpg'} 
          alt={article.title}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x250?text=No+Image';
          }}
        />
      </div>
      <div className="article-info">
        <h3 className="article-title">{article.title}</h3>
        <p className="article-excerpt">{article.excerpt}</p>
      </div>
    </Link>
  );
};

export default ArticleCard;
