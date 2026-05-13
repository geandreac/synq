import AuthPage from './components/AuthPage'
import Dashboard from './components/Dashboard'
import { useAuth } from './context/AuthContext'

function App() {
  const { authenticated } = useAuth();

  return (
    authenticated ? <Dashboard /> : <AuthPage />
  )
}

export default App
