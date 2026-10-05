import {createContext,useContext,useEffect,useState,useCallback} from 'react'
import {api} from './api'

const Ctx=createContext(null)
export const useProgress=()=>useContext(Ctx)

// progress shape: { [courseId]: [completedLessonId, ...] }
export function ProgressProvider({children}){
  const [done,setDone]=useState({})
  useEffect(()=>{api.getProgress().then(setDone).catch(()=>{})},[])
  const count=c=>(done[c]||[]).length
  const isDone=(c,l)=>(done[c]||[]).includes(l)
  const toggle=(c,l)=>{
    const cur=done[c]||[]
    const next={...done,[c]:cur.includes(l)?cur.filter(x=>x!==l):[...cur,l]}
    setDone(next)
    api.saveProgress(next).catch(()=>{})
  }
  return <Ctx.Provider value={{count,isDone,toggle}}>{children}</Ctx.Provider>
}

export function useAsync(fn,deps){
  const [s,setS]=useState({loading:true})
  const run=useCallback(()=>{
    setS({loading:true})
    fn().then(data=>setS({data}),e=>setS({error:e.message}))
  },deps)
  useEffect(()=>{run()},[run])
  return {...s,retry:run}
}
