import "server-only";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import {bundle} from "@remotion/bundler";
import {selectComposition,renderMedia} from "@remotion/renderer";
import {enableTailwind} from "@remotion/tailwind-v4";

export type RenderJob={id:string;status:"queued"|"rendering"|"done"|"failed";progress:number;error?:string;downloadUrl?:string;file?:string;createdAt:number};
const state=globalThis as typeof globalThis & {__videoJobs?:Map<string,RenderJob>;__videoActive?:boolean};
const jobs=state.__videoJobs??(state.__videoJobs=new Map());
const OUTPUT_ROOT=path.join(os.tmpdir(),"composio-studio-exports");
const allowed=new Set(["TemplateDemo"]);
export function getJob(id:string){return jobs.get(id)}
export function getOutputRoot(){return OUTPUT_ROOT}
export function startRender(compositionId:string,quality:"720"|"1080"){
 if(!allowed.has(compositionId))throw new Error("Composition chưa được hỗ trợ");
 if(state.__videoActive)throw new Error("Máy chủ đang render một video khác. Hãy thử lại sau.");
 const id=crypto.randomUUID();
 const job:RenderJob={id,status:"queued",progress:0,createdAt:Date.now()};
 jobs.set(id,job);state.__videoActive=true;
 void (async()=>{
  try{
   job.status="rendering";
   await fs.mkdir(OUTPUT_ROOT,{recursive:true});
   const bundleLocation=await bundle(path.resolve(process.cwd(),"src/index.ts"),undefined,{webpackOverride:enableTailwind,logLevel:"error"});
   const composition=await selectComposition({serveUrl:bundleLocation,id:compositionId});
   const file=path.join(OUTPUT_ROOT,id+".mp4");
   const scale=quality==="720"?2/3:1;
   await renderMedia({composition,serveUrl:bundleLocation,codec:"h264",audioCodec:"aac",outputLocation:file,scale,onProgress:({progress})=>{job.progress=progress}});
   job.file=file;job.progress=1;job.status="done";job.downloadUrl="/api/render/"+id+"/download";
  }catch(e){job.status="failed";job.error=e instanceof Error?e.message:"Render thất bại";}
  finally{state.__videoActive=false}
 })();
 return job;
}
