import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/config.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "posts"), {
        title,
        content,
        author: user.displayName || "Anônimo",
        createdAt: new Date(),
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao criar post:", error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Novo Post</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "300px" }}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Conteúdo"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default CreatePost;
