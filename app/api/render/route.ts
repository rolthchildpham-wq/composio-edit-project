import {NextResponse} from "next/server";
import {startRender} from "../../../server/jobs";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:Request){
 try{
  if(Number(request.headers.get("content-length")||0)>2048)return NextResponse.json({error:"Dữ liệu quá lớn"},{status:413});
  const body=await request.json();
  if(body?.compositionId!=="TemplateDemo"||!["720","1080"].includes(body?.quality))return NextResponse.json({error:"Tùy chọn render không hợp lệ"},{status:400});
  const job=startRender(body.compositionId,body.quality);
  return NextResponse.json({id:job.id,status:job.status,progress:job.progress},{status:202});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Không thể tạo job"},{status:409})}
}
