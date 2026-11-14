"use client";
import React,{useEffect,useState} from "react";
import {Player} from "@remotion/player";
import {TemplateDemo} from "../src/lib/TemplateDemo";
type Job={id:string;status:"queued"|"rendering"|"done"|"failed";progress:number;error?:string;downloadUrl?:string};
const defaultFrames=525;
export default function Studio(){
  const [fps,setFps]=useState(30);
  const [quality,setQuality]=useState("1080");
  const [job,setJob]=useState<Job|null>(null);
  const [working,setWorking]=useState(false);
  useEffect(()=>{
    if(!job||job.status==="done"||job.status==="failed")return;
    const h=setInterval(async()=>{
      try{const r=await fetch("/api/render/"+encodeURIComponent(job.id),{cache:"no-store"});
        const j=await r.json();if(r.ok)setJob(j);
      }catch{}
    },1500);
    return ()=>clearInterval(h);
  },[job?.id,job?.status]);
  async function exportMp4(){
    setWorking(true);setJob(null);
    try{
      const response=await fetch("/api/render",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({compositionId:"TemplateDemo",quality})});
      const payload=await response.json();
      if(!response.ok)throw new Error(payload.error||"Không thể tạo job");
      setJob(payload);
    }catch(error){setJob({id:"",status:"failed",progress:0,error:String(error)})}
    finally{setWorking(false)}
  }
  return <div className="shell">
    <header className="top"><div><div className="brand">▶ Composio <span>Video Studio</span></div><div className="hint">Online Remotion editor · MVP TemplateDemo</div></div><div className="hint">Nhánh thử nghiệm · Không ảnh hưởng main</div></header>
    <main className="workspace">
      <section className="panel"><h2>Thư viện mẫu</h2><div className="controls"><button className="btn primary" aria-current="true">🎬 TemplateDemo</button><p className="muted">15 composition đã được giữ trong repository. Bản thử nghiệm chỉ kích hoạt TemplateDemo để kiểm tra toàn bộ luồng xuất MP4.</p><p className="muted">Thời lượng: 17,5 giây · 30 FPS · 9:16.</p></div></section>
      <section className="panel preview-panel"><h2>Xem trước</h2><div className="preview-wrap"><div className="player-holder"><Player component={TemplateDemo} compositionWidth={1080} compositionHeight={1920} durationInFrames={defaultFrames} fps={30} controls autoPlay={false} style={{width:"100%",aspectRatio:"9 / 16",maxHeight:480}}/></div></div><div className="bottom"><span className="muted">Timeline: 0 — 525 frames</span><span className="muted">Audio/video gốc được giữ nguyên</span></div></section>
      <aside className="panel"><h2>Xuất video MP4</h2><div className="controls">
        <label htmlFor="resolution">Chất lượng video<select id="resolution" value={quality} onChange={e=>setQuality(e.target.value)}><option value="720">720 × 1280 · HD</option><option value="1080">1080 × 1920 · Full HD</option></select></label>
        <label htmlFor="framerate">Tốc độ khung hình<select id="framerate" value={fps} onChange={e=>setFps(Number(e.target.value))}><option value="30">30 FPS (theo composition gốc)</option></select></label>
        <div className="status"><div>MP4 · H.264 / AAC</div><div className="muted">Nội dung đang dùng nguyên bản TemplateDemo.</div></div>
        <button className="btn primary" disabled={working||job?.status==="rendering"||job?.status==="queued"} onClick={exportMp4}>{working?"Đang gửi...":"⬇ Xuất MP4"}</button>
        {job&&<div className="status" role="status"><div>{job.status==="queued"?"Đang chờ":job.status==="rendering"?"Đang dựng video":job.status==="done"?"Đã hoàn thành":"Render thất bại"}</div><div className="bar" style={{marginTop:10}}><span style={{width:Math.round(job.progress*100)+"%"}}/></div><p className="muted">{Math.round(job.progress*100)}%</p>{job.error&&<p className="alert">{job.error}</p>}{job.status==="done"&&job.downloadUrl&&<a className="btn primary" style={{display:"block",textAlign:"center",textDecoration:"none"}} href={job.downloadUrl}>Tải video MP4</a>}</div>}
        <p className="muted">Lưu ý: Render dùng tài nguyên máy chủ. Mặc định bản thử nghiệm chỉ nhận một công việc tại một thời điểm.</p>
      </div></aside>
    </main><footer className="foot">Composio Video Studio · MVP. Không công khai dịch vụ render khi chưa bổ sung đăng nhập và giới hạn sử dụng.</footer>
  </div>;
}
