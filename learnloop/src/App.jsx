import {useEffect,useState} from 'react'
import {Routes,Route,Link} from 'react-router-dom'
import {ProgressProvider} from './state'
import {Empty} from './ui'
import CourseList from './pages/CourseList'
import CourseDetail from './pages/CourseDetail'
import Quiz from './pages/Quiz'
import Auth from './pages/Auth'
import { api } from './api'

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
          <Route path="/" element={<CourseList/>}/>
          <Route path="/auth" element={<Auth/>}/>
          <Route path="/courses/:id" element={<CourseDetail/>}/>
          <Route path="/courses/:id/quiz" element={<Quiz/>}/>
          <Route path="*" element={<Empty title="Page not found" text="That link doesn't lead anywhere." action={<Link className="btn" to="/">Browse courses</Link>}/>}/>
        </Routes>
      </main>
    </ProgressProvider>
  )
}
