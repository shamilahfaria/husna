const {P,mix}=require('./palettes.js');const fs=require('fs');
const lum=h=>{const c=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(v=>v<=.03928?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const cr=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
let MIN=4.9;
// largest mix t<=tmax of `line` into `base` whose full-strength pixel still keeps every text colour at >= MIN
function fit(base,line,tmax,texts){let t=tmax;while(t>0.02){const c=mix(base,line,t);if(texts.every(x=>cr(x,c)>=MIN))return [t,c];t-=0.01}return [0,base]}
let css='';const report={};
for(const [id,m] of Object.entries(P)) for(const mode of ['day','night']){const c=m[mode];
 MIN=(id==='iznik'&&mode==='night')?5.6:4.9;
 const hair=mode==='day'?'rgba(0,0,0,.17)':'rgba(255,255,255,.15)';
 const muted=mix(c.muted,c.ink,.6);
 const spfill=mix(c.ground,c.madder,mode==='day'?.12:.16);
 const txt=[c.ink,muted];
 const [tPat,pat]=fit(c.sheet,c.patLine||c.line,c.lineT,txt);
 const SOFT=id.startsWith('powder');
 const [tSp,sp]=fit(spfill,c.line,SOFT?(mode==='day'?.22:.14):(mode==='day'?.32:.2),txt);
 const [tAr,arch]=SOFT?fit(spfill,c.line,mode==='day'?.5:.36,txt):fit(spfill,mode==='day'?mix(c.line,c.madder,.5):c.line,mode==='day'?.9:.7,txt);
 const bandfill=SOFT?mix(c.ground,c.madder,mode==='day'?.07:.13):mix(c.ground,c.madder,mode==='day'?.2:.33);
 const bord=SOFT?mix(bandfill,c.bordLine||c.line,mode==='day'?.62:.42):(mode==='day'?mix(c.line,c.madder,.45):mix(c.madder,c.line,.8));
 const guardV=SOFT?mix(c.ground,c.line,mode==='day'?.42:.3):mix(c.ground,c.line,mode==='day'?.85:.7);
 report[id+' '+mode]={pat:[+tPat.toFixed(2),pat],sp:[+tSp.toFixed(2),sp],arch:[+tAr.toFixed(2),arch],bandfill,bord};
 css+=`html[data-board=${id}][data-mode=${mode}]{--ground:${c.ground};--sheet:${c.sheet};--madder:${c.madder};--on-madder:${c.onm};--accent:${c.accent};--badge:${c.badge||c.accent};--badge-ink:${mode==='day'?c.onm:c.ground};--ink:${c.ink};--muted:${muted};--hair:${hair};--pat:${pat};--guard:${guardV};--fieldbg:${c.sheet};--bandfill:${bandfill};--bord:${bord};--sp:${sp};--arch:${arch};--spfill:${spfill};--sheen:${mode==='day'?'rgba(255,255,255,.28)':'rgba(255,255,255,.025)'};--shade:${mode==='day'?'rgba(70,50,80,.10)':'rgba(0,0,0,.22)'};--pile:${mode==='day'?'rgba(40,30,50,.024)':'rgba(0,0,0,.10)'};--qline:${mode==='day'?'rgba(40,40,60,.07)':'rgba(0,0,0,.16)'};--raise:${mode==='day'?'rgba(255,255,255,.55)':'rgba(0,0,0,.45)'};--btn-ink:${c.btn};--field:${c.field};--tab:${c.ground};--olive:${c.olive};--me-bg:${c.ink};--me-ink:${c.ground};--scrim:rgba(10,12,16,.55)}\n`;}

const VAR={
 powder:{ink:{day:'#1F2A38',night:'#EEF2F8'},t:null},
 powder_v1:{t:['#9ED0CB','#B2D9C4','#A4C6DA','#C3DDB6','#E0D8C0','#BCC7DC'],me:{day:'#FFFFFF',night:'#19282E'},meBg:{day:null,night:'#D4EBE6'}},
 powder_v2:{t:['#7385B5','#8DA2C4','#A4B8D2','#A9C7BC','#8E98B0','#D3D8D2'],meBg:{day:null,night:'#D6DCF2'}},
 powder_v3:{t:['#7385B5','#9ED0CB','#8DA2C4','#B2D9C4','#8E98B0','#A9C7BC'],meBg:{day:null,night:'#D6DCF2'}}};
const avr={},chk={};
const TINT={day:[.16,.24,.32,.40,.48,.56],night:[.45,.55,.65,.75,.85,.95]};
for(const id of Object.keys(VAR)) for(const mode of ['day','night']){const c=P[id][mode];const v=VAR[id];
 let tiles,ink=mode==='day'?c.ink:'#EEF2F8';
 if(!v.t){const base=mode==='day'?c.madder:'#4F70A0';tiles=TINT[mode].map(t=>mix(c.ground,base,Math.min(1,t)));ink=mode==='day'?'#1F2A38':'#EEF2F8';}
 else if(mode==='day'){tiles=v.t.map(h=>{let x=h,t=0;while(cr(ink,x)<5.6&&t<1){t+=.04;x=mix(h,'#FFFFFF',t)}return x});}
 else{tiles=v.t.map(h=>{let x=mix(h,'#0E1626',.5),t=.5;while(cr(ink,x)<5.2&&t<1){t+=.04;x=mix(h,'#0E1626',t)}return x});}
 const meBg=mode==='day'?c.madder:(v.meBg&&v.meBg.night||'#D5E1F1'),meInk=mode==='day'?c.onm:(id==='powder'?'#19253A':c.ground);
 css+=`html[data-board=${id}][data-mode=${mode}]{--line:${c.line};${tiles.map((h,i)=>`--tint-${i+1}:${h}`).join(';')};--tint-me:${meBg};--tint-me-ink:${meInk};--tint-ink:${ink};--av-ink:${ink}}\n`;
 avr[id+' '+mode]={tiles,minInitials:+Math.min(...tiles.map(h=>cr(ink,h))).toFixed(2),me:+cr(meInk,meBg).toFixed(2)};
 chk[id+' '+mode]={onMadder:+cr(c.onm,c.madder).toFixed(2),badgeInk:+cr(mode==="day"?c.onm:c.ground,c.badge||c.accent).toFixed(2),btnInk:+cr(c.btn,c.onm).toFixed(2),oliveOnSheet:+cr(c.olive,c.sheet).toFixed(2),inkOnGround:+cr(c.ink,c.ground).toFixed(2)};}
fs.writeFileSync('palette-checks.json',JSON.stringify(chk,null,1));
fs.writeFileSync('avatar-report.json',JSON.stringify(avr,null,1));console.log(JSON.stringify(avr));
fs.writeFileSync('boards3.css',fs.readFileSync('boards3.tpl.css','utf8').replace('@PALETTES@',css));
fs.writeFileSync('fit-report.json',JSON.stringify(report,null,1));
for(const k in report)console.log(k,'pat',report[k].pat.join(' '),'sp',report[k].sp.join(' '),'arch',report[k].arch.join(' '));
