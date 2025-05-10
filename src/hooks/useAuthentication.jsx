import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth'
import { auth } from "../firebase/config"
import { useState, useEffect } from "react"

export const useAuthentication = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const [cancelled, setCancelled] = useState(false);

  function checkIfIsCancelled() {
      if (cancelled) {
          return;
      }
  }

  const createUser = async (data) => {
      checkIfIsCancelled();
      setLoading(true);
      setError(null); // Limpar erros anteriores

      try {
          const { user } = await createUserWithEmailAndPassword(
              auth,
              data.email,
              data.password
          );

          await updateProfile(user, {
              displayName: data.displayName,
          });

          setLoading(false);
          return user; // Retorna o usuário criado
      } catch (error) {
          console.log(error.message);

          let systemErrorMessage;
          if (error.message.includes("Password")) {
              systemErrorMessage = "A senha precisa conter pelo menos 6 caracteres.";
          } else if (error.message.includes("email-already")) {
              systemErrorMessage = "E-mail já cadastrado.";
          } else {
              systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde.";
          }
          setError(systemErrorMessage);
          setLoading(false);
      }
  };

  const logout = () => {
      checkIfIsCancelled();
      signOut(auth);
  };

  const login = async (data) => {
      checkIfIsCancelled();
      setLoading(true);
      setError(null); // Limpar erros anteriores

      try {
          const res = await signInWithEmailAndPassword(auth, data.email, data.password);
          setLoading(false);
          return res.user; // Retorna o usuário logado
      } catch (error) {
          console.log(error.message);

          let systemErrorMessage;
          if (error.message.includes("user-not-found")) {
              systemErrorMessage = "Usuário não encontrado.";
          } else if (error.message.includes("wrong-password")) {
              systemErrorMessage = "Senha incorreta.";
          } else {
              systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde.";
          }
          setError(systemErrorMessage);
          setLoading(false);
      }
  };

  useEffect(() => {
      return () => setCancelled(true);
  }, []);

  return {
      auth,
      createUser,
      error,
      logout,
      login,
      loading,
  };
};