import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import styles from './EditPost.module.css';

const EditPost = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postRef = doc(db, 'posts', id);
                const postSnap = await getDoc(postRef);

                if (postSnap.exists()) {
                    const postData = postSnap.data();
                    if (user && postData.authorId === user.uid) {
                        setTitle(postData.title);
                        setContent(postData.content);
                        setLoading(false);
                    } else {
                        setError('Você não tem permissão para editar este post.');
                        setLoading(false);
                    }
                } else {
                    setError('Post não encontrado.');
                    setLoading(false);
                }
            } catch (error) {
                console.error('Erro ao buscar post:', error);
                setError('Erro ao buscar post.');
                setLoading(false);
            }
        };

        fetchPost();
    }, [id, user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const postRef = doc(db, 'posts', id);
            await updateDoc(postRef, {
                title,
                content,
                updatedAt: new Date(),
            });
            navigate('/dashboard');
        } catch (error) {
            console.error('Erro ao atualizar post:', error);
            setError('Erro ao atualizar post.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Carregando post...</p>;
    }

    if (error) {
        return <p className={styles.error}>{error}</p>;
    }

    return (
        <div className={styles.editPost}>
            <h2>Editar Post</h2>
            <form onSubmit={handleUpdate}>
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
                    ></textarea>
                </div>
                <button type="submit" className={styles.btn} disabled={loading}>
                    {loading ? 'Atualizando...' : 'Atualizar Post'}
                </button>
                {error && <p className={styles.error}>{error}</p>}
            </form>
        </div>
    );
}

export default EditPost;