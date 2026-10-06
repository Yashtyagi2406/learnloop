import {useEffect,useState} from 'react'
import {Routes,Route,Link,Navigate} from 'react-router-dom'
import {ProgressProvider} from './state'
import {Empty} from './ui'
import CourseList from './pages/CourseList'
import CourseDetail from './pages/CourseDetail'
import Quiz from './pages/Quiz'
import Auth from './pages/Auth'
import { api } from './api'

// Redirects to /auth if no token is present
function ProtectedRoute({children}){
  const isAuth = Boolean(localStorage.getItem('token'))
  return isAuth ? children : <Navigate to="/auth" replace />
}

// Redirects already-logged-in users away from /auth
function PublicOnlyRoute({children}){
  const isAuth = Boolean(localStorage.getItem('token'))
  return isAuth ? <Navigate to="/" replace /> : children
}

export default function App(){
  const [theme,setTheme]=useState(()=>localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'))
  const [hasToken, setHasToken] = useState(() => Boolean(localStorage.getItem('token')))

  useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem('theme',theme)},[theme])

  const handleLogout = () => {
    api.logout()
    setHasToken(false)
    window.location.reload()
  }

  return (
    <ProgressProvider>
      <header className="top">
        <Link to="/" className="brand">LearnLoop</Link>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {hasToken ? (
            <button className="btn ghost" onClick={handleLogout}>Sign out</button>
          ) : (
            <Link to="/auth" className="btn ghost">Sign in</Link>
          )}
          <button className="btn ghost" onClick={()=>setTheme(t=>t==='dark'?'light':'dark')}>{theme==='dark'?'Light mode':'Dark mode'}</button>
        </div>
      </header>
      <main className="wrap">
        <Routes>
          <Route path="/auth" element={<PublicOnlyRoute><Auth/></PublicOnlyRoute>}/>
          <Route path="/" element={<ProtectedRoute><CourseList/></ProtectedRoute>}/>
          <Route path="/courses/:id" element={<ProtectedRoute><CourseDetail/></ProtectedRoute>}/>
          <Route path="/courses/:id/quiz" element={<ProtectedRoute><Quiz/></ProtectedRoute>}/>
          <Route path="*" element={<Empty title="Page not found" text="That link doesn't lead anywhere." action={<Link className="btn" to="/">Browse courses</Link>}/>}/>
        </Routes>
      </main>
    </ProgressProvider>
  )
}
