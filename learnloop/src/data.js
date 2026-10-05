const q=(q,options,answer)=>({q,options,answer})
export const COURSES=[
{id:'html-css',title:'HTML and CSS Foundations',level:'Beginner',description:'Structure pages with semantic HTML and style them with modern CSS.',
 lessons:[
  {id:'l1',title:'Semantic HTML',content:'Elements like header, nav, main and article describe what content means, which helps screen readers and search engines.'},
  {id:'l2',title:'The box model',content:'Every element is a box made of content, padding, border and margin. Setting box-sizing: border-box makes widths predictable.'},
  {id:'l3',title:'Flexbox and Grid',content:'Flexbox lays items out along one axis; Grid handles rows and columns together. Combine them for responsive layouts.'}],
 quiz:{seconds:90,questions:[
  q('Which tag best marks up main page navigation?',['<div>','<nav>','<section>','<span>'],1),
  q("Which property adds space inside an element's border?",['margin','gap','padding','outline'],2),
  q('Which layout system is two-dimensional?',['Flexbox','Grid','Float','Inline'],1)]}},
{id:'javascript',title:'JavaScript Essentials',level:'Beginner',description:'Variables, functions and asynchronous code, the core of everyday JavaScript.',
 lessons:[
  {id:'l1',title:'Variables and types',content:'Use const by default and let when a value must change. Avoid var, which is function-scoped and easy to misuse.'},
  {id:'l2',title:'Functions and arrays',content:'Arrow functions are concise, and array methods like map, filter and reduce transform data without mutating it.'},
  {id:'l3',title:'Promises and async/await',content:'A promise represents a future value. async/await lets you write asynchronous code that reads top to bottom.'}],
 quiz:{seconds:90,questions:[
  q('Which keyword declares a block-scoped, reassignable variable?',['var','let','const','def'],1),
  q('Which array method returns a new, transformed array?',['forEach','push','map','splice'],2),
  q('What does await do inside an async function?',['Blocks the whole page','Pauses the function until a promise settles','Creates a thread','Cancels the promise'],1)]}},
{id:'react',title:'React Basics',level:'Intermediate',description:'Build interfaces from components, props, state and effects.',
 lessons:[
  {id:'l1',title:'Components and JSX',content:'A component is a function that returns JSX. Keep components small and focused on one job.'},
  {id:'l2',title:'Props and state',content:'Props flow down from parent to child. State is data a component owns and can update, triggering a re-render.'},
  {id:'l3',title:'Effects',content:'useEffect runs side effects like fetching data after render. Its dependency array controls when it re-runs.'}],
 quiz:{seconds:90,questions:[
  q('What do props let you do?',["Mutate a parent's state",'Pass data into a component','Create routes','Style components'],1),
  q('Which hook stores local component state?',['useEffect','useRef','useState','useMemo'],2),
  q('When does useEffect with an empty dependency array run?',['Every render','After the first render only','Never','Before render'],1)]}},
{id:'git',title:'Git and GitHub',level:'Beginner',description:'Track changes, work in branches and collaborate through pull requests.',
 lessons:[
  {id:'l1',title:'Commits and branches',content:'A commit is a snapshot of your work. Branches let you develop features in isolation from main.'},
  {id:'l2',title:'Merging and conflicts',content:'Merging combines branches. When two branches change the same lines, you resolve the conflict by hand.'},
  {id:'l3',title:'Pull requests',content:'A pull request proposes changes for review before they merge, keeping main stable.'}],
 quiz:{seconds:90,questions:[
  q('Which command records staged changes?',['git push','git commit','git fetch','git pull'],1),
  q('Which command creates a branch and switches to it?',['git branch -d','git checkout -b','git merge','git stash'],1),
  q('What is a pull request for?',['Downloading code','Proposing and reviewing changes before merging','Deleting a branch','Reverting a commit'],1)]}}
]
