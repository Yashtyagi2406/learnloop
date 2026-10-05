import {useState} from 'react'
import {Link,useParams} from 'react-router-dom'
import {api} from '../api'
import {useAsync,useProgress} from '../state'
import {Segs,Loading,ErrorBox} from '../ui'

export default function CourseDetail(){
  const {id}=useParams()
  const {data:c,loading,error,retry}=useAsync(()=>api.getCourse(id),[id])
  const {isDone,toggle,count}=useProgress()
  const [idx,setIdx]=useState(0)
  if(loading) return <Loading n={1}/>
  if(error) return <><Link to="/" className="back">All courses</Link><ErrorBox message={error} onRetry={retry}/></>

  const l=c.lessons[idx]
  const n=count(c.id)
  return (
    <>
      <Link to="/" className="back">All courses</Link>
      <h1>{c.title}</h1>
      <p className="lead">{c.description}</p>
      <div className="overall"><span>{n} of {c.lessons.length} lessons completed</span><Segs n={n} total={c.lessons.length}/></div>
      <div className="split">
        <nav className="lessons" aria-label="Lessons">
          {c.lessons.map((x,i)=>(
            <button key={x.id} className={`lesson ${i===idx?'on':''}`} onClick={()=>setIdx(i)}>
              <span className={`dot ${isDone(c.id,x.id)?'ok':''}`}>{isDone(c.id,x.id)?'✓':i+1}</span>{x.title}
            </button>
          ))}
        </nav>
        <article key={l.id} className="panel fade">
          <h2>{l.title}</h2>
          <p>{l.content}</p>
          <button className={isDone(c.id,l.id)?'btn ghost':'btn'} onClick={()=>toggle(c.id,l.id)}>
            {isDone(c.id,l.id)?'Completed. Undo':'Mark as completed'}
          </button>
        </article>
      </div>
      <Link className="btn" to={`/courses/${c.id}/quiz`}>Start quiz</Link>
    </>
  )
}
