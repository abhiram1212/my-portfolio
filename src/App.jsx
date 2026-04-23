import { useState, useEffect, useRef } from "react";

/* ── PALETTE: Original Dark + Electric Green ── */
const C = {
  bg:        "var(--c-bg)",
  surface:   "var(--c-surface)",
  border:    "var(--c-border)",
  hover:     "var(--c-hover)",
  green:     "var(--c-green)",
  greenDim:  "var(--c-greenDim)",
  greenFaint:"var(--c-greenFaint)",
  white:     "var(--c-white)",
  muted:     "var(--c-muted)",
  dim:       "var(--c-dim)",
};

/* ── DATA ── */
const ROLES = ["AI Engineer","Machine Learning Engineer","RAG Pipeline Builder","LLM Fine-Tuner","MLOps Engineer","Full Stack AI Developer"];

const WORK = [
  {
    id:1, num:"01",
    period:"Dec 2024 – Mar 2026",
    company:"Infosys", location:"Raleigh, NC",
    role:"AI Engineer",
    stack:["Python", "LangChain", "Azure OpenAI", "PyTorch", "Hugging Face", "Redis", "Pinecone", "FastAPI", "Docker", "AWS"],
    highlights:[
      "Designed and deployed generative AI solutions on the Infosys Topaz platform, reducing manual processing time for knowledge-intensive workflows by ~45% across 10,000+ monthly document processing requests.",
      "Developed and optimized RAG pipelines using LangChain and Azure OpenAI, improving response relevance by 32% and reducing hallucination rates by ~25% compared to baseline implementations.",
      "Fine-tuned and benchmarked open-source LLMs (Llama 3, Mistral) for domain-specific enterprise use cases, achieving 88%+ accuracy on client-defined evaluation suites.",
      "Reduced LLM inference costs by ~35% through tiered model routing between Mistral 7B and GPT-4 class models based on query complexity, backed by a Redis caching layer to eliminate redundant API calls.",
    ],
  },
  {
    id:2, num:"02",
    period:"Jan 2024 – Oct 2024",
    company:"BigBear.ai", location:"McLean, Virginia",
    role:"Machine Learning Engineer",
    stack:["AWS SageMaker", "Docker", "Kubernetes", "MLflow", "Apache Airflow", "PyTorch", "Scikit-learn", "PostgreSQL", "Redis"],
    highlights:[
      "Architected end-to-end ML training and inference pipelines on AWS SageMaker, cutting model training time by ~40% through distributed data preprocessing and pipeline parallelization across multi-node compute clusters.",
      "Designed an automated model retraining framework with drift detection using KL divergence and PSI scoring, sustaining 90%+ accuracy across continuously evolving operational data streams.",
      "Built and scaled MLOps infrastructure using Docker, Kubernetes, and CI/CD pipelines on AWS, reducing model deployment time from days to under 2 hours with zero-downtime deployments.",
      "Collaborated with data engineers to build AI-ready data pipelines processing 1M+ daily records, reducing preprocessing bottlenecks by ~35% and improving feature delivery latency.",
    ],
  },
  {
    id:3, num:"03",
    period:"Jun 2022 – Jul 2023",
    company:"Pixelvide", location:"Hyderabad, India",
    role:"Software Engineer",
    stack:["Python", "Scikit-learn", "Pandas", "NumPy", "FastAPI", "PostgreSQL", "React", "REST APIs", "Git", "Docker"],
    highlights:[
      "Designed and implemented Python-based ETL pipelines to ingest and process real-time traffic sensor feeds into a centralized data warehouse, reducing data processing latency by ~35%.",
      "Built a traffic anomaly detection module using Scikit-learn, flagging unusual congestion patterns across monitored zones and reducing manual operator review time by ~30%.",
      "Developed and maintained REST APIs using FastAPI to expose processed traffic analytics to React-based government dashboards, supporting real-time visualization for 50+ monitored intersections.",
      "Worked on data preprocessing and feature engineering pipelines using Pandas and NumPy to clean and normalize raw traffic camera feeds, improving downstream model accuracy by ~20%.",
    ],
  },
];

const PROJECTS = [
  {
    id: 1,
    num: "01",
    title: "DocMind",
    subtitle: "AI-Powered PDF Chat Assistant",
    description: "Full stack AI application that lets users upload PDF documents and ask questions in natural language. Uses semantic search to find relevant content and streams AI-generated answers in real time. Supports multi-PDF uploads, duplicate detection, and mid-chat PDF switching.",
    highlights: [
      "REST API backend with FastAPI handling PDF processing, text extraction, and chunking.",
      "Semantic search pipeline using sentence-transformers with embeddings stored in PostgreSQL via pgvector.",
      "Streaming AI responses using Anthropic Claude API over Server-Sent Events with a real-time React UI.",
      "Full AWS deployment across EC2, RDS, S3, and CloudFront with systemd process management.",
    ],
    stack: {
      "Backend":  ["Python", "FastAPI", "PostgreSQL", "pgvector"],
      "AI":       ["Claude API", "sentence-transformers", "LangChain"],
      "Frontend": ["React", "Tailwind CSS", "Vite"],
      "Cloud":    ["AWS EC2", "RDS", "S3", "CloudFront"],
      "Tools":    ["Docker", "Git", "systemd"],
    },
    live: "https://d1trzl7talcx36.cloudfront.net",
  },
];

const SKILLS = [
  { cat:"Languages",    items:["Python", "Go", "Java", "TypeScript", "SQL", "C++"],                         levels:[5,4,4,3,4,2] },
  { cat:"AI / ML",      items:["PyTorch", "Scikit-learn", "LangChain", "Hugging Face", "MLflow", "Pinecone"], levels:[5,5,5,4,4,4] },
  { cat:"Cloud & Infra",items:["AWS SageMaker", "Docker", "Kubernetes", "Redis", "CI/CD", "Apache Airflow"],  levels:[5,5,4,5,5,4] },
  { cat:"Frameworks",   items:["FastAPI", "Spring Boot", "React", "Flask", "Pandas", "NumPy"],               levels:[5,4,4,4,5,5] },
];

const STATS = [
  { val:45,  sfx:"%",   label:"processing time cut",  sub:"Infosys Topaz platform" },
  { val:35,  sfx:"%",   label:"LLM cost reduction",   sub:"tiered model routing" },
  { val:40,  sfx:"%",   label:"training time cut",    sub:"AWS SageMaker pipelines" },
  { val:88,  sfx:"%+",  label:"LLM accuracy",         sub:"client eval suites" },
];

/* ── GLOBAL CSS ── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  :root {
    --c-bg:#0a0a0f; --c-surface:#111118; --c-border:#1e1e2e;
    --c-hover:rgba(126,232,162,0.08); --c-green:#7ee8a2; --c-greenDim:#4a9e65;
    --c-greenFaint:rgba(126,232,162,0.08); --c-white:#e8e8f0;
    --c-muted:#6b6b80; --c-dim:#3a3a50; --c-nav:rgba(10,10,15,.92);
  }
  html.light {
    --c-bg:#f4f4f0; --c-surface:#ffffff; --c-border:#d4d4cc;
    --c-hover:rgba(42,140,88,0.07); --c-green:#2a8c58; --c-greenDim:#1f6e44;
    --c-greenFaint:rgba(42,140,88,0.07); --c-white:#1a1a1a;
    --c-muted:#555555; --c-dim:#aaaaaa; --c-nav:rgba(244,244,240,.95);
  }
  .toggle-pill { display:flex; align-items:center; gap:8px; padding:0 12px; border-left:1px solid var(--c-border); cursor:pointer; height:56px; flex-shrink:0; }
  .toggle-track { width:36px; height:20px; border-radius:10px; border:none; cursor:pointer; background:var(--c-border); position:relative; transition:background .3s; display:flex; align-items:center; padding:3px; flex-shrink:0; }
  .toggle-thumb { width:14px; height:14px; border-radius:50%; background:var(--c-green); transition:transform .3s; display:block; pointer-events:none; }
  html.light .toggle-track { background:rgba(42,140,88,.2); }
  html.light .toggle-thumb { transform:translateX(16px); }
  html.light .nav-mobile { background:rgba(244,244,240,.97); }
  html.light .nav-mobile a { color:var(--c-muted); }

  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html { scroll-behavior:smooth; }

  .nav-desktop { display:flex; gap:0; }
  .nav-hamburger { display:none; flex-direction:column; gap:5px; cursor:pointer; padding:8px; background:transparent; border:none; }
  .nav-hamburger span { display:block; width:22px; height:2px; background:var(--c-green); transition:all .3s; }
  .nav-mobile { display:none; position:fixed; top:56px; left:0; right:0; background:var(--c-nav); backdrop-filter:blur(16px); border-bottom:1px solid var(--c-border); z-index:99; flex-direction:column; }
  .nav-mobile.open { display:flex; }
  .nav-mobile a { padding:16px 24px; font-size:13px; letter-spacing:.12em; text-transform:uppercase; text-decoration:none; color:var(--c-muted); border-bottom:1px solid var(--c-border); transition:color .2s,background .2s; }
  .nav-mobile a:hover { color:var(--c-green); background:var(--c-greenFaint); }

  @media (max-width:600px) {
    .work-header { grid-template-columns: 36px 1fr !important; gap:12px !important; padding:20px 16px !important; }
    .work-header-meta { display:none !important; }
    .work-stack { padding:14px 16px !important; }
    .work-highlights { padding:16px 16px 20px !important; }
  }

  .skill-tabs-wrap { display:flex; gap:0; margin-bottom:36px; border:1px solid var(--c-border); width:fit-content; flex-wrap:wrap; }
  @media (max-width:500px) {
    .skill-tabs-wrap { width:100%; }
    .skill-tabs-wrap button { flex:1; padding:10px 8px !important; font-size:9px !important; }
  }

  .contact-grid { display:grid; grid-template-columns:1fr 1fr; gap:72px; align-items:center; }
  @media (max-width:700px) {
    .contact-grid { grid-template-columns:1fr; gap:40px; }
  }

  .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:2px; }
  @media (max-width:800px) { .stats-grid { grid-template-columns:repeat(2,1fr); } }
  @media (max-width:400px) { .stats-grid { grid-template-columns:1fr; } }

  .edu-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:2px; }

  /* Project card */
  .project-card { border:1px solid var(--c-border); transition:border-color .3s; }
  .project-card:hover { border-color:var(--c-greenDim); }

  .project-stack-group { display:flex; flex-direction:column; gap:6px; }
  .project-stack-label { font-size:10px; letter-spacing:.18em; text-transform:uppercase; color:var(--c-muted); font-family:'DM Mono',monospace; }
  .project-stack-pills { display:flex; flex-wrap:wrap; gap:6px; }
  .project-stack-pill { padding:3px 11px; border:1px solid var(--c-border); font-size:11px; color:var(--c-green); background:var(--c-greenFaint); font-family:'DM Mono',monospace; transition:all .2s; cursor:default; }
  .project-stack-pill:hover { border-color:var(--c-green); background:var(--c-hover); }

  .project-live-btn { display:inline-flex; align-items:center; gap:8px; padding:11px 26px; background:var(--c-green); color:var(--c-bg); font-size:11px; font-weight:500; text-decoration:none; letter-spacing:.1em; text-transform:uppercase; font-family:'DM Mono',monospace; transition:all .2s; }
  .project-live-btn:hover { background:#a8f0bf; transform:translateY(-2px); }

  .hero-section { min-height:100vh; padding:100px clamp(16px,5vw,64px) 60px; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; z-index:1; }

  .sec-wrap { padding:72px clamp(16px,5vw,64px); }
  @media (max-width:600px) { .sec-wrap { padding:56px 16px; } }

  .footer-inner { display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px; }

  body {
    background:var(--c-bg);
    color:var(--c-white);
    transition:background .35s,color .35s;
    font-family:'DM Mono', monospace;
    font-size:14px;
    line-height:1.7;
    -webkit-font-smoothing:antialiased;
    overflow-x:hidden;
    cursor:none;
  }
  @media (hover:none) { body { cursor:auto; } }
  ::selection { background:var(--c-green); color:#0a0a0f; }
  ::-webkit-scrollbar { width:3px; }
  ::-webkit-scrollbar-thumb { background:var(--c-border); border-radius:2px; }

  @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:none} }
  @keyframes ticker   { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes gridPan  { from{background-position:0 0} to{background-position:60px 60px} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes pulse    { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.1)} }
  @keyframes scanline { from{transform:translateY(-100%)} to{transform:translateY(100vh)} }
  @keyframes countUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
  @keyframes barGrow  { from{width:0} to{width:var(--w)} }
  @keyframes glow     { 0%,100%{box-shadow:0 0 8px rgba(126,232,162,.2)} 50%{box-shadow:0 0 24px rgba(126,232,162,.5)} }

  @media (min-width:701px) { .nav-hamburger { display:none !important; } .nav-desktop { display:flex !important; } }
  @media (max-width:700px) { .nav-desktop { display:none !important; } .nav-hamburger { display:flex !important; } }
  .fu1{animation:fadeUp .7s ease .05s both}
  .fu2{animation:fadeUp .7s ease .2s  both}
  .fu3{animation:fadeUp .7s ease .38s both}
  .fu4{animation:fadeUp .7s ease .56s both}
  .fu5{animation:fadeUp .7s ease .74s both}
`;

/* ── HOOKS ── */
function useInView(t=.08){
  const ref=useRef(null);const[v,setV]=useState(false);
  useEffect(()=>{
    const o=new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);o.disconnect();}},{threshold:t});
    if(ref.current)o.observe(ref.current);return()=>o.disconnect();
  },[t]);return[ref,v];
}
function useCountUp(target,dur=1300,active=false){
  const[v,setV]=useState(0);
  useEffect(()=>{
    if(!active)return;const n=parseFloat(target);if(isNaN(n))return;
    const t0=Date.now();
    const tick=()=>{const p=Math.min((Date.now()-t0)/dur,1);const e=1-Math.pow(1-p,4);setV(+(n*e).toFixed(0));if(p<1)requestAnimationFrame(tick);};
    requestAnimationFrame(tick);
  },[active,target,dur]);return v;
}

/* ── CUSTOM CURSOR ── */
function Cursor(){
  const dot=useRef(null),ring=useRef(null);
  const tgt=useRef({x:0,y:0}),pos=useRef({x:0,y:0});
  const[hov,setHov]=useState(false);
  useEffect(()=>{
    const mv=e=>{tgt.current={x:e.clientX,y:e.clientY}};
    const ov=e=>{if(e.target.closest('a,button,[data-h]'))setHov(true)};
    const ou=e=>{if(e.target.closest('a,button,[data-h]'))setHov(false)};
    window.addEventListener('mousemove',mv);
    document.addEventListener('mouseover',ov);document.addEventListener('mouseout',ou);
    let raf;const run=()=>{
      pos.current.x+=(tgt.current.x-pos.current.x)*.1;
      pos.current.y+=(tgt.current.y-pos.current.y)*.1;
      if(dot.current){dot.current.style.left=tgt.current.x+'px';dot.current.style.top=tgt.current.y+'px';}
      if(ring.current){ring.current.style.left=pos.current.x+'px';ring.current.style.top=pos.current.y+'px';}
      raf=requestAnimationFrame(run);
    };raf=requestAnimationFrame(run);
    return()=>{window.removeEventListener('mousemove',mv);document.removeEventListener('mouseover',ov);document.removeEventListener('mouseout',ou);cancelAnimationFrame(raf);};
  },[]);
  return(<>
    <div ref={dot}  style={{position:'fixed',width:6,height:6,background:C.green,borderRadius:'50%',transform:'translate(-50%,-50%)',pointerEvents:'none',zIndex:9999}}/>
    <div ref={ring} style={{position:'fixed',width:hov?44:24,height:hov?44:24,border:`1.5px solid ${C.green}`,borderRadius:'50%',transform:'translate(-50%,-50%)',pointerEvents:'none',zIndex:9998,opacity:.55,transition:'width .25s,height .25s'}}/>
  </>);
}

/* ── GRID BG ── */
function GridBg(){
  return(
    <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,
      backgroundImage:`linear-gradient(var(--c-border) 1px,transparent 1px),linear-gradient(90deg,var(--c-border) 1px,transparent 1px)`,
      backgroundSize:'60px 60px',
      animation:'gridPan 8s linear infinite',
    }}/>
  );
}

/* ── TYPEWRITER ── */
function TW(){
  const[idx,setIdx]=useState(0);const[txt,setTxt]=useState('');const[del,setDel]=useState(false);
  useEffect(()=>{
    const w=ROLES[idx];
    const t=setTimeout(()=>{
      if(!del&&txt.length<w.length)setTxt(w.slice(0,txt.length+1));
      else if(!del)setDel(true);
      else if(del&&txt.length>0)setTxt(txt.slice(0,-1));
      else{setDel(false);setIdx(i=>(i+1)%ROLES.length);}
    },del?28:txt.length===w.length?2000:58);
    return()=>clearTimeout(t);
  },[txt,del,idx]);
  return<span style={{color:C.green}}>{txt}<span style={{animation:'blink 1s step-end infinite',color:C.green}}>▌</span></span>;
}

/* ── TICKER ── */
function Ticker(){
  const t="Python · LangChain · PyTorch · Hugging Face · AWS SageMaker · Docker · Kubernetes · MLflow · FastAPI · Redis · Pinecone · Scikit-learn · PostgreSQL · CI/CD · RAG · LLMs · ";
  return(
    <div style={{borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,overflow:'hidden',whiteSpace:'nowrap',padding:'12px 0',background:C.surface,userSelect:'none',position:'relative',zIndex:1}}>
      <div style={{display:'inline-block',animation:'ticker 26s linear infinite'}}>
        {[t,t].map((s,i)=><span key={i} style={{fontSize:11,letterSpacing:'.22em',textTransform:'uppercase',color:C.muted}}>{s}</span>)}
      </div>
    </div>
  );
}

/* ── STAT CARD ── */
function StatCard({val,sfx,label,sub,delay}){
  const[ref,inView]=useInView(.3);
  const num=useCountUp(val,1300,inView);
  return(
    <div ref={ref} data-h style={{
      background:C.surface,border:`1px solid ${C.border}`,padding:'32px 28px',
      position:'relative',overflow:'hidden',
      opacity:inView?1:0,transform:inView?'none':'translateY(20px)',
      transition:`opacity .6s ease ${delay}s,transform .6s ease ${delay}s,border-color .3s,background .3s`,
    }}
      onMouseEnter={e=>{e.currentTarget.style.background=C.hover;e.currentTarget.style.borderColor=C.greenDim;e.currentTarget.style.animation=`glow 1.5s ease-in-out infinite`;}}
      onMouseLeave={e=>{e.currentTarget.style.background='var(--c-surface)';e.currentTarget.style.borderColor='var(--c-border)';e.currentTarget.style.animation='none';}}
    >
      <div style={{position:'absolute',top:0,left:0,width:3,height:'100%',background:C.green,opacity:.6}}/>
      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:52,lineHeight:1,color:C.green,letterSpacing:-2,marginBottom:8}}>
        {inView?num:0}{sfx}
      </div>
      <div style={{fontSize:12,fontWeight:600,color:C.white,textTransform:'uppercase',letterSpacing:'.08em',marginBottom:4}}>{label}</div>
      <div style={{fontSize:11,color:C.muted}}>{sub}</div>
    </div>
  );
}

/* ── WORK CARD ── */
function WorkCard({job,index}){
  const[open,setOpen]=useState(index===0);
  const[hov,setHov]=useState(false);
  const[ref,inView]=useInView(.06);
  return(
    <div ref={ref} style={{
      border:`1px solid ${open?C.greenDim:C.border}`,
      opacity:inView?1:0,
      transform:inView?'none':`translateX(${index%2===0?-40:40}px)`,
      transition:`opacity .7s ease ${index*.12}s,transform .7s ease ${index*.12}s,border-color .3s`,
    }}>
      <div className="work-header" data-h onClick={()=>setOpen(o=>!o)}
        onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
        style={{
          display:'grid',gridTemplateColumns:'48px 1fr auto',gap:20,
          padding:'clamp(16px,3vw,28px) clamp(16px,3vw,32px)',cursor:'pointer',alignItems:'center',
          background:hov?C.hover:open?C.greenFaint:'transparent',
          transition:'background .2s',
        }}>
        <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:12,color:open?C.green:C.muted,letterSpacing:'.1em',transition:'color .3s'}}>{job.num}</span>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:6,flexWrap:'wrap'}}>
            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,color:C.white,letterSpacing:-.3}}>{job.company}</span>
            <span style={{fontSize:11,color:C.muted,fontFamily:"'DM Mono',monospace"}}>{job.location}</span>
          </div>
          <div style={{fontSize:12,color:open?C.green:C.muted,transition:'color .3s'}}>{job.role}</div>
        </div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8}}>
          <span style={{fontSize:11,color:C.muted,whiteSpace:'nowrap',textAlign:'right'}}>{job.period}</span>
          <div style={{width:26,height:26,border:`1px solid ${open?C.green:C.border}`,display:'flex',alignItems:'center',justifyContent:'center',color:open?C.green:C.muted,fontSize:16,transform:open?'rotate(45deg)':'none',transition:'all .3s'}}>+</div>
        </div>
      </div>
      <div style={{maxHeight:open?700:0,overflow:'hidden',transition:'max-height .5s cubic-bezier(.4,0,.2,1)'}}>
        <div style={{borderTop:`1px solid ${C.border}`}}>
          <div className="work-stack" style={{padding:'18px clamp(16px,3vw,32px)',display:'flex',flexWrap:'wrap',gap:8,borderBottom:`1px solid ${C.border}`}}>
            {job.stack.map(s=>(
              <span key={s} style={{padding:'3px 12px',border:`1px solid ${C.border}`,fontSize:11,color:C.green,background:C.greenFaint,transition:'all .2s',cursor:'default'}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.background='var(--c-hover)';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background='var(--c-greenFaint)';}}>
                {s}
              </span>
            ))}
          </div>
          <div className="work-highlights" style={{padding:'20px clamp(16px,3vw,32px) 28px',display:'flex',flexDirection:'column',gap:12}}>
            {job.highlights.map((h,i)=>(
              <div key={i} style={{display:'flex',gap:12,alignItems:'flex-start'}}>
                <span style={{color:C.green,marginTop:4,flexShrink:0,fontSize:10}}>▸</span>
                <p style={{fontSize:13,color:C.muted,lineHeight:1.75}}>{h}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── PROJECT CARD ── */
function ProjectCard({ project, index }) {
  const [ref, inView] = useInView(0.06);
  const stackEntries = Object.entries(project.stack);

  return (
    <div
      ref={ref}
      className="project-card"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(32px)',
        transition: `opacity .7s ease ${index * 0.12}s, transform .7s ease ${index * 0.12}s`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* green left accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: C.green, opacity: 0.5 }} />

      {/* top header row */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 16,
        padding: 'clamp(20px,3vw,32px) clamp(20px,3vw,36px) 0',
        flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 11, color: C.green, letterSpacing: '.12em', textTransform: 'uppercase' }}>
              {project.num}
            </span>
            <span style={{ width: 1, height: 14, background: C.border }} />
            <span style={{ fontSize: 10, color: C.muted, letterSpacing: '.14em', textTransform: 'uppercase', fontFamily: "'DM Mono',monospace" }}>
              Featured Project
            </span>
          </div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(22px,3vw,36px)', color: C.white, letterSpacing: -0.5, lineHeight: 1.1, marginBottom: 4 }}>
            {project.title}
          </div>
          <div style={{ fontSize: 12, color: C.green, fontFamily: "'DM Mono',monospace", marginBottom: 0 }}>
            {project.subtitle}
          </div>
        </div>

        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          data-h
          className="project-live-btn"
          style={{ flexShrink: 0, marginTop: 4 }}
        >
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.bg, opacity: 0.7 }} />
          Live Demo ↗
        </a>
      </div>

      {/* description */}
      <div style={{ padding: '20px clamp(20px,3vw,36px)', borderBottom: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.85, maxWidth: 760 }}>
          {project.description}
        </p>
      </div>

      {/* highlights */}
      <div style={{ padding: '18px clamp(20px,3vw,36px)', display: 'flex', flexDirection: 'column', gap: 10, borderBottom: `1px solid ${C.border}` }}>
        {project.highlights.map((h, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ color: C.green, marginTop: 4, flexShrink: 0, fontSize: 10 }}>▸</span>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.75 }}>{h}</p>
          </div>
        ))}
      </div>

      {/* grouped tech stack */}
      <div style={{
        padding: 'clamp(16px,2vw,24px) clamp(20px,3vw,36px) clamp(20px,3vw,28px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}>
        {stackEntries.map(([group, pills]) => (
          <div key={group} className="project-stack-group">
            <div className="project-stack-label">{group}</div>
            <div className="project-stack-pills">
              {pills.map(p => (
                <span key={p} className="project-stack-pill">{p}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── SKILLS ── */
function SkillsBlock(){
  const[cat,setCat]=useState("Languages");
  const[ref,inView]=useInView(.1);
  const grp=SKILLS.find(s=>s.cat===cat);
  return(
    <div ref={ref}>
      <div className="skill-tabs-wrap">
        {SKILLS.map(s=>(
          <button key={s.cat} data-h onClick={()=>setCat(s.cat)} style={{
            padding:'10px 22px',fontSize:11,fontFamily:"'DM Mono',monospace",cursor:'pointer',border:'none',
            borderRight:`1px solid ${C.border}`,
            background:cat===s.cat?C.green:C.surface,
            color:cat===s.cat?C.bg:C.muted,
            fontWeight:cat===s.cat?500:400,
            letterSpacing:'.08em',textTransform:'uppercase',transition:'all .2s',
          }}>{s.cat}</button>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'10px 56px'}}>
        {grp?.items.map((name,i)=>(
          <div key={name} style={{paddingBottom:10}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}>
              <span style={{fontSize:12,color:C.white}}>{name}</span>
              <span style={{fontSize:11,color:C.muted}}>{grp.levels[i]*20}%</span>
            </div>
            <div style={{height:2,background:C.border,borderRadius:2,overflow:'hidden'}}>
              <div style={{
                height:'100%',borderRadius:2,
                background:`linear-gradient(90deg,${C.green},${C.greenDim})`,
                width:inView?`${grp.levels[i]*20}%`:'0%',
                transition:`width .9s cubic-bezier(.4,0,.2,1) ${.06*i}s`,
              }}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── SECTION ── */
function Sec({id,num,title,children,alt=false,style={}}){
  const[ref,inView]=useInView(.04);
  return(
    <section ref={ref} id={id} className="sec-wrap" style={{
      background:alt?C.surface:C.bg,
      borderTop:`1px solid ${C.border}`,
      opacity:inView?1:0,transform:inView?'none':'translateY(20px)',
      transition:'opacity .7s,transform .7s',
      position:'relative',zIndex:1,
      ...style,
    }}>
      <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:16}}>
        <span style={{fontSize:11,color:C.green,letterSpacing:'.2em',textTransform:'uppercase',fontFamily:"'DM Mono',monospace"}}>{num}</span>
        <div style={{flex:1,height:1,background:`linear-gradient(90deg,${C.border},transparent)`}}/>
      </div>
      <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'clamp(26px,4vw,52px)',letterSpacing:'clamp(-0.5px,-0.03em,-1.5px)',marginBottom:40,lineHeight:1.05,color:C.white}}>
        {title}
      </h2>
      {children}
    </section>
  );
}

/* ── APP ── */
export default function Portfolio(){
  const[scroll,setScroll]=useState(0);
  const[menuOpen,setMenuOpen]=useState(false);
  const[dark,setDark]=useState(false);
  useEffect(()=>{
    const h=()=>setScroll(window.scrollY);
    window.addEventListener('scroll',h,{passive:true});
    return()=>window.removeEventListener('scroll',h);
  },[]);

  useEffect(()=>{
    document.documentElement.classList.toggle('light',!dark);
  },[dark]);

  return(<>
    <style>{CSS}</style>
    <Cursor/>
    <GridBg/>

    {/* NAV */}
    <header style={{
      position:'fixed',top:0,left:0,right:0,zIndex:100,height:56,
      background:scroll>40?'var(--c-nav)':'transparent',
      backdropFilter:scroll>40?'blur(14px)':'none',
      borderBottom:`1px solid ${scroll>40?C.border:'transparent'}`,
      transition:'all .4s',
      display:'flex',alignItems:'center',justifyContent:'space-between',
      padding:'0 clamp(16px,4vw,40px)',
    }}>
      <a href="#" style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:C.green,textDecoration:'none',letterSpacing:-.5}}>
        AM<span style={{color:C.white}}>_</span>
      </a>
      <div style={{display:'flex',alignItems:'center',gap:0}}>
        <nav className="nav-desktop">
          {[['#about','About'],['#work','Work'],['#projects','Projects'],['#skills','Skills'],['#edu','Education'],['#contact','Contact']].map(([h,l])=>(
            <NavLink key={h} href={h}>{l}</NavLink>
          ))}
        </nav>
        <button className="nav-hamburger" onClick={()=>setMenuOpen(o=>!o)} aria-label="Menu">
          <span style={{transform:menuOpen?'rotate(45deg) translate(5px,5px)':'none'}}/>
          <span style={{opacity:menuOpen?0:1}}/>
          <span style={{transform:menuOpen?'rotate(-45deg) translate(5px,-5px)':'none'}}/>
        </button>
        <div className="toggle-pill" onClick={()=>setDark(d=>!d)}>
          <span style={{fontSize:9,color:C.muted,letterSpacing:'.1em',textTransform:'uppercase',userSelect:'none'}}>{dark?'Light':'Dark'}</span>
          <button className="toggle-track" aria-label="Toggle theme"><span className="toggle-thumb"/></button>
        </div>
      </div>
      <div className={`nav-mobile${menuOpen?' open':''}`}>
        {[['#about','About'],['#work','Work'],['#projects','Projects'],['#skills','Skills'],['#edu','Education'],['#contact','Contact']].map(([h,l])=>(
          <a key={h} href={h} onClick={()=>setMenuOpen(false)}>{l}</a>
        ))}
      </div>
    </header>

    {/* HERO */}
    <section id="about" className="hero-section">
      <div style={{position:'absolute',top:'20%',right:'5%',width:480,height:480,borderRadius:'50%',background:`radial-gradient(circle,rgba(126,232,162,.05),transparent 65%)`,pointerEvents:'none',animation:'float 10s ease-in-out infinite'}}/>
      <div style={{maxWidth:680,width:'100%'}}>
        <div className="fu1" style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 14px',border:`1px solid ${C.border}`,background:C.surface,marginBottom:28}}>
          <span style={{width:7,height:7,borderRadius:'50%',background:C.green,animation:'pulse 2s ease-in-out infinite'}}/>
          <span style={{fontSize:11,letterSpacing:'.14em',textTransform:'uppercase',color:C.muted}}>Available · New York, NY</span>
        </div>
        <h1 className="fu2" style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'clamp(38px,7.5vw,96px)',lineHeight:.95,letterSpacing:'clamp(-1px,-0.03em,-3px)',marginBottom:24,color:C.white}}>
          ABHIRAM<br/><span style={{color:C.green}}>MULLAPUDI</span>
        </h1>
        <div className="fu3" style={{fontSize:'clamp(14px,1.6vw,17px)',marginBottom:32,color:C.muted}}>
          {'> '}<TW/>
        </div>
        <p className="fu4" style={{fontSize:14,color:C.muted,lineHeight:1.9,maxWidth:540,marginBottom:44}}>
          AI Engineer with 3+ years building production GenAI and ML systems. Shipping RAG pipelines, LLM fine-tuning workflows, and MLOps infrastructure in Python on AWS and Azure. I care about models that actually run in production, not just notebooks.
        </p>
        <div className="fu5" style={{display:'flex',gap:14,flexWrap:'wrap'}}>
          <a href="#work" data-h style={{padding:'13px 30px',background:C.green,color:C.bg,fontSize:12,fontWeight:500,textDecoration:'none',letterSpacing:'.08em',textTransform:'uppercase',transition:'all .2s'}}
            onMouseEnter={e=>{e.currentTarget.style.background='#a8f0bf';e.currentTarget.style.transform='translateY(-2px)';}}
            onMouseLeave={e=>{e.currentTarget.style.background=C.green;e.currentTarget.style.transform='none';}}>
            View Work ↗
          </a>
          <a href="mailto:amullap@gmu.edu" data-h style={{padding:'13px 30px',background:'transparent',color:C.white,fontSize:12,fontWeight:500,textDecoration:'none',border:`1px solid ${C.border}`,letterSpacing:'.08em',textTransform:'uppercase',transition:'all .2s'}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.color=C.green;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.white;}}>
            Get in Touch
          </a>
        </div>
      </div>
    </section>

    {/* TICKER */}
    <Ticker/>

    {/* STATS */}
    <section style={{background:C.surface,padding:'72px clamp(16px,5vw,64px)',borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,position:'relative',zIndex:1}}>
      <div className="stats-grid">
        {STATS.map((s,i)=><StatCard key={i} {...s} delay={i*.08}/>)}
      </div>
    </section>

    {/* WORK */}
    <Sec id="work" num="01 / EXPERIENCE" title={<>Where I've<br/>shipped.</>}>
      <div style={{display:'flex',flexDirection:'column',gap:2}}>
        {WORK.map((j,i)=><WorkCard key={j.id} job={j} index={i}/>)}
      </div>
    </Sec>

    {/* PROJECTS */}
    <Sec id="projects" num="02 / PROJECTS" title={<>Things I've<br/>built.</>} alt>
      <div style={{display:'flex',flexDirection:'column',gap:2}}>
        {PROJECTS.map((p,i)=><ProjectCard key={p.id} project={p} index={i}/>)}
      </div>
    </Sec>

    {/* SKILLS */}
    <Sec id="skills" num="03 / SKILLS" title={<>Tools &<br/>craft.</>}>
      <SkillsBlock/>
    </Sec>

    {/* EDUCATION */}
    <Sec id="edu" num="04 / EDUCATION" title={<>Academic<br/>roots.</>} alt>
      <div className="edu-grid">
        <EduCard delay={0}>
          <div style={{fontSize:10,color:C.green,letterSpacing:'.2em',textTransform:'uppercase',marginBottom:20,fontFamily:"'DM Mono',monospace"}}>Master's Degree</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:26,color:C.white,letterSpacing:-.5,marginBottom:8,lineHeight:1.2}}>Computer Science</div>
          <div style={{fontSize:13,color:C.green,marginBottom:4}}>George Mason University</div>
          <div style={{fontSize:11,color:C.muted,fontFamily:"'DM Mono',monospace",marginBottom:28}}>Fairfax, Virginia · 2023 – 2025</div>
          <div style={{display:'flex',alignItems:'baseline',gap:6}}>
            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:48,color:C.green,letterSpacing:-2,lineHeight:1}}>MS</span>
            <span style={{fontSize:14,color:C.muted,fontFamily:"'DM Mono',monospace"}}>Computer Science</span>
          </div>
        </EduCard>

        <EduCard delay={.1} style={{background:`linear-gradient(135deg,${C.surface},rgba(126,232,162,.06))`,borderColor:'rgba(126,232,162,.15)'}}>
          <div style={{fontSize:10,color:C.green,letterSpacing:'.2em',textTransform:'uppercase',marginBottom:20,fontFamily:"'DM Mono',monospace"}}>Certification</div>
          <div style={{fontSize:36,marginBottom:16}}>☁️</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,color:C.white,letterSpacing:-.3,marginBottom:8,lineHeight:1.2}}>AWS Cloud Practitioner</div>
          <div style={{fontSize:11,color:C.muted,fontFamily:"'DM Mono',monospace"}}>Amazon Web Services</div>
        </EduCard>

        <EduCard delay={.2} style={{borderColor:'rgba(126,232,162,.15)'}}>
          <div style={{fontSize:10,color:C.green,letterSpacing:'.2em',textTransform:'uppercase',marginBottom:20,fontFamily:"'DM Mono',monospace"}}>Currently</div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}>
            <div style={{width:8,height:8,borderRadius:'50%',background:C.green,animation:'pulse 2s ease-in-out infinite'}}/>
            <span style={{fontSize:12,color:C.green,fontFamily:"'DM Mono',monospace"}}>Available now</span>
          </div>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:C.white,marginBottom:12,lineHeight:1.2,letterSpacing:-.5}}>Open to new opportunities</div>
          <div style={{fontSize:12,color:C.muted,lineHeight:1.8,fontFamily:"'DM Mono',monospace"}}>
            AI / ML engineering · remote or hybrid · New York, NY area
          </div>
        </EduCard>
      </div>
    </Sec>

    {/* CONTACT */}
    <section id="contact" className="sec-wrap" style={{background:C.bg,borderTop:`1px solid ${C.border}`,position:'relative',zIndex:1}}>
      <div style={{position:'absolute',top:'50%',left:'40%',width:400,height:400,borderRadius:'50%',background:`radial-gradient(circle,rgba(126,232,162,.04),transparent 65%)`,pointerEvents:'none',transform:'translate(-50%,-50%)'}}/>
      <div className="contact-grid" style={{position:'relative',zIndex:1}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
            <span style={{fontSize:11,color:C.green,letterSpacing:'.2em',textTransform:'uppercase',fontFamily:"'DM Mono',monospace"}}>05 / CONTACT</span>
            <div style={{flex:1,height:1,background:`linear-gradient(90deg,${C.border},transparent)`}}/>
          </div>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'clamp(32px,5vw,72px)',letterSpacing:'clamp(-1px,-0.03em,-2px)',lineHeight:.95,color:C.white,marginBottom:20}}>
            LET'S<br/><span style={{color:C.green}}>BUILD.</span>
          </h2>
          <p style={{fontSize:14,color:C.muted,lineHeight:1.85,maxWidth:380,marginBottom:44}}>
            Open to AI and ML engineering roles, freelance work, or conversations about LLMs, RAG systems, and production ML infrastructure.
          </p>
          <a href="mailto:amullap@gmu.edu" data-h style={{display:'inline-flex',alignItems:'center',gap:10,padding:'14px 32px',background:C.green,color:C.bg,fontSize:12,fontWeight:500,textDecoration:'none',letterSpacing:'.08em',textTransform:'uppercase',transition:'all .2s'}}
            onMouseEnter={e=>{e.currentTarget.style.background='#a8f0bf';e.currentTarget.style.transform='translateY(-2px)';}}
            onMouseLeave={e=>{e.currentTarget.style.background=C.green;e.currentTarget.style.transform='none';}}>
            amullap@gmu.edu ↗
          </a>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:2}}>
          {[
            {label:'Email',    href:'mailto:amullap@gmu.edu',                          hint:'amullap@gmu.edu',          icon:'✉'},
            {label:'LinkedIn', href:'https://www.linkedin.com/in/abhirammullapudi',    hint:'Connect with me',           icon:'↗'},
            {label:'GitHub',   href:'https://www.github.com/abhiram1212',              hint:'See my projects',           icon:'⌥'},
            {label:'Portfolio',href:'https://d2k1s3747cubd5.cloudfront.net/',          hint:'Live portfolio',            icon:'◈'},
          ].map((l,i)=><ContactRow key={l.label} {...l} delay={i*.08}/>)}
        </div>
      </div>
    </section>

    <footer style={{background:C.bg,borderTop:`1px solid ${C.border}`,padding:'18px clamp(16px,5vw,64px)',position:'relative',zIndex:1}}>
      <div className="footer-inner">
        <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:14,color:C.muted,letterSpacing:-.3}}>Abhiram Mullapudi</span>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:C.dim,letterSpacing:'.1em'}}>New York, NY · 2026</span>
      </div>
    </footer>
  </>);
}

function NavLink({href,children}){
  const[h,setH]=useState(false);
  return(
    <a href={href} data-h onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{fontSize:11,letterSpacing:'.12em',textTransform:'uppercase',textDecoration:'none',color:h?C.green:C.muted,padding:'0 16px',height:56,display:'flex',alignItems:'center',borderLeft:`1px solid ${C.border}`,transition:'color .15s,background .15s',background:h?C.hover:'transparent',position:'relative'}}>
      {children}
      <span style={{position:'absolute',bottom:0,left:16,right:16,height:2,background:C.green,transform:h?'scaleX(1)':'scaleX(0)',transition:'transform .2s ease',transformOrigin:'left'}}/>
    </a>
  );
}

function EduCard({children,delay=0,style={}}){
  const[ref,inView]=useInView(.1);
  return(
    <div ref={ref} style={{background:C.surface,border:`1px solid ${C.border}`,padding:'36px',opacity:inView?1:0,transform:inView?'none':'translateY(20px)',transition:`opacity .7s ease ${delay}s,transform .7s ease ${delay}s`,position:'relative',overflow:'hidden',...style}}>
      <div style={{position:'absolute',top:0,left:0,width:3,height:'100%',background:C.green,opacity:.4}}/>
      {children}
    </div>
  );
}

function ContactRow({label,href,hint,icon,delay=0}){
  const[h,setH]=useState(false);
  const[ref,inView]=useInView(.1);
  return(
    <a ref={ref} href={href} target={href.startsWith('http')?'_blank':undefined} data-h
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        display:'flex',alignItems:'center',justifyContent:'space-between',
        padding:h?'22px 28px 22px 44px':'22px 28px',
        background:h?C.hover:C.bg,border:`1px solid ${h?C.greenDim:C.border}`,
        textDecoration:'none',transition:'all .25s',
        opacity:inView?1:0,transform:inView?'none':'translateX(28px)',
      }}>
      <div style={{display:'flex',alignItems:'center',gap:14}}>
        <span style={{fontSize:16,color:h?C.green:C.muted,transition:'color .2s',fontFamily:"'DM Mono',monospace"}}>{icon}</span>
        <div>
          <div style={{fontSize:13,fontWeight:500,color:C.white,fontFamily:"'Syne',sans-serif"}}>{label}</div>
          <div style={{fontSize:11,color:C.muted,fontFamily:"'DM Mono',monospace"}}>{hint}</div>
        </div>
      </div>
      <span style={{fontSize:16,color:h?C.green:C.muted,transition:'color .2s'}}>→</span>
    </a>
  );
}
