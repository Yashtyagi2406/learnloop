import {useState} from 'react'
import {Link} from 'react-router-dom'
import {api} from '../api'
import {useAsync,useProgress} from '../state'
import {Bar,Segs,Loading,ErrorBox,Empty} from '../ui'
import GradientBlinds from '../components/GradientBlinds'

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
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '240px',
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '24px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
            background: '#0c0f1e'
          }}
        >
          <GradientBlinds
            gradientColors={['#FF9FFC', '#5227FF']}
            angle={15}
            noise={0.25}
            blindCount={14}
            blindMinWidth={50}
            spotlightRadius={0.5}
            spotlightSoftness={1}
            spotlightOpacity={1}
            mouseDampening={0.15}
            distortAmount={0}
            shineDirection="left"
            mixBlendMode="lighten"
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: 'clamp(20px, 4vw, 40px)',
              background: 'linear-gradient(to right, rgba(12, 15, 30, 0.85) 0%, rgba(12, 15, 30, 0.45) 60%, transparent 100%)',
              pointerEvents: 'none'
            }}
          >
            <span style={{ color: '#8d98ff', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
              Interactive Learning
            </span>
            <h1 style={{ margin: 0, color: '#ffffff', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              Pick up where you left off.
            </h1>
            <p style={{ margin: '8px 0 0', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem' }}>
              Explore hands-on courses, quizzes, and track your progress in real time.
            </p>
          </div>
        </div>

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
