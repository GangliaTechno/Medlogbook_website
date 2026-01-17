import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../reducers/authReducer';

const SocialAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const token = searchParams.get('token');
        const role = searchParams.get('role');

        if (token && role) {
            // Store token in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);

            // Decode token to get user info (simple decode, not verification)
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                    atob(base64)
                        .split('')
                        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                        .join('')
                );
                const user = JSON.parse(jsonPayload);

                // Update Redux state
                dispatch(setUser({ user, token, role }));

                // Redirect based on role
                if (role === 'admin') {
                    navigate('/admin', { replace: true });
                } else if (role === 'doctor') {
                    navigate('/doctor', { replace: true });
                } else if (role === 'student') {
                    navigate('/logbookpage', { replace: true });
                } else {
                    navigate('/', { replace: true });
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                navigate('/login', { replace: true });
            }
        } else {
            // No token, redirect to login
            navigate('/login', { replace: true });
        }
    }, [searchParams, navigate, dispatch]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="text-center">
                <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-700">Completing sign in...</h2>
                <p className="text-gray-500 mt-2">Please wait while we redirect you</p>
            </div>
        </div>
    );
};

export default SocialAuthCallback;
