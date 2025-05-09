import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../firebase/config.jsx";

const Navbar = () => {
  const { user } = useAuth();

  const logout = () => auth.signOut();

  return (
    <nav>
      {!user ? (
        <>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Cadastre-se</NavLink>
        </>
      ) : (
        <>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/post/new">Novo Post</NavLink>
          <button onClick={logout}>Logout</button>
        </>
      )}
    </nav>
  );
};

export default Navbar;
