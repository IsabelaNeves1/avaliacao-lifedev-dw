import styles from './Login.module.css';
import { useEffect, useState } from 'react';
import { useAuthentication } from '../../hooks/useAuthentication';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { db } from '../../firebase/config';
import { collection, doc, setDoc } from 'firebase/firestore'; 

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { login, error: authError, loading } = useAuthentication();
    const navigate = useNavigate();

    const handlerSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const user = {
            email,
            password,
        };
        const loggedInUser = await login(user);
        if (loggedInUser) {
            navigate('/dashboard');
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();

            provider.setCustomParameters({
                prompt: 'select_account'
            });
            
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const usersCollection = collection(db, 'users'); 
            const userDocRef = doc(usersCollection, user.uid); 
            await setDoc(userDocRef, { 
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
            }, { merge: true });

            navigate('/dashboard');

        } catch (error) {
            console.error('Erro ao fazer login com o Google:', error);
            setError(error.message);
        }
    };

    useEffect(() => {
        if (authError) {
            setError(authError);
        }
    }, [authError]);

    return (
        <div className={styles.login}>
            <h1>Entrar</h1>
            <p>Faça login em nossa plataforma de desenvolvedores</p>
            <form onSubmit={handlerSubmit} className={styles.form}>
                <label>
                    <span>E-mail: </span>
                    <input
                        type="email"
                        name="email"
                        required
                        placeholder="E-mail do usuário"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </label>
                <label>
                    <span>Senha: </span>
                    <input
                        type="password"
                        name="password"
                        required
                        placeholder="Insira sua senha"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                </label>
                {!loading && <button className={styles.btn}>Entrar</button>}
                {loading && (
                    <button className={styles.btn} disabled>
                        Aguarde...
                    </button>
                )}
                {error && <p className={styles.error}>{error}</p>}
            </form>
            <p className={styles.or}>OU</p>

            <button type="button" className={styles.googleButton} onClick={handleGoogleSignIn}>
                <svg className={styles.googleIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                    <path fill="#4285F4" d="M43.6 20.5H42V20H24v8h11.3C33.6 33.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.6 6.2 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
                    <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14 16.1 18.7 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.6 6.2 29.6 4 24 4 16.2 4 9.4 8.4 6.3 14.7z" />
                    <path fill="#FBBC05" d="M24 44c5.5 0 10.5-2.1 14.1-5.6l-6.5-5c-2.1 1.6-4.8 2.6-7.6 2.6-5.5 0-10.2-3.7-11.8-8.6l-6.6 5c3.1 6.4 9.9 11.6 18.4 11.6z" />
                </svg>
                Entrar com o Google
            </button>
        </div>
    );
};
export default Login;