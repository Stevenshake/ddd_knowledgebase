import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import GalleryEditor from '../components/GalleryEditor';
import './ArticleEditor.css';

const ArticleEditor = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getArticleBySlug, addArticle, updateArticle } = useBlog();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    banner: '',
    excerpt: '',
    content: '',
    gallery: [],
  });

  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');

  useEffect(() => {
    if (slug) {
      const article = getArticleBySlug(slug);
      if (article) {
        setFormData({
          title: article.title || '',
          slug: article.slug || '',
          banner: article.banner || '',
          excerpt: article.excerpt || '',
          content: article.content || '',
          gallery: article.gallery || [],
        });
        setBannerPreview(article.banner || '');
      }
    }
  }, [slug, getArticleBySlug]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9а-яё\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const newSlug = generateSlug(title);
    setFormData(prev => ({
      ...prev,
      title,
      slug: slug ? prev.slug : newSlug,
    }));
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      const url = URL.createObjectURL(file);
      setBannerPreview(url);
    }
  };

  const handleGalleryChange = (galleryImages) => {
    setFormData(prev => ({
      ...prev,
      gallery: galleryImages,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      alert('Заполните обязательные поля (название и контент)');
      return;
    }

    const articleData = {
      ...formData,
      banner: bannerFile ? `/articles/${formData.slug}/banner.jpg` : formData.banner,
    };

    if (slug) {
      updateArticle(slug, articleData);
    } else {
      addArticle(articleData);
    }

    navigate('/admin');
  };

  const isEditMode = !!slug;

  return (
    <div className="article-editor">
      <header className="editor-header">
        <h1>{isEditMode ? 'Редактирование статьи' : 'Создание новой статьи'}</h1>
        <button onClick={() => navigate('/admin')} className="cancel-btn">
          Отмена
        </button>
      </header>

      <form onSubmit={handleSubmit} className="editor-form">
        <div className="form-group">
          <label htmlFor="title">Название статьи *</label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={handleTitleChange}
            placeholder="Введите название статьи"
            required
          />
        </div>

        {!isEditMode && (
          <div className="form-group">
            <label htmlFor="slug">URL (slug)</label>
            <input
              id="slug"
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="article-url-slug"
              pattern="[a-z0-9-]+"
              title="Только латинские буквы, цифры и дефисы"
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="banner">Баннер статьи</label>
          <div className="banner-upload">
            {bannerPreview && (
              <div className="banner-preview">
                <img src={bannerPreview} alt="Banner preview" />
              </div>
            )}
            <input
              id="banner"
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
            />
            <span className="upload-hint">
              {bannerFile ? bannerFile.name : 'Выберите изображение для баннера'}
            </span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="excerpt">Краткое описание (анонс)</label>
          <textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
            placeholder="Краткое описание статьи (отобразится на главной)"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Содержимое статьи (Markdown) *</label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            placeholder="# Заголовок&#10;&#10;Текст статьи в формате Markdown..."
            rows="15"
            required
          />
          <p className="markdown-hint">
            Используйте синтаксис Markdown для форматирования текста
          </p>
        </div>

        <div className="form-group">
          <label>Галерея изображений</label>
          <GalleryEditor 
            images={formData.gallery} 
            onChange={handleGalleryChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn">
            {isEditMode ? 'Сохранить изменения' : 'Опубликовать статью'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleEditor;
