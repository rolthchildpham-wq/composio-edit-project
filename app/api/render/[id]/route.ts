import {NextResponse} from "next/server";
import {getJob} from "../../../../server/jobs";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;
 const job=getJob(id);
 if(!job)return NextResponse.json({error:"Không tìm thấy job"},{status:404});
 return NextResponse.json({id:job.id,status:job.status,progress:job.progress,error:job.error,downloadUrl:job.downloadUrl},{headers:{"Cache-Control":"no-store"}});
}
