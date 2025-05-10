import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard.jsx';
import CreatePost from '../pages/CreatePost/CreatePost.jsx';
import Post from '../pages/Post/Post.jsx';
import PrivateRoute from './PrivateRoute';
import Register from '../pages/Register/Register.jsx'


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/post/new" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
            <Route path="/post/:id" element={<PrivateRoute><Post /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
};

export default AppRoutes;
