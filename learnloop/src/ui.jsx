export const Bar=({value})=>(
  <div className="track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value*100)}>
    <div className="fill" style={{width:`${value*100}%`}}/>
  </div>
)
// One segment per lesson, so progress reads as "2 of 3 lessons" at a glance.
export const Segs=({n,total})=>(
  <div className="segs" aria-label={`${n} of ${total} lessons completed`}>
    {Array.from({length:total},(_,i)=><span key={i} className={i<n?'on':''}/>)}
  </div>
)
export const Loading=({n=4})=><div className="grid">{Array.from({length:n},(_,i)=><div key={i} className="card skel"/>)}</div>
export const ErrorBox=({message,onRetry})=>(
  <div className="state"><h3>Couldn't load this page</h3><p>{message}</p><button className="btn" onClick={onRetry}>Try again</button></div>
)
export const Empty=({title,text,action})=><div className="state"><h3>{title}</h3>{text&&<p>{text}</p>}{action}</div>
