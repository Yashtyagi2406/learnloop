import {useEffect,useState} from 'react'
import {Routes,Route,Link} from 'react-router-dom'
import {ProgressProvider} from './state'
import {Empty} from './ui'
import CourseList from './pages/CourseList'
import CourseDetail from './pages/CourseDetail'
import Quiz from './pages/Quiz'

export default function App(){
  const [theme,setTheme]=useState(()=>localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'))
  useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem('theme',theme)},[theme])
  return (
    <ProgressProvider>
      <header className="top">
        <Link to="/" className="brand">LearnLoop</Link>
        <button className="btn ghost" onClick={()=>setTheme(t=>t==='dark'?'light':'dark')}>{theme==='dark'?'Light mode':'Dark mode'}</button>
      </header>
      <main className="wrap">
        <Routes>
          <Route path="/" element={<CourseList/>}/>
          <Route path="/courses/:id" element={<CourseDetail/>}/>
          <Route path="/courses/:id/quiz" element={<Quiz/>}/>
          <Route path="*" element={<Empty title="Page not found" text="That link doesn't lead anywhere." action={<Link className="btn" to="/">Browse courses</Link>}/>}/>
        </Routes>
      </main>
    </ProgressProvider>
  )
}
