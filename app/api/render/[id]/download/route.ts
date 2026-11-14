import {NextResponse} from "next/server";
import {getJob} from "../../../../../server/jobs";
import fs from "node:fs";
import {Readable} from "node:stream";
import {stat} from "node:fs/promises";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;const job=getJob(id);
 if(!job||job.status!=="done"||!job.file)return NextResponse.json({error:"Video chưa sẵn sàng"},{status:404});
 try{
  const fileStat=await stat(job.file);
  const stream=Readable.toWeb(fs.createReadStream(job.file)) as ReadableStream;
  return new Response(stream,{headers:{"Content-Type":"video/mp4","Content-Disposition":'attachment; filename="TemplateDemo-'+id+'.mp4"',"Content-Length":String(fileStat.size),"Cache-Control":"private, no-store"}});
 }catch{return NextResponse.json({error:"Tệp không còn tồn tại"},{status:410})}
}
