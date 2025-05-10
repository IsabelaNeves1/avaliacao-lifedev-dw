import styles from "./Register.module.css";
import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useAuthentication } from "../../hooks/useAuthentication";
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config.jsx';

const Register = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { createUser, error: authError, loading } = useAuthentication();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const user = {
      displayName,
      email,
      password,
    };
    if (password !== confirmPassword) {
      setError("As senhas precisam ser iguais.");
      return;
    }
    const res = await createUser(user);

    if (res) {
      const usersCollection = collection(db, 'users');
      const userDocRef = doc(usersCollection, res.uid);
      await setDoc(userDocRef, {
        uid: res.uid,
        email: email,
        displayName: displayName,
      });

      navigate('/dashboard');
    } else if (authError) {
      setError(authError);
    } else {
      setError("Ocorreu um erro ao criar o usuário.");
    }
  };

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  return (
    <div className={styles.register}>
      <h2>Cadastre-se para postar</h2>
      <p>Crie seu usuário e compartilhe suas histórias</p>
      <form onSubmit={handleSubmit}>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.formGroup}>
          <label htmlFor="displayName">Nome:</label>
          <input type="text" id="displayName" onChange={(e) => setDisplayName(e.target.value)} value={displayName} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">E-mail:</label>
          <input type="email" id="email" onChange={(e) => setEmail(e.target.value)} value={email} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Senha:</label>
          <input type="password" id="password" onChange={(e) => setPassword(e.target.value)} value={password} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirmação de senha:</label>
          <input type="password" id="confirmPassword" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} />
        </div>
        <button type="submit" className={styles.btn} disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
        <p>Já tem uma conta? <NavLink to="/login" className={styles.loginLink}>Faça login</NavLink></p>
      </form>
    </div>
  );
};

export default Register;
