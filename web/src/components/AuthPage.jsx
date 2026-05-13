import { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

const AuthPage = () => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isLogin) {
        const result = await api.auth.login({
          email: formData.email,
          password: formData.password
        });
        
        // Sucesso no Login (Contexto Global)
        login(result.user, { 
          accessToken: result.accessToken, 
          refreshToken: result.refreshToken 
        });
        
        setSuccess(`Bem-vindo, ${result.user.name}! Redirecionando...`);
      } else {
        const result = await api.auth.signup(formData);
        
        // Sucesso no Registro
        if (result.user) {
          setSuccess('Conta criada com sucesso! Faça login para continuar.');
          setIsLogin(true);
        } else {
          setSuccess(result.message);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="brand-title">SYNQ</h1>
        <p className="brand-subtitle">
          {isLogin ? 'Organize seu fluxo.' : 'Crie sua conta e comece agora.'}
        </p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="input-group">
              <label>Nome</label>
              <input 
                type="text" 
                placeholder="Seu nome"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
                disabled={loading}
              />
            </div>
          )}
          
          <div className="input-group">
            <label>E-mail</label>
            <input 
              type="email" 
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label>Senha</label>
            <input 
              type="password" 
              placeholder="••••••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
              minLength={12}
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'PROCESSANDO...' : (isLogin ? 'ENTRAR NA PLATAFORMA' : 'CRIAR CONTA')}
          </button>
        </form>

        <p className="auth-toggle">
          {isLogin ? 'Não tem conta?' : 'Já possui conta?'} 
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Crie aqui' : 'Faça login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
