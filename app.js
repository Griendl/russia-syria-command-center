'use strict';
const CLR={diplomatic:'#3B82F6',defence:'#EF4444',consular:'#F59E0B',attache:'#F59E0B',secretariat:'#8B5CF6'};
const CAT_CSS={diplomatic:'c-dip',defence:'c-def',consular:'c-con',attache:'c-att',secretariat:'c-sec'};
const FLAG=code=>`https://flagcdn.com/w80/${code}.png`;

function kpiIcon(key){
  const icons={
    missions:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
    ru:`<img src="https://flagcdn.com/w40/ru.png" width="28" height="19" style="border-radius:2px;object-fit:cover" alt="RU"/>`,
    sy:`<img src="https://flagcdn.com/w40/sy.png" width="28" height="19" style="border-radius:2px;object-fit:cover" alt="SY"/>`,
    status:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>`,
    shield:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    resource:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    diplomacy:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>`
  };
  return icons[key]||'';
}

/* KPIs */
function renderKPIs(){
  const g=document.getElementById('kpi-grid');if(!g)return;
  g.innerHTML=DATA.kpis.map((k,i)=>`<div class="kpi pedestal pedestal-card kpi-tint-${i}">
    <div class="kpi-icon">${kpiIcon(k.icon)}</div>
    <div class="kpi-val${k.value==='ACTIVE'?' active':''}">${k.value}</div>
    <div class="kpi-lbl">${k.label}</div>
    <div class="kpi-sub">${k.sub}</div>
  </div>`).join('');
}

/* Mission cards */
function renderMissions(){
  const g=document.getElementById('m-grid');if(!g)return;
  g.innerHTML=DATA.missions.map((m,i)=>{
    const tot=m.staff.length;
    const contacts=[
      m.address&&`<div class="mc-ci"><span class="mc-ico">&#128205;</span><span>${m.address}</span></div>`,
      m.phone  &&`<div class="mc-ci"><span class="mc-ico">&#128222;</span><span>${m.phone}</span></div>`,
      m.email  &&`<div class="mc-ci"><span class="mc-ico">&#9993;</span><a href="mailto:${m.email}">${m.email}</a></div>`,
      m.website&&`<div class="mc-ci"><span class="mc-ico">&#127760;</span><a href="https://${m.website}" target="_blank" rel="noopener">${m.website}</a></div>`
    ].filter(Boolean).join('');
    const legend=m.composition.map(c=>{
      const p=Math.round(c.count/tot*100);
      return `<div class="cl-item"><div class="cl-dot" style="background:${c.color}"></div><span class="cl-lbl">${c.label}</span><span class="cl-cnt">${c.count} <span style="color:#4a5268;font-weight:400">(${p}%)</span></span></div>`;
    }).join('');
    const staff=m.staff.map(s=>`<div class="srow">
      <div class="sbar ${CAT_CSS[s.cat]||'c-dip'}"></div>
      <div><div class="sname">${s.name}</div><div class="stitle">${s.title}</div></div>
    </div>`).join('');
    return `<div class="mcard pedestal pedestal-card mcard-${m.flag}">
      <div class="mc-head">
        <div class="mc-flag-wrap">
          <img class="mc-flag" src="${FLAG(m.flag)}" alt="${m.flag}" width="38" height="26">
          <div><div class="mc-title">${m.name}</div><div class="mc-city">${m.city}, ${m.country}</div></div>
        </div>
        <span class="badge badge-active">Active</span>
      </div>
      <div class="mc-contact">${contacts}</div>
      <div class="mc-div"></div>
      <span class="lbl">Staff Composition</span>
      <div class="chart-sec">
        <div class="chart-wrap">
          <canvas id="ch-${i}" width="110" height="110"></canvas>
          <div class="chart-ctr"><div class="chart-val">${tot}</div><div class="chart-sub">Officers</div></div>
        </div>
        <div class="chart-leg">${legend}</div>
      </div>
      <div class="mc-div"></div>
      <span class="lbl">Accredited Personnel</span>
      <div class="staff">${staff}</div>
    </div>`;
  }).join('');

  DATA.missions.forEach((m,i)=>{
    const c=document.getElementById(`ch-${i}`);if(!c)return;
    new Chart(c.getContext('2d'),{
      type:'doughnut',
      data:{labels:m.composition.map(x=>x.label),datasets:[{data:m.composition.map(x=>x.count),backgroundColor:m.composition.map(x=>x.color),borderColor:'#111827',borderWidth:3,hoverOffset:5}]},
      options:{responsive:false,cutout:'68%',plugins:{legend:{display:false},tooltip:{backgroundColor:'#1a2035',borderColor:'rgba(255,255,255,.12)',borderWidth:1,titleColor:'#f0f4ff',bodyColor:'#8b95b0',titleFont:{family:'Inter',weight:'600',size:12},bodyFont:{family:'Inter',size:11},padding:10,cornerRadius:8,callbacks:{label:ctx=>{const t=ctx.dataset.data.reduce((a,b)=>a+b,0);return ` ${ctx.label}: ${ctx.parsed} (${Math.round(ctx.parsed/t*100)}%)`}}}},animation:{duration:700,easing:'easeInOutQuart'}}
    });
  });
}

/* Charts (Directions & Barriers) */
function renderCharts(){
  const d=DATA.charts.directions;
  const c1=document.getElementById('chart-dir');
  if(c1){
    new Chart(c1.getContext('2d'),{
      type:'radar',
      data:{
        labels:d.labels,
        datasets:[{
          label:'Cooperation Intensity',
          data:d.scores,
          backgroundColor:'rgba(59,130,246,0.2)',
          borderColor:'#3B82F6',
          pointBackgroundColor:'#EF4444',
          pointBorderColor:'#fff',
          pointHoverBackgroundColor:'#fff',
          pointHoverBorderColor:'#EF4444',
          borderWidth:2
        }]
      },
      options:{
        responsive:true,
        maintainAspectRatio:false,
        scales:{
          r:{
            angleLines:{color:'rgba(255,255,255,0.1)'},
            grid:{color:'rgba(255,255,255,0.05)'},
            pointLabels:{color:'#8b95b0',font:{family:'Inter',size:11,weight:'600'}},
            ticks:{display:false,min:0,max:100}
          }
        },
        plugins:{legend:{display:false}}
      }
    });
  }

  const b=DATA.charts.barriers;
  const c2=document.getElementById('chart-bar');
  if(c2){
    new Chart(c2.getContext('2d'),{
      type:'polarArea',
      data:{
        labels:b.labels,
        datasets:[{
          data:b.scores,
          backgroundColor:b.colors.map(c=>c+'80'),
          borderColor:b.colors,
          borderWidth:1
        }]
      },
      options:{
        responsive:true,
        maintainAspectRatio:false,
        scales:{
          r:{
            grid:{color:'rgba(255,255,255,0.05)'},
            ticks:{display:false,min:0,max:100}
          }
        },
        plugins:{
          legend:{position:'right',labels:{color:'#8b95b0',font:{family:'Inter',size:11},usePointStyle:true,padding:15}}
        }
      }
    });
  }
}

/* Conclusion */
function renderConclusion(){
  const el=document.getElementById('conclusion-block');if(!el)return;
  const c=DATA.conclusion;
  
  const tagsHtml=`<div class="concl-tags" style="justify-content:center">
    <div class="c-tag pedestal pedestal-tag" style="color:#EF4444;background:rgba(239,68,68,0.1)">MODEL: ${c.model}</div>
    <div class="c-tag pedestal pedestal-tag" style="color:#3B82F6;background:rgba(59,130,246,0.1)">STATUS: ${c.status}</div>
    <div class="c-tag pedestal pedestal-tag" style="color:#22C55E;background:rgba(34,197,94,0.1)">FORECAST: ${c.forecast}</div>
  </div>`;

  const radarHtml=`<div style="display:flex;flex-direction:column;align-items:center;gap:1.5rem;margin-top:1.5rem">
    <div style="position:relative;width:100%;max-width:420px;height:340px">
      <canvas id="chart-conclusion" role="img" aria-label="Spider radar chart comparing 2026 status with 2027-2028 outlook"></canvas>
    </div>
  </div>`;

  const ptsHtml=`<div class="concl-pts-grid" style="margin-top:1.5rem">
    ${c.points.map(p=>`
      <div class="concl-pt">
        <div class="cpt-ico">${kpiIcon(p.icon)}</div>
        <div class="cpt-txt">
          <div class="cpt-t">${p.title}</div>
          <div class="cpt-d">${p.desc}</div>
        </div>
      </div>
    `).join('')}
  </div>`;

  const summaryHtml=`<p class="concl-summary" style="margin-top:1.5rem">Bilateral relations are shifting from an <strong>ideological model</strong> to a <strong>pragmatic partnership</strong>: strengthening <strong>economic</strong> and <strong>energy ties</strong> while maintaining <strong>military-strategic presence</strong> (Khmeimim, Tartus). The forecast anticipates <strong>commercialization of cooperation</strong> and <strong>diversification of engagement</strong> by 2027–2028.</p>`;

  el.innerHTML=`${tagsHtml}${radarHtml}${ptsHtml}${summaryHtml}`;

  /* Render Spider Chart */
  const ctx=document.getElementById('chart-conclusion');
  if(ctx && typeof Chart!=='undefined'){
    new Chart(ctx.getContext('2d'),{
      type:'radar',
      data:{
        labels:['Military\nCooperation','Political\nInfluence','Economic\nTies','Energy\nSector','Food\nSecurity','Diplomatic\nPresence'],
        datasets:[
          {
            label:'Current State 2026',
            data:[92,80,55,62,78,70],
            backgroundColor:'rgba(59,130,246,0.15)',
            borderColor:'#3B82F6',
            pointBackgroundColor:'#3B82F6',
            pointBorderColor:'#fff',
            pointRadius:4,
            borderWidth:2
          },
          {
            label:'Forecast 2027–2028',
            data:[75,70,72,80,82,65],
            backgroundColor:'rgba(34,197,94,0.12)',
            borderColor:'#22C55E',
            pointBackgroundColor:'#22C55E',
            pointBorderColor:'#fff',
            pointRadius:4,
            borderWidth:2,
            borderDash:[5,5]
          }
        ]
      },
      options:{
        responsive:true,
        maintainAspectRatio:false,
        scales:{
          r:{
            angleLines:{color:'rgba(255,255,255,0.08)'},
            grid:{color:'rgba(255,255,255,0.06)'},
            pointLabels:{color:'#94a3b8',font:{family:'Inter',size:11,weight:'600'}},
            ticks:{display:false},
            suggestedMin:0,
            suggestedMax:100
          }
        },
        plugins:{
          legend:{
            position:'bottom',
            labels:{color:'#94a3b8',font:{family:'Inter',size:12},usePointStyle:true,padding:20}
          },
          tooltip:{
            backgroundColor:'#1a2035',
            borderColor:'rgba(255,255,255,.12)',
            borderWidth:1,
            titleColor:'#f8fafc',
            bodyColor:'#94a3b8',
            titleFont:{family:'Inter',weight:'600',size:12},
            bodyFont:{family:'Inter',size:11},
            padding:10,
            cornerRadius:8
          }
        },
        animation:{duration:900,easing:'easeInOutQuart'}
      }
    });
  }
}

/* Map */
function initMap(){
  const el=document.getElementById('map');if(!el)return;
  if(typeof L==='undefined'){
    el.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#64748b;font-size:.85rem;padding:1rem;text-align:center;">Map tiles require internet or cached assets</div>';
    return;
  }
  const map=L.map('map',{center:[42,34],zoom:4,minZoom:2,maxZoom:14});
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',{
    attribution:'Tiles &copy; <a href="https://www.esri.com/" target="_blank" rel="noopener">Esri</a>',
    maxZoom:16
  }).addTo(map);

  DATA.missions.forEach(m=>{
    const clr=m.flag==='ru'?'#3B82F6':'#EF4444';
    const icon=L.divIcon({
      className:'',
      iconSize:[38,48],
      iconAnchor:[19,48],
      popupAnchor:[0,-50],
      html:`<div style="position:relative;width:38px;height:48px;filter:drop-shadow(0 4px 12px ${clr}60)" aria-label="${m.name} marker"><div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-60%);width:42px;height:42px;border-radius:50%;background:${clr}22;animation:pr 2s ease-out infinite"></div><svg viewBox="0 0 38 48" xmlns="http://www.w3.org/2000/svg" style="width:38px;height:48px" aria-hidden="true"><path d="M19 2C10.2 2 3 9.2 3 18c0 11 16 30 16 30S35 29 35 18C35 9.2 27.8 2 19 2z" fill="${clr}"/><circle cx="19" cy="18" r="8" fill="rgba(255,255,255,.2)"/></svg><img src="${FLAG(m.flag)}" style="position:absolute;top:10px;left:50%;transform:translateX(-50%);width:14px;height:10px;border-radius:1px;object-fit:cover" alt="${m.country}"/></div><style>@keyframes pr{0%{transform:translate(-50%,-60%) scale(.7);opacity:.8}100%{transform:translate(-50%,-60%) scale(2);opacity:0}}</style>`
    });
    const staffHtml=m.staff.map(s=>`<li class="pop-item"><span class="pop-dot" style="background:${CLR[s.cat]||'#94a3b8'}"></span><div><div class="pop-pname">${s.name}</div><div class="pop-ptitle">${s.title}</div></div></li>`).join('');
    L.marker([m.lat,m.lng],{icon,title:m.name}).bindPopup(`<div class="pop"><div class="pop-head"><img class="pop-flag" src="${FLAG(m.flag)}" alt="${m.country}" width="26" height="18"><div><div class="pop-name">${m.name}</div><div class="pop-city">${m.city}, ${m.country}</div></div></div><div style="margin-bottom:6px"><span class="badge badge-active">Active</span></div><div class="pop-div"></div><ul class="pop-list">${staffHtml}</ul><div class="pop-div"></div><div class="pop-addr">${m.address}</div></div>`,{maxWidth:280,minWidth:220}).addTo(map);
  });

  if(window.ResizeObserver){
    const ro = new ResizeObserver(()=>{ map.invalidateSize(); });
    ro.observe(el);
  } else {
    window.addEventListener('resize', ()=>map.invalidateSize());
    setTimeout(()=>map.invalidateSize(),250);
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  renderKPIs();
  renderMissions();
  renderCharts();
  renderConclusion();
  initMap();
});