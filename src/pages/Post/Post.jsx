import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config.jsx";

const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Post encontrado:", docSnap.data());
          setPost({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("Post não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar post:", error);
      }
    };

    fetchPost();
  }, [id]);

  if (!post) return <p>Carregando post...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{post.title}</h1>
      <p>
        <strong>Autor:</strong> {post.author || "Desconhecido"}
      </p>
      <div>
        <p>{post.content}</p>
      </div>
    </div>
  );
};

export default Post;
