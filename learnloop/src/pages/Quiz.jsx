import {useEffect} from 'react'
import {Link,useParams} from 'react-router-dom'
import {api} from '../api'
import {useAsync} from '../state'
import {useQuiz} from '../useQuiz'
import {Bar,Loading,ErrorBox} from '../ui'

const fmt=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`

export default function Quiz(){
  const {id}=useParams()
  const {data:c,loading,error,retry}=useAsync(()=>api.getCourse(id),[id])
  if(loading) return <Loading n={1}/>
  if(error) return <ErrorBox message={error} onRetry={retry}/>
  return <QuizBody course={c}/>
}

function QuizBody({course}){
  const qs=course.quiz.questions
  const z=useQuiz(course.quiz)
  useEffect(()=>{
    if(z.finished) api.saveResult({courseId:course.id,score:z.score,total:qs.length}).catch(()=>{})
  },[z.finished])

  if(z.finished) return (
    <section className="panel fade">
      <h1>{z.score} of {qs.length} correct</h1>
      <p className="lead">{Math.round(z.score/qs.length*100)}% score. {z.timedOut?"Time ran out.":'Quiz submitted.'}</p>
      <ul className="review">
        {qs.map((q,k)=>{
          const ok=z.answers[k]===q.answer
          return (
            <li key={k} className={ok?'good':'bad'}>
              <b>{ok?'Correct':'Incorrect'}: {q.q}</b>
              <span>Your answer: {q.options[z.answers[k]]??'No answer'}</span>
              {!ok&&<span>Correct answer: {q.options[q.answer]}</span>}
            </li>
          )
        })}
      </ul>
      <div className="row">
        <button className="btn" onClick={z.retry}>Retry quiz</button>
        <Link className="btn ghost" to={`/courses/${course.id}`}>Back to course</Link>
      </div>
    </section>
  )

  const q=qs[z.i]
  const last=z.i===qs.length-1
  return (
    <section className="panel">
      <div className="row between">
        <small>Question {z.i+1} of {qs.length}</small>
        <span className={`timer ${z.left<=10?'warn':''}`} role="timer">{fmt(z.left)} left</span>
      </div>
      <Bar value={(z.i+1)/qs.length}/>
      <div key={z.i} className="fade">
        <h2>{q.q}</h2>
        <div className="opts">
          {q.options.map((o,k)=>(
            <button key={k} className={`opt ${z.answers[z.i]===k?'on':''}`} onClick={()=>z.select(k)}>{o}</button>
          ))}
        </div>
      </div>
      <div className="row between">
        <button className="btn ghost" disabled={!z.i} onClick={()=>z.go(z.i-1)}>Previous</button>
        {last?<button className="btn" onClick={z.finish}>Submit quiz</button>
             :<button className="btn" onClick={()=>z.go(z.i+1)}>Next</button>}
      </div>
    </section>
  )
}
