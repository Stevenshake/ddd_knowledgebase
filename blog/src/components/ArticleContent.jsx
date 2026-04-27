import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './ArticleContent.css';

const ArticleContent = ({ content }) => {
  return (
    <div className="article-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default ArticleContent;
