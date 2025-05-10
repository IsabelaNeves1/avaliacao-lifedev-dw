import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../firebase/config.jsx";
import styles from './NavBar.module.css';
const Navbar = () => {
  const { user } = useAuth();

  const logout = () => auth.signOut();

  return (
    <nav className={styles.nav}>
      <NavLink to="/" className={styles.logo}>
        MeuDevBlog
      </NavLink>
      <div>
        {!user ? (
          <>
            <NavLink to="/login" className={styles.navLink} activeClassName={styles.active}>
              Login
            </NavLink>
            <NavLink to="/register" className={styles.navLink} activeClassName={styles.active}>
              Cadastre-se
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/dashboard" className={styles.navLink} activeClassName={styles.active}>
              Dashboard
            </NavLink>
            <NavLink to="/post/new" className={styles.navLink} activeClassName={styles.active}>
              Novo Post
            </NavLink>
            <button onClick={logout} className={styles.logoutButton}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
