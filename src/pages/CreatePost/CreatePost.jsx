import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

import styles from './CreatePost.module.css';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const docRef = await addDoc(collection(db, 'posts'), {
        title,
        content,
        authorId: user.uid,
        createdAt: new Date(),
      });
      console.log('Post criado com ID:', docRef.id);
      navigate('/dashboard');
    } catch (err) {
      console.error('Erro ao criar post:', err);
      setError('Erro ao criar o post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.createPost}>
      <h2>Criar Novo Post</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.formGroup}>
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="content">Conteúdo:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="8"
          ></textarea>
        </div>
        <div className={styles.buttonContainer}> 
          {!loading && <button type="submit" className={styles.btn}>Salvar</button>}
          {loading && (
            <button type="submit" className={styles.btn} disabled>
              Salvando...
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreatePost;