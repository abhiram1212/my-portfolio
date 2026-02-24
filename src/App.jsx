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
const ROLES = ["Software Engineer","Backend Architect","Go Developer","Cloud Native Builder","Systems Thinker"];

const WORK = [
  {
    id:1, num:"01",
    period:"Dec 2024 – Nov 2025",
    company:"SocialTech Labs", location:"New York, USA",
    role:"Software Development Engineer",
    stack:["Go","AWS Lambda","DynamoDB","Redis","Docker","Jenkins","API Gateway"],
    highlights:[
      "Designed Go microservices with worker pools & message channels to handle burst traffic at low latency.",
      "Architected stateless AWS service layer (Lambda + API Gateway + DynamoDB + Redis) — cut p95 latency by 30%.",
      "Distributed Redis caching with read-through, TTL eviction, and connection pooling slashed DB load by 45%.",
      "Built testing framework with table-driven tests, httptest, gomock — 85% coverage across 20K+ LOC.",
      "CI/CD pipelines with Jenkins + AWS CodePipeline compressed release cycles from days to hours.",
    ],
  },
  {
    id:2, num:"02",
    period:"Jul 2022 – Jun 2023",
    company:"1Stop.ai", location:"Bengaluru, India",
    role:"Software Engineer",
    stack:["Python","Flask","scikit-learn","Kafka","pytest","A/B Testing"],
    highlights:[
      "Built end-to-end data pipelines for automotive ML workloads — 40% faster runtime, 25% less memory.",
      "Flask REST APIs serving 1K+ concurrent predictions with fault tolerance and retry logic.",
      "Improved model accuracy 15% via GridSearchCV hyperparameter tuning and ensemble methods.",
      "A/B testing workflows enabled continuous retraining and performance regression detection.",
    ],
  },
  {
    id:3, num:"03",
    period:"Aug 2021 – Jan 2022",
    company:"Pixelvide", location:"Hyderabad, India",
    role:"Software Developer Intern",
    stack:["Java","Spring Boot","Apache Kafka","PostgreSQL","JWT","JUnit"],
    highlights:[
      "Built FMIS backend for large-scale government expenditure workflows in Java Spring Boot.",
      "Kafka streaming pipelines auto-billed 50K+ households from smart meter telemetry.",
      "JWT auth & RBAC for audit-compliant financial reporting APIs.",
      "JUnit + pytest suites kept test coverage above 90% for production releases.",
    ],
  },
];

const SKILLS = [
  { cat:"Languages",   items:["Go","Python","Java","TypeScript","SQL","C++"],                       levels:[5,5,5,3,4,2] },
  { cat:"Cloud & Infra",items:["AWS Lambda","DynamoDB","Redis","Docker","Kubernetes","CI/CD"],        levels:[5,5,5,4,3,4] },
  { cat:"Frameworks",  items:["Spring Boot","Flask","Node.js","React","Django","gRPC"],              levels:[5,5,3,3,3,3] },
  { cat:"Testing",     items:["gomock","pytest","JUnit","Mockito","TDD","httptest"],                 levels:[5,5,5,4,4,4] },
];

const STATS = [
  { val:30,  sfx:"%",   label:"p95 latency cut",    sub:"via AWS Lambda + Redis" },
  { val:45,  sfx:"%",   label:"DB load reduced",     sub:"Redis distributed cache" },
  { val:85,  sfx:"%",   label:"code coverage",       sub:"20K+ LOC, gomock" },
  { val:40,  sfx:"%",   label:"fewer defects",        sub:"post-release" },
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

  /* ── MOBILE NAV ── */
  .nav-desktop { display:flex; gap:0; }
  .nav-hamburger { display:none; flex-direction:column; gap:5px; cursor:pointer; padding:8px; background:transparent; border:none; }
  .nav-hamburger span { display:block; width:22px; height:2px; background:var(--c-green); transition:all .3s; }
  .nav-mobile { display:none; position:fixed; top:56px; left:0; right:0; background:var(--c-nav); backdrop-filter:blur(16px); border-bottom:1px solid var(--c-border); z-index:99; flex-direction:column; }
  .nav-mobile.open { display:flex; }
  .nav-mobile a { padding:16px 24px; font-size:13px; letter-spacing:.12em; text-transform:uppercase; text-decoration:none; color:var(--c-muted); border-bottom:1px solid ${C.border}; transition:color .2s,background .2s; }
  .nav-mobile a:hover { color:${C.green}; background:var(--c-greenFaint); }

  /* ── WORK CARD MOBILE ── */
  @media (max-width:600px) {
    .work-header { grid-template-columns: 36px 1fr !important; gap:12px !important; padding:20px 16px !important; }
    .work-header-meta { display:none !important; }
    .work-stack { padding:14px 16px !important; }
    .work-highlights { padding:16px 16px 20px !important; }
  }

  /* ── SKILL TABS MOBILE ── */
  .skill-tabs-wrap { display:flex; gap:0; margin-bottom:36px; border:1px solid var(--c-border); width:fit-content; flex-wrap:wrap; }
  @media (max-width:500px) {
    .skill-tabs-wrap { width:100%; }
    .skill-tabs-wrap button { flex:1; padding:10px 8px !important; font-size:9px !important; }
  }

  /* ── CONTACT GRID ── */
  .contact-grid { display:grid; grid-template-columns:1fr 1fr; gap:72px; align-items:center; }
  @media (max-width:700px) {
    .contact-grid { grid-template-columns:1fr; gap:40px; }
  }

  /* ── STATS GRID ── */
  .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:2px; }
  @media (max-width:800px) { .stats-grid { grid-template-columns:repeat(2,1fr); } }
  @media (max-width:400px) { .stats-grid { grid-template-columns:1fr; } }

  /* ── EDU GRID ── */
  .edu-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:2px; }

  /* ── HERO ── */
  .hero-section { min-height:100vh; padding:100px clamp(16px,5vw,64px) 60px; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; z-index:1; }

  /* ── SECTION WRAP ── */
  .sec-wrap { padding:72px clamp(16px,5vw,64px); }
  @media (max-width:600px) { .sec-wrap { padding:56px 16px; } }

  /* ── FOOTER ── */
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
  ::selection { background:var(--c-green); color:${C.bg}; }
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
  const t="Go · AWS · Redis · DynamoDB · Docker · Kubernetes · Spring Boot · Flask · Kafka · gRPC · GraphQL · PostgreSQL · CI/CD · Microservices · System Design · ";
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
      {/* header */}
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

      {/* expanded */}
      <div style={{maxHeight:open?700:0,overflow:'hidden',transition:'max-height .5s cubic-bezier(.4,0,.2,1)'}}>
        <div style={{borderTop:`1px solid ${C.border}`}}>
          {/* stack */}
          <div className="work-stack" style={{padding:'18px clamp(16px,3vw,32px)',display:'flex',flexWrap:'wrap',gap:8,borderBottom:`1px solid ${C.border}`}}>
            {job.stack.map(s=>(
              <span key={s} style={{padding:'3px 12px',border:`1px solid ${C.border}`,fontSize:11,color:C.green,background:C.greenFaint,transition:'all .2s',cursor:'default'}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.background='var(--c-hover)';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background='var(--c-greenFaint)';}}>
                {s}
              </span>
            ))}
          </div>
          {/* highlights */}
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

/* ── SKILLS ── */
function SkillsBlock(){
  const[cat,setCat]=useState("Languages");
  const[ref,inView]=useInView(.1);
  const grp=SKILLS.find(s=>s.cat===cat);
  return(
    <div ref={ref}>
      {/* tabs */}
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
      {/* bars */}
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
  const[dark,setDark]=useState(true);
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

    {/* ── NAV ── */}
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
          {[['#about','About'],['#work','Work'],['#skills','Skills'],['#edu','Education'],['#contact','Contact']].map(([h,l])=>(
            <NavLink key={h} href={h}>{l}</NavLink>
          ))}
        </nav>
        <button className="nav-hamburger" onClick={()=>setMenuOpen(o=>!o)} aria-label="Menu">
          <span style={{transform:menuOpen?'rotate(45deg) translate(5px,5px)':'none'}}/>
          <span style={{opacity:menuOpen?0:1}}/>
          <span style={{transform:menuOpen?'rotate(-45deg) translate(5px,-5px)':'none'}}/>
        </button>
        <div className="toggle-pill" onClick={()=>setDark(d=>!d)}>
          <span style={{fontSize:9,color:C.muted,letterSpacing:'.1em',textTransform:'uppercase',userSelect:'none'}}>{dark?'Dark':'Light'}</span>
          <button className="toggle-track" aria-label="Toggle theme"><span className="toggle-thumb"/></button>
        </div>
      </div>
      <div className={`nav-mobile${menuOpen?' open':''}`}>
        {[['#about','About'],['#work','Work'],['#skills','Skills'],['#edu','Education'],['#contact','Contact']].map(([h,l])=>(
          <a key={h} href={h} onClick={()=>setMenuOpen(false)}>{l}</a>
        ))}
      </div>
    </header>

    {/* ── HERO ── */}
    <section id="about" className="hero-section">
      {/* glow orb */}
      <div style={{position:'absolute',top:'20%',right:'5%',width:480,height:480,borderRadius:'50%',background:`radial-gradient(circle,rgba(126,232,162,.05),transparent 65%)`,pointerEvents:'none',animation:'float 10s ease-in-out infinite'}}/>

      <div style={{maxWidth:680,width:'100%'}}>
        <div className="fu1" style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 14px',border:`1px solid ${C.border}`,background:C.surface,marginBottom:28}}>
          <span style={{width:7,height:7,borderRadius:'50%',background:C.green,animation:'pulse 2s ease-in-out infinite'}}/>
          <span style={{fontSize:11,letterSpacing:'.14em',textTransform:'uppercase',color:C.muted}}>Available · Fairfax, VA</span>
        </div>

        <h1 className="fu2" style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'clamp(38px,7.5vw,96px)',lineHeight:.95,letterSpacing:'clamp(-1px,-0.03em,-3px)',marginBottom:24,color:C.white}}>
          ABHIRAM<br/><span style={{color:C.green}}>MULLAPUDI</span>
        </h1>

        <div className="fu3" style={{fontSize:'clamp(14px,1.6vw,17px)',marginBottom:32,color:C.muted}}>
          {'> '}<TW/>
        </div>

        <p className="fu4" style={{fontSize:14,color:C.muted,lineHeight:1.9,maxWidth:540,marginBottom:44}}>
          2+ years shipping production-grade backend systems — distributed microservices, cloud-native APIs, and automated pipelines. Go, Java, Python on AWS. I care about systems that scale without drama.
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

    {/* ── TICKER ── */}
    <Ticker/>

    {/* ── STATS ── */}
    <section style={{background:C.surface,padding:'72px clamp(16px,5vw,64px)',borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,position:'relative',zIndex:1}}>
      <div className="stats-grid">
        {STATS.map((s,i)=><StatCard key={i} {...s} delay={i*.08}/>)}
      </div>
    </section>

    {/* ── WORK ── */}
    <Sec id="work" num="01 / EXPERIENCE" title={<>Where I've<br/>shipped.</>}>
      <div style={{display:'flex',flexDirection:'column',gap:2}}>
        {WORK.map((j,i)=><WorkCard key={j.id} job={j} index={i}/>)}
      </div>
    </Sec>

    {/* ── SKILLS ── */}
    <Sec id="skills" num="02 / SKILLS" title={<>Tools &<br/>craft.</>} alt>
      <SkillsBlock/>
    </Sec>

    {/* ── EDUCATION ── */}
    <Sec id="edu" num="03 / EDUCATION" title={<>Academic<br/>roots.</>}>
      <div className="edu-grid">
        {/* degree */}
        <EduCard delay={0}>
          <div style={{fontSize:10,color:C.green,letterSpacing:'.2em',textTransform:'uppercase',marginBottom:20,fontFamily:"'DM Mono',monospace"}}>Master's Degree</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:26,color:C.white,letterSpacing:-.5,marginBottom:8,lineHeight:1.2}}>Computer Science</div>
          <div style={{fontSize:13,color:C.green,marginBottom:4}}>George Mason University</div>
          <div style={{fontSize:11,color:C.muted,fontFamily:"'DM Mono',monospace",marginBottom:28}}>Fairfax, Virginia</div>
          <div style={{display:'flex',alignItems:'baseline',gap:6}}>
            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:48,color:C.green,letterSpacing:-2,lineHeight:1}}>3.67</span>
            <span style={{fontSize:14,color:C.muted,fontFamily:"'DM Mono',monospace"}}>/4.0 GPA</span>
          </div>
        </EduCard>

        {/* cert */}
        <EduCard delay={.1} style={{background:`linear-gradient(135deg,${C.surface},rgba(126,232,162,.06))`,borderColor:'rgba(126,232,162,.15)'}}>
          <div style={{fontSize:10,color:C.green,letterSpacing:'.2em',textTransform:'uppercase',marginBottom:20,fontFamily:"'DM Mono',monospace"}}>Certification</div>
          <div style={{fontSize:36,marginBottom:16}}>☁️</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,color:C.white,letterSpacing:-.3,marginBottom:8,lineHeight:1.2}}>AWS Cloud Practitioner</div>
          <div style={{fontSize:11,color:C.muted,fontFamily:"'DM Mono',monospace"}}>Amazon Web Services<br/>December 2024</div>
        </EduCard>

        {/* availability */}
        <EduCard delay={.2} style={{borderColor:'rgba(126,232,162,.15)'}}>
          <div style={{fontSize:10,color:C.green,letterSpacing:'.2em',textTransform:'uppercase',marginBottom:20,fontFamily:"'DM Mono',monospace"}}>Currently</div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}>
            <div style={{width:8,height:8,borderRadius:'50%',background:C.green,animation:'pulse 2s ease-in-out infinite'}}/>
            <span style={{fontSize:12,color:C.green,fontFamily:"'DM Mono',monospace"}}>Available now</span>
          </div>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:C.white,marginBottom:12,lineHeight:1.2,letterSpacing:-.5}}>Open to new opportunities</div>
          <div style={{fontSize:12,color:C.muted,lineHeight:1.8,fontFamily:"'DM Mono',monospace"}}>
            Backend engineering · remote or hybrid · Fairfax, VA area
          </div>
        </EduCard>
      </div>
    </Sec>

    {/* ── CONTACT ── */}
    <section id="contact" className="sec-wrap" style={{background:C.surface,borderTop:`1px solid ${C.border}`,position:'relative',zIndex:1}}>
      <div style={{position:'absolute',top:'50%',left:'40%',width:400,height:400,borderRadius:'50%',background:`radial-gradient(circle,rgba(126,232,162,.04),transparent 65%)`,pointerEvents:'none',transform:'translate(-50%,-50%)'}}/>
      <div className="contact-grid" style={{position:'relative',zIndex:1}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
            <span style={{fontSize:11,color:C.green,letterSpacing:'.2em',textTransform:'uppercase',fontFamily:"'DM Mono',monospace"}}>04 / CONTACT</span>
            <div style={{flex:1,height:1,background:`linear-gradient(90deg,${C.border},transparent)`}}/>
          </div>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'clamp(32px,5vw,72px)',letterSpacing:'clamp(-1px,-0.03em,-2px)',lineHeight:.95,color:C.white,marginBottom:20}}>
            LET'S<br/><span style={{color:C.green}}>BUILD.</span>
          </h2>
          <p style={{fontSize:14,color:C.muted,lineHeight:1.85,maxWidth:380,marginBottom:44}}>
            Open to backend engineering roles, freelance work, or conversations about distributed systems and cloud architecture.
          </p>
          <a href="mailto:amullap@gmu.edu" data-h style={{display:'inline-flex',alignItems:'center',gap:10,padding:'14px 32px',background:C.green,color:C.bg,fontSize:12,fontWeight:500,textDecoration:'none',letterSpacing:'.08em',textTransform:'uppercase',transition:'all .2s'}}
            onMouseEnter={e=>{e.currentTarget.style.background='#a8f0bf';e.currentTarget.style.transform='translateY(-2px)';}}
            onMouseLeave={e=>{e.currentTarget.style.background=C.green;e.currentTarget.style.transform='none';}}>
            amullap@gmu.edu ↗
          </a>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:2}}>
          {[
            {label:'Email',    href:'mailto:amullap@gmu.edu', hint:'amullap@gmu.edu',   icon:'✉'},
            {label:'LinkedIn', href:'https://linkedin.com',   hint:'Connect with me',    icon:'↗'},
            {label:'GitHub',   href:'https://github.com',     hint:"See my projects",    icon:'⌥'},
          ].map((l,i)=><ContactRow key={l.label} {...l} delay={i*.08}/>)}
        </div>
      </div>
    </section>

    <footer style={{background:C.bg,borderTop:`1px solid ${C.border}`,padding:'18px clamp(16px,5vw,64px)',position:'relative',zIndex:1}}>
      <div className="footer-inner">
        <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:14,color:C.muted,letterSpacing:-.3}}>Abhiram Mullapudi</span>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:C.dim,letterSpacing:'.1em'}}>Fairfax, VA · 2025</span>
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