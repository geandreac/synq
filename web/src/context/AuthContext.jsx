import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se existe token ao carregar o app
    const token = localStorage.getItem('synq_token');
    if (token) {
      // TODO: Validar token com o backend ou decodificar
      // Por enquanto, assumimos logado se houver token
      setUser({ loggedIn: true }); 
    }
    setLoading(false);
  }, []);

  const login = (userData, tokens) => {
    localStorage.setItem('synq_token', tokens.accessToken);
    localStorage.setItem('synq_refresh', tokens.refreshToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('synq_token');
    localStorage.removeItem('synq_refresh');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, authenticated: !!user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
