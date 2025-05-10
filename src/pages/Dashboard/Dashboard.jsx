import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { collection, getDocs, query, orderBy, deleteDoc, doc, getDoc } from 'firebase/firestore'; 
import { db } from '../../firebase/config.jsx';
import styles from './Dashboard.module.css';
import { useAuth } from '../../contexts/AuthContext.jsx';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [usersData, setUsersData] = useState({}); 
  const { user } = useAuth();

  useEffect(() => {
    const fetchPostsAndAuthors = async () => {
      try {
        const postsCollection = collection(db, 'posts');
        const q = query(postsCollection, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const postsWithAuthorIds = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsWithAuthorIds);

        const authorIds = [...new Set(postsWithAuthorIds.map((post) => post.authorId).filter(id => id))];
        const usersInfo = {};
        for (const authorId of authorIds) {
          const userDocRef = doc(db, 'users', authorId);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            usersInfo[authorId] = userSnap.data().displayName || 'Desconhecido';
          } else {
            usersInfo[authorId] = 'Desconhecido';
          }
        }
        setUsersData(usersInfo);

      } catch (error) {
        console.error('Erro ao buscar posts e autores:', error);
      }
    };

    fetchPostsAndAuthors();
  }, []);

  const handleDelete = async (id) => {
    if (!user) {
      alert('Você precisa estar logado para excluir um post');
      return;
    }

    if (window.confirm('Tem certeza que deseja excluir este post?')) {
      try {
        const postToDelete = posts.find(post => post.id === id);
        if (postToDelete?.authorId !== user?.uid) {
          alert('Você não tem permissão para excluir este post.');
          return;
        }

        await deleteDoc(doc(db, 'posts', id));
        setPosts(posts.filter((post) => post.id !== id));
        console.log(`Post com ID ${id} excluído com sucesso.`);
      } catch (error) {
        console.error('Erro ao excluir post:', error);
      }
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <h1>Dashboard</h1>
      {posts.length === 0 ? (
        <p>Nenhum post encontrado.</p>
      ) : (
        <div className={styles.postGrid}>
          {posts.map((post) => (
            <div key={post.id} className={styles.postCard}>
              <div>
                <h3>{post.title}</h3>
                <p className={styles.author}>
                  <strong>Autor:</strong> {post.authorId === user?.uid ? user?.displayName || 'Você' : usersData[post.authorId] || 'Desconhecido'}
                </p>
              </div>
              <div className={styles.postActions}>
                <div className={styles.actionButtons}>
                  {post.authorId === user?.uid && (
                    <>
                      <NavLink to={`/post/edit/${post.id}`} className={styles.editButton}>
                        Editar
                      </NavLink>
                      <button onClick={() => handleDelete(post.id)} className={styles.deleteButton}>
                        Excluir
                      </button>
                    </>
                  )}
                </div>
                <NavLink to={`/post/${post.id}`} className={styles.viewPostButton}>
                  Ver post completo
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
