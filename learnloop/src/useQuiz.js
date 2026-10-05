import {useEffect,useState} from 'react'

export function useQuiz({seconds,questions}){
  const [i,setI]=useState(0)
  const [answers,setAnswers]=useState({})
  const [left,setLeft]=useState(seconds)
  const [finished,setFinished]=useState(false)
  useEffect(()=>{
    if(finished) return
    if(left<=0){setFinished(true);return}
    const t=setTimeout(()=>setLeft(l=>l-1),1000)
    return ()=>clearTimeout(t)
  },[left,finished])
  return {
    i,answers,left,finished,timedOut:left<=0,
    score:questions.filter((q,k)=>answers[k]===q.answer).length,
    go:setI,
    select:o=>setAnswers(a=>({...a,[i]:o})),
    finish:()=>setFinished(true),
    retry:()=>{setI(0);setAnswers({});setLeft(seconds);setFinished(false)}
  }
}
