import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login/Login.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Post from './pages/Post/Post.jsx';
import CreatePost from './pages/CreatePost/CreatePost.jsx';
import { useAuth, AuthProvider } from './contexts/AuthContext.jsx';
import Register from './pages/Register/Register.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import EditPost from './pages/EditPost/EditPost.jsx';
import { useAuthState } from './hooks/useAuthState';




const PrivateRoute = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  const { user, loading } = useAuthState();

  if (loading) {
    return <p>Carregando...</p>;
  }
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes >
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={user ? <Outlet /> : <Navigate to="/login" />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/post/new" element={<CreatePost />} />
            <Route path="/post/edit/:id" element={<EditPost />} />
          </Route>
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;