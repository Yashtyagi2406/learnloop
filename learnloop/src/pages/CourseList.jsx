import {useState} from 'react'
import {Link} from 'react-router-dom'
import {api} from '../api'
import {useAsync,useProgress} from '../state'
import {Bar,Segs,Loading,ErrorBox,Empty} from '../ui'

export default function CourseList(){
  const {data,loading,error,retry}=useAsync(()=>api.getCourses(),[])
  const {count}=useProgress()
  const [q,setQ]=useState('')
  if(loading) return <Loading/>
  if(error) return <ErrorBox message={error} onRetry={retry}/>

  const total=data.reduce((n,c)=>n+c.lessons.length,0)
  const doneN=data.reduce((n,c)=>n+count(c.id),0)
  const shown=data.filter(c=>(c.title+c.description).toLowerCase().includes(q.toLowerCase()))

  return (
    <>
      <section className="hero">
        <h1>Pick up where you left off.</h1>

        <div className="overall">
          <span>Overall progress: {doneN} of {total} lessons</span>
          <Bar value={total?doneN/total:0}/>
        </div>
        <input className="search" placeholder="Search courses" aria-label="Search courses" value={q} onChange={e=>setQ(e.target.value)}/>
      </section>
      {!shown.length
        ? <Empty title="No courses found" text={q?`Nothing matches "${q}". Try a different keyword.`:'No courses are available yet.'}
            action={q?<button className="btn" onClick={()=>setQ('')}>Clear search</button>:null}/>
        : <div className="grid">
            {shown.map(c=>(
              <Link key={c.id} to={`/courses/${c.id}`} className="card">
                <span className="tag">{c.level}</span>
                <h3>{c.title}</h3>
                <p>{c.description}</p>
                <Segs n={count(c.id)} total={c.lessons.length}/>
                <small>{count(c.id)} of {c.lessons.length} lessons completed</small>
              </Link>
            ))}
          </div>}
    </>
  )
}
