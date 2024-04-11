import React from 'react';
import AuthContext from './authContext';
import { useNavigate } from 'react-router-dom';

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = React.useState(!!localStorage.getItem('accessToken'));
    const [redirectTo, setRedirectTo] = React.useState(null);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const navigate = useNavigate();

    async function login(login, password, role) {
        const response = await fetch('http://localhost:8080/api/v1/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            username: login,
            password: password,
            scope: role,
          }),
        });
    
        if (!response.ok) {
          throw new Error(`Error logging in. Status code: ${response.status}`);
        }
    
        setIsAuthenticated(true);
    
        if (role === "Patient") {
            setRedirectTo(`/patient/account/${login}`);
        } else if (role === "Doctor") {
            setRedirectTo(`/doctor/account/${login}`);
        } else if (role === "Admin") {
            setRedirectTo(`/admin_page/${login}`);
        }
      
        const userData = {'login': login, 'role': role};
        localStorage.setItem('currentUserData', JSON.stringify(userData));
    
        return response;
    }        

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, login, redirectTo, setRedirectTo }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
