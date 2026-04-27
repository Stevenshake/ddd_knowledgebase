import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import GalleryEditor from '../components/GalleryEditor';
import './AdminPage.css';

const AdminPage = () => {
  const { articles, reorderArticles, deleteArticle } = useBlog();
  const navigate = useNavigate();
  const [localArticles, setLocalArticles] = useState([]);

  useEffect(() => {
    setLocalArticles(articles);
  }, [articles]);

  const handleDelete = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту статью?')) {
      deleteArticle(id);
    }
  };

  const handleEdit = (slug) => {
    navigate(`/admin/edit/${slug}`);
  };

  const handleAddNew = () => {
    navigate('/admin/create');
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setLocalArticles((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const newOrder = [...items];
        const [removed] = newOrder.splice(oldIndex, 1);
        newOrder.splice(newIndex, 0, removed);
        
        // Update order values
        const updatedArticles = newOrder.map((article, index) => ({
          ...article,
          order: index,
        }));
        
        setLocalArticles(updatedArticles);
        reorderArticles(updatedArticles);
        
        return updatedArticles;
      });
    }
  };

  return (
    <div className="admin-page">
      <header className="page-header">
        <h1>Управление статьями</h1>
        <button onClick={handleAddNew} className="add-btn">
          + Добавить статью
        </button>
      </header>

      <div className="articles-list">
        {localArticles.length === 0 ? (
          <p className="no-articles">Статей пока нет. Создайте первую!</p>
        ) : (
          <div className="sortable-list">
            {localArticles.map((article, index) => (
              <div key={article.id} className="article-item" data-id={article.id}>
                <div className="article-drag-handle">☰</div>
                <div className="article-info">
                  <span className="article-order">#{index + 1}</span>
                  <span className="article-title">{article.title}</span>
                </div>
                <div className="article-actions">
                  <button 
                    onClick={() => handleEdit(article.slug)}
                    className="edit-btn"
                  >
                    Редактировать
                  </button>
                  <button 
                    onClick={() => handleDelete(article.id)}
                    className="delete-btn"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
