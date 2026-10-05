// With VITE_API_URL set, every call hits the backend. Without it, the app runs on
// bundled data and localStorage, so it works fully offline.
import {COURSES} from './data'
const BASE=import.meta.env.VITE_API_URL
const wait=ms=>new Promise(r=>setTimeout(r,ms))
const local=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}}

async function req(path,opts={}){
  const token=localStorage.getItem('token')
  const res=await fetch(BASE+path,{...opts,headers:{'Content-Type':'application/json',...(token&&{Authorization:`Bearer ${token}`})}})
  if(!res.ok) {
    let msg = res.status===404?'Course not found.':'The server returned an error. Please try again.';
    try {
      const data = await res.json();
      if (data && data.error) msg = data.error;
    } catch {}
    throw new Error(msg);
  }
  return res.json()
}

export const api={
  async getCourses(){ if(BASE) return req('/courses'); await wait(600); return COURSES },
  async getCourse(id){
    if(BASE) return req(`/courses/${id}`)
    await wait(400)
    const c=COURSES.find(c=>c.id===id)
    if(!c) throw new Error('Course not found.')
    return c
  },
  async getProgress(){ return BASE?req('/progress'):local('progress',{}) },
  async saveProgress(p){
    localStorage.setItem('progress',JSON.stringify(p))
    if(BASE) await req('/progress',{method:'PUT',body:JSON.stringify(p)})
  },
  async saveResult(r){
    localStorage.setItem('results',JSON.stringify([...local('results',[]),{...r,at:Date.now()}]))
    if(BASE) await req('/results',{method:'POST',body:JSON.stringify(r)})
  },
  async register(email, password) {
    if (!BASE) throw new Error('Backend URL not configured');
    const res = await req('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.token) localStorage.setItem('token', res.token);
    return res;
  },
  async login(email, password) {
    if (!BASE) throw new Error('Backend URL not configured');
    const res = await req('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.token) localStorage.setItem('token', res.token);
    return res;
  },
  logout() {
    localStorage.removeItem('token');
  },
  getToken() {
    return localStorage.getItem('token');
  }
}
