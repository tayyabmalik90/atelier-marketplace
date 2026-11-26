// Generates working demo websites (public/demos/<slug>/index.html), preview art (public/previews/*.svg) and data/templates.json
import fs from "node:fs";
import path from "node:path";

const T = [
  { slug:"northwind", name:"Northwind", category:"Business & Corporate", type:"Corporate Website", style:"Corporate", tech:["Next.js"], features:["Responsive","Blog","Animation"], price:89, tags:["consulting","finance","b2b"], layout:"split", serif:false, pal:["#f7f8fa","#0f1b2d","#2563eb","#64748b","#ffffff"], badge:"popular", days:60, sales:184, desc:"A confident corporate site for firms that sell trust: services, case studies and a leadership team." },
  { slug:"folio", name:"Folio", category:"Portfolio & Personal Branding", type:"Portfolio", style:"Minimal", tech:["HTML"], features:["Responsive","Animation"], price:49, tags:["designer","photographer","personal"], layout:"editorial", serif:true, pal:["#faf9f6","#151515","#d9480f","#6b6b6b","#ffffff"], badge:"", days:40, sales:231, desc:"An editorial portfolio with oversized type and a calm project grid. Built to let the work lead." },
  { slug:"pulse", name:"Pulse", category:"SaaS & Technology", type:"SaaS Landing", style:"Modern", tech:["React"], features:["Responsive","Animation","CMS"], price:129, tags:["saas","startup","dark"], layout:"center", serif:false, dark:true, pal:["#0a0a12","#f4f4f8","#7c5cff","#9a9ab0","#14141f"], badge:"featured", days:12, sales:312, desc:"A dark, product-led SaaS site with feature tours, pricing-free messaging and a crisp hero." },
  { slug:"shelf", name:"Shelf", category:"E-commerce", type:"Online Store", style:"Modern", tech:["Next.js"], features:["Responsive","E-commerce","CMS","Blog"], price:149, tags:["shop","fashion","retail"], layout:"split", serif:false, pal:["#fbfaf8","#1a1a1a","#16a34a","#6f6f6f","#ffffff"], badge:"popular", days:25, sales:267, desc:"A clean storefront with product grids, collections and a conversion-focused product story." },
  { slug:"moodboard", name:"Moodboard", category:"Agency & Creative Studio", type:"Agency Website", style:"Creative", tech:["Webflow"], features:["Responsive","Animation","CMS"], price:99, tags:["agency","studio","bold"], layout:"editorial", serif:false, pal:["#fff4e8","#1b1b1b","#ff5a36","#6b5b4d","#ffffff"], badge:"new", days:4, sales:41, desc:"Loud, confident and playful. A studio site with big type, case-study tiles and a bold palette." },
  { slug:"keystone", name:"Keystone", category:"Real Estate", type:"Listings Website", style:"Luxury", tech:["WordPress"], features:["Responsive","CMS","Blog"], price:119, tags:["property","agent","listings"], layout:"split", serif:true, pal:["#f6f3ee","#1d1a16","#a07a3a","#7a7266","#ffffff"], badge:"", days:90, sales:96, desc:"A refined property showcase with featured listings, neighbourhood guides and agent profiles." },
  { slug:"ember", name:"Ember", category:"Restaurant & Hospitality", type:"Restaurant Website", style:"Luxury", tech:["HTML"], features:["Responsive","Animation"], price:59, tags:["restaurant","menu","dark"], layout:"center", serif:true, dark:true, pal:["#14100d","#f4ebe0","#d98a3d","#a89886","#1f1914"], badge:"popular", days:70, sales:158, desc:"Warm, atmospheric and appetising. Menus, reservations and a story told through dark, rich colour." },
  { slug:"lumen-academy", name:"Lumen Academy", category:"Education & Online Courses", type:"Course Platform", style:"Modern", tech:["React"], features:["Responsive","CMS","Blog"], price:109, tags:["courses","education","learning"], layout:"split", serif:false, pal:["#f5f7ff","#16183a","#4f46e5","#5d6086","#ffffff"], badge:"", days:33, sales:74, desc:"A friendly learning site: course catalogue, instructor profiles and clear enrolment paths." },
  { slug:"launchpad", name:"Launchpad", category:"Landing Pages", type:"Landing Page", style:"Minimal", tech:["HTML"], features:["Responsive","Animation"], price:39, tags:["waitlist","launch","one-page"], layout:"center", serif:false, pal:["#ffffff","#0b0b0b","#0ea5e9","#6b7280","#f4f6f8"], badge:"featured", days:8, sales:402, desc:"One page, one goal. A distraction-free launch page for waitlists, products and announcements." },
  { slug:"inkwell", name:"Inkwell", category:"Blogs & Publications", type:"Magazine", style:"Minimal", tech:["Next.js"], features:["Responsive","Blog","CMS"], price:69, tags:["blog","magazine","writing"], layout:"editorial", serif:true, pal:["#fdfcf9","#1c1c1c","#b91c1c","#6e6e6e","#ffffff"], badge:"", days:120, sales:88, desc:"A reading-first publication theme with generous measure, elegant serif type and clean archives." },
  { slug:"orbit", name:"Orbit", category:"SaaS & Technology", type:"SaaS Landing", style:"Creative", tech:["Next.js"], features:["Responsive","Animation","CMS","Blog"], price:139, tags:["ai","startup","gradient"], layout:"center", serif:false, pal:["#f3f1ff","#1a1442","#6d28d9","#6b6891","#ffffff"], badge:"new", days:2, sales:19, desc:"A vivid, forward-looking site for AI and devtools, with layered cards and generous motion." },
  { slug:"atlas-consulting", name:"Atlas Consulting", category:"Business & Corporate", type:"Corporate Website", style:"Corporate", tech:["WordPress"], features:["Responsive","CMS","Blog"], price:79, tags:["consulting","legal","firm"], layout:"split", serif:true, pal:["#f4f6f4","#14231c","#1f6f4a","#5f6f66","#ffffff"], badge:"", days:150, sales:121, desc:"Measured and authoritative. A professional-services site with practice areas and insights." },
  { slug:"monogram", name:"Monogram", category:"Portfolio & Personal Branding", type:"Portfolio", style:"Luxury", tech:["Webflow"], features:["Responsive","Animation"], price:89, tags:["architect","creative","elegant"], layout:"editorial", serif:true, pal:["#111111","#f1ece4","#c9a96e","#9b948a","#1a1a1a"], badge:"featured", days:18, sales:63, dark:true, desc:"A dark, gallery-style personal brand site for architects, artists and independent creatives." },
  { slug:"basil-co", name:"Basil & Co", category:"Restaurant & Hospitality", type:"Cafe Website", style:"Modern", tech:["Webflow"], features:["Responsive","E-commerce","Blog"], price:69, tags:["cafe","bakery","order-online"], layout:"split", serif:false, pal:["#f2f7ee","#1f2a1b","#4d7c0f","#68745f","#ffffff"], badge:"", days:55, sales:109, desc:"Fresh and inviting. A neighbourhood cafe site with menu, hours, gallery and online ordering." },
];

const COPY = {
  "Business & Corporate": ["Advisory built for the long term.","We help ambitious companies make better decisions, faster, with clear thinking and dependable delivery.",["Strategy","Operations","Finance"],["Market entry","Cost programme","Digital shift","M&A support"],"Our clients stay with us for years."],
  "Portfolio & Personal Branding": ["Selected work, thoughtfully made.","Independent designer working with founders and small teams on identity, product and web.",["Identity","Product","Web"],["Aster Coffee","Nova Health","Field Notes","Quiet Studio"],"A rare mix of taste and rigour."],
  "SaaS & Technology": ["Ship in days, not quarters.","The workspace that turns scattered work into momentum. Plan, build and review in one calm place.",["Real-time sync","Automations","Insights"],["Roadmaps","Docs","Reviews","Reports"],"We replaced three tools with this."],
  "E-commerce": ["Objects worth keeping.","A small, considered collection of everyday essentials, made well and made to last.",["Free returns","Carbon neutral","Made to last"],["Linen shirt","Canvas tote","Ceramic mug","Wool throw"],"The quality is obvious the moment it arrives."],
  "Agency & Creative Studio": ["We make brands impossible to ignore.","A creative studio for bold ideas, sharp strategy and work that gets talked about.",["Brand","Campaign","Motion"],["Orbit Rebrand","Loud Coffee","Sunday Club","Parallel"],"They pushed us further than we'd have dared."],
  "Real Estate": ["Find the home that feels like yours.","Hand-picked properties and honest guidance from people who know every street.",["Buying","Selling","Renting"],["Harbour Loft","Elm House","Garden Flat","Skyline Penthouse"],"Calm, clear and always one step ahead."],
  "Restaurant & Hospitality": ["Fire, salt and good company.","Seasonal cooking over open flame. Dinner Tuesday to Sunday, reservations recommended.",["Tasting menu","Natural wine","Private dining"],["Charred leeks","Dry-aged duck","Burnt honey","Smoked butter"],"The best meal we've had all year."],
  "Education & Online Courses": ["Learn skills that move your career.","Practical, project-based courses taught by working professionals. Start today, learn at your pace.",["Live cohorts","Mentor support","Certificates"],["Design Systems","Python for Data","Product Strategy","Copywriting"],"I landed a new role within two months."],
  "Landing Pages": ["Be first in line.","Join the waitlist for early access and a founding-member price. No spam, ever.",["Early access","Founding price","Direct line"],["Fast","Private","Simple","Yours"],"I signed up in ten seconds."],
  "Blogs & Publications": ["Stories worth the slow read.","Essays, interviews and field notes on design, craft and the people who make things.",["Essays","Interviews","Field notes"],["The quiet craft","Notes on typefaces","In the studio","Small tools"],"The only newsletter I read in full."],
};

const esc = (s)=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;");
function demo(t){
  const [bg,fg,ac,mu,sf]=t.pal; const [h,sub,feats,items,quote]=COPY[t.category];
  const font = t.serif ? "Georgia,'Times New Roman',serif" : "ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif";
  const body = t.serif ? "ui-sans-serif,system-ui,sans-serif" : font;
  const split = t.layout==="split", center=t.layout==="center", edit=t.layout==="editorial";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(t.name)} — ${esc(t.type)} demo</title>
<style>
*{box-sizing:border-box;margin:0}html{scroll-behavior:smooth}
body{background:${bg};color:${fg};font-family:${body};line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.wrap{max-width:1120px;margin:0 auto;padding:0 24px}
nav{display:flex;align-items:center;justify-content:space-between;padding:22px 0}
.logo{font-family:${font};font-weight:700;font-size:20px;letter-spacing:-.02em}
nav ul{display:flex;gap:28px;list-style:none;font-size:14px;color:${mu}}nav ul a:hover{color:${fg}}
.btn{display:inline-block;background:${ac};color:${t.dark?"#0a0a0a":"#fff"};padding:12px 22px;border-radius:${t.style==="Luxury"?"2px":"999px"};font-size:14px;font-weight:600;transition:.2s}
.btn:hover{transform:translateY(-2px);filter:brightness(1.08)}
.btn.ghost{background:transparent;color:${fg};border:1px solid ${fg}33}
.hero{padding:${edit?"72px 0 56px":"64px 0 72px"};display:grid;gap:48px;${split?"grid-template-columns:1.1fr .9fr;align-items:center":""};${center?"text-align:center;justify-items:center":""}}
h1{font-family:${font};font-size:clamp(40px,${edit?"9":"6"}vw,${edit?"96":"68"}px);line-height:1.02;letter-spacing:-.035em;font-weight:${t.serif?400:700};max-width:${center?"800px":"900px"}}
.hero p{font-size:18px;color:${mu};max-width:560px;margin:22px 0 30px}
.cta{display:flex;gap:12px;flex-wrap:wrap;${center?"justify-content:center":""}}
.vis{aspect-ratio:${split?"4/5":"16/7"};width:100%;border-radius:${t.style==="Luxury"?"4px":"22px"};background:
 radial-gradient(circle at 25% 20%,${ac}cc,transparent 55%),radial-gradient(circle at 80% 80%,${ac}55,transparent 50%),${sf};border:1px solid ${fg}14;position:relative;overflow:hidden}
.vis::after{content:"";position:absolute;inset:14% 12%;border-radius:14px;background:${bg}e6;border:1px solid ${fg}14;box-shadow:0 30px 60px -20px #0003}
section{padding:72px 0;border-top:1px solid ${fg}12}
h2{font-family:${font};font-size:clamp(28px,4vw,42px);letter-spacing:-.03em;font-weight:${t.serif?400:700};margin-bottom:12px}
.lead{color:${mu};max-width:560px;margin-bottom:40px}
.grid{display:grid;gap:20px;grid-template-columns:repeat(auto-fit,minmax(230px,1fr))}
.card{background:${sf};border:1px solid ${fg}12;border-radius:${t.style==="Luxury"?"4px":"18px"};padding:26px;transition:.25s}
.card:hover{transform:translateY(-4px);box-shadow:0 20px 40px -20px #0003}
.card b{display:block;font-size:17px;margin-bottom:6px;font-family:${font}}.card span{color:${mu};font-size:14px}
.tile{aspect-ratio:4/3;border-radius:${t.style==="Luxury"?"4px":"16px"};background:linear-gradient(135deg,${ac}${t.dark?"66":"33"},${sf});border:1px solid ${fg}12;display:flex;align-items:flex-end;padding:18px;font-family:${font};font-size:18px;transition:.3s}
.tile:hover{transform:scale(1.02)}
blockquote{font-family:${font};font-size:clamp(24px,3.4vw,36px);line-height:1.25;letter-spacing:-.02em;max-width:760px}
cite{display:block;margin-top:16px;font-size:14px;color:${mu};font-style:normal}
.band{background:${fg};color:${bg};border-radius:${t.style==="Luxury"?"4px":"28px"};padding:56px 32px;text-align:center}
.band .btn{background:${bg};color:${fg};margin-top:20px}.band p{opacity:.7;margin-top:8px}
form{display:flex;gap:10px;max-width:440px;flex-wrap:wrap;${center?"justify-content:center;margin:0 auto":""}}
input{flex:1;min-width:200px;padding:12px 16px;border-radius:999px;border:1px solid ${fg}26;background:${sf};color:${fg};font-size:14px}
footer{padding:40px 0;color:${mu};font-size:13px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px}
@media(max-width:760px){nav ul{display:none}.hero{grid-template-columns:1fr}.vis{aspect-ratio:16/10}}
</style></head><body>
<div class="wrap"><nav><a class="logo" href="#">${esc(t.name)}</a><ul><li><a href="#work">${esc(items[0])}</a></li><li><a href="#about">About</a></li><li><a href="#stories">Stories</a></li><li><a href="#contact">Contact</a></li></ul><a class="btn" href="#contact">Get in touch</a></nav>
<header class="hero"><div><h1>${esc(h)}</h1><p>${esc(sub)}</p><div class="cta"><a class="btn" href="#work">Explore</a><a class="btn ghost" href="#about">Learn more</a></div></div><div class="vis" aria-hidden="true"></div></header>
<section id="about"><h2>What we do</h2><p class="lead">Three things, done properly.</p><div class="grid">${feats.map((f,i)=>`<div class="card"><b>${esc(f)}</b><span>Thoughtful ${esc(f.toLowerCase())} with attention to detail at every step. 0${i+1}</span></div>`).join("")}</div></section>
<section id="work"><h2>Featured</h2><p class="lead">A closer look at what's new.</p><div class="grid">${items.map(i=>`<a class="tile" href="#">${esc(i)}</a>`).join("")}</div></section>
<section id="stories"><blockquote>“${esc(quote)}”</blockquote><cite>— A happy customer</cite></section>
<section id="contact"><div class="band"><h2>Ready when you are.</h2><p>Say hello — we reply within a day.</p><form onsubmit="event.preventDefault();this.innerHTML='<b>Thanks — we will be in touch.</b>'"><input type="email" required placeholder="you@email.com" aria-label="Email"><button class="btn" style="border:0;cursor:pointer;margin:0">Send</button></form></div></section>
<footer><span>© 2026 ${esc(t.name)}. All rights reserved.</span><span>Demo site — part of the Atelier template marketplace</span></footer></div></body></html>`;
}

function svg(t, v){
  const [bg,fg,ac,mu,sf]=t.pal; const W=800,H=520;
  const bar=`<rect x="0" y="0" width="${W}" height="34" fill="${sf}"/><circle cx="18" cy="17" r="5" fill="#ff5f57"/><circle cx="36" cy="17" r="5" fill="#febc2e"/><circle cx="54" cy="17" r="5" fill="#28c840"/><rect x="250" y="9" width="300" height="16" rx="8" fill="${fg}" opacity=".08"/>`;
  const nav=`<rect x="40" y="62" width="70" height="12" rx="6" fill="${fg}"/><rect x="520" y="64" width="40" height="8" rx="4" fill="${mu}" opacity=".5"/><rect x="580" y="64" width="40" height="8" rx="4" fill="${mu}" opacity=".5"/><rect x="660" y="56" width="100" height="24" rx="12" fill="${ac}"/>`;
  let inner="";
  if(v===0) inner=`${nav}<rect x="40" y="130" width="${t.layout==="split"?340:520}" height="30" rx="6" fill="${fg}"/><rect x="40" y="172" width="${t.layout==="split"?280:400}" height="30" rx="6" fill="${fg}"/><rect x="40" y="224" width="300" height="9" rx="4" fill="${mu}" opacity=".6"/><rect x="40" y="244" width="250" height="9" rx="4" fill="${mu}" opacity=".6"/><rect x="40" y="280" width="110" height="34" rx="17" fill="${ac}"/><rect x="162" y="280" width="110" height="34" rx="17" fill="none" stroke="${fg}" opacity=".3"/>${t.layout==="split"?`<rect x="430" y="110" width="330" height="360" rx="22" fill="${ac}" opacity=".35"/><rect x="460" y="150" width="270" height="280" rx="14" fill="${sf}"/>`:`<rect x="40" y="350" width="720" height="130" rx="20" fill="${ac}" opacity=".3"/>`}`;
  else if(v===1) inner=`${nav}<rect x="40" y="120" width="220" height="22" rx="6" fill="${fg}"/>${[0,1,2].map(i=>`<rect x="${40+i*245}" y="170" width="225" height="150" rx="16" fill="${sf}" stroke="${fg}" stroke-opacity=".1"/><rect x="${58+i*245}" y="190" width="40" height="40" rx="10" fill="${ac}" opacity=".8"/><rect x="${58+i*245}" y="246" width="120" height="10" rx="5" fill="${fg}"/><rect x="${58+i*245}" y="266" width="170" height="8" rx="4" fill="${mu}" opacity=".5"/>`).join("")}${[0,1,2,3].map(i=>`<rect x="${40+i*184}" y="350" width="170" height="120" rx="14" fill="${ac}" opacity="${.18+i*.1}"/>`).join("")}`;
  else inner=`${nav}<rect x="40" y="130" width="380" height="20" rx="6" fill="${fg}"/><rect x="40" y="168" width="640" height="10" rx="5" fill="${mu}" opacity=".5"/><rect x="40" y="188" width="560" height="10" rx="5" fill="${mu}" opacity=".5"/><rect x="40" y="250" width="720" height="220" rx="26" fill="${fg}"/><rect x="250" y="320" width="300" height="20" rx="6" fill="${bg}"/><rect x="310" y="380" width="180" height="40" rx="20" fill="${ac}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="${bg}"/>${bar}<g transform="translate(0,34) scale(1)">${inner}</g></svg>`;
}

fs.mkdirSync("public/previews",{recursive:true});
const out=[];
T.forEach((t,i)=>{
  fs.mkdirSync(`public/demos/${t.slug}`,{recursive:true});
  fs.writeFileSync(`public/demos/${t.slug}/index.html`,demo(t));
  [0,1,2].forEach(v=>fs.writeFileSync(`public/previews/${t.slug}-${v+1}.svg`,svg(t,v)));
  out.push({...t,id:i+1,preview:`/previews/${t.slug}-1.svg`,screenshots:[1,2,3].map(n=>`/previews/${t.slug}-${n}.svg`),demoUrl:`/demos/${t.slug}/index.html`});
});
fs.writeFileSync("data/templates.json",JSON.stringify(out,null,1));
console.log("generated",out.length);
