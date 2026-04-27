import { useBlog } from '../context/BlogContext';
import ArticleCard from '../components/ArticleCard';
import './HomePage.css';

const HomePage = () => {
  const { articles, viewMode, toggleViewMode } = useBlog();

  return (
    <div className="home-page">
      <header className="page-header">
        <h1>Блог</h1>
        <div className="view-toggle">
          <button
            onClick={toggleViewMode}
            className={`toggle-btn ${viewMode}`}
          >
            {viewMode === 'grid' ? 'Сетка' : 'Список'}
          </button>
        </div>
      </header>

      <div className={`articles-container ${viewMode}`}>
        {articles.length === 0 ? (
          <p className="no-articles">Статей пока нет</p>
        ) : (
          articles.map((article) => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              viewMode={viewMode}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;
