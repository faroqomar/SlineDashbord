module.exports=[20539,a=>{"use strict";a.i(55781);var b=a.i(45618);function c(){return(0,b.createClient)("https://isddrknbjsgaantjojhm.supabase.co",process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{autoRefreshToken:!1,persistSession:!1}})}a.s(["createAdminClient",()=>c])},14832,a=>{"use strict";var b=a.i(37936),c=a.i(20539),d=a.i(18558);async function e(a=1,b="all",d=10,f=""){let g=(0,c.createAdminClient)(),h=(a-1)*d,i=g.from("tasks").select(`
      id,
      title,
      description,
      budget,
      status,
      created_at,
      deadline,
      category,
      client:owner_id(id, full_name, avatar_url),
      freelancer:assigned_freelancer_id(id, full_name, avatar_url)
    `,{count:"exact"}).range(h,h+d-1).order("created_at",{ascending:!1});"all"!==b&&(i=i.eq("status",b)),f&&(i=i.ilike("title",`%${f}%`));let{data:j,error:k,count:l}=await i;if(k)throw console.error("Error fetching tasks:",k),Error("Failed to fetch tasks");return{tasks:(j||[]).map(a=>({id:a.id,title:a.title,description:a.description,budget:a.budget,status:a.status,created_at:a.created_at,deadline:a.deadline,category:a.category,client:{id:a.client?.id||"unknown",full_name:a.client?.full_name||"Unknown Client",avatar_url:a.client?.avatar_url||""},freelancer:a.freelancer?{id:a.freelancer.id,full_name:a.freelancer.full_name,avatar_url:a.freelancer.avatar_url}:null})),count:l||0,totalPages:l?Math.ceil(l/d):0}}async function f(a){let b=(0,c.createAdminClient)(),{data:d,error:e}=await b.from("tasks").select(`
      *,
      client:owner_id(id, full_name, avatar_url),
      freelancer:assigned_freelancer_id(id, full_name, avatar_url)
    `).eq("id",a).single();return e?(console.error("Error fetching task details:",e),null):{id:d.id,title:d.title,description:d.description,budget:d.budget,status:d.status,created_at:d.created_at,deadline:d.deadline,category:d.category,skills:d.skills||[],image_paths:d.image_paths||[],client:{id:d.client?.id||"unknown",full_name:d.client?.full_name||"Unknown Client",avatar_url:d.client?.avatar_url||""},freelancer:d.freelancer?{id:d.freelancer.id,full_name:d.freelancer.full_name,avatar_url:d.freelancer.avatar_url}:null}}async function g(a,b){let e=(0,c.createAdminClient)(),{error:f}=await e.from("tasks").update({status:"canceled"}).eq("id",a);if(f)throw console.error("Error canceling task:",f),Error("Failed to cancel task");let{error:g}=await e.from("admin_logs").insert({action:"cancel_task",entity_type:"task",entity_id:a,details:{reason:b}});g&&console.error("Error logging cancel task action:",g),(0,d.revalidatePath)("/dashboard/tasks"),(0,d.revalidatePath)(`/dashboard/tasks/${a}`)}(0,a.i(13095).ensureServerEntryExports)([e,f,g]),(0,b.registerServerReference)(e,"78c75681a7c352ef0dab31a72b3171a45b7b7dcc2f",null),(0,b.registerServerReference)(f,"4093e230b09ee0e14f0ed87f9494bb7eb9f3d785fe",null),(0,b.registerServerReference)(g,"60835ba3510b5f2f4a930e6acd08391136c2854ed5",null),a.s(["cancelTask",()=>g,"getTaskDetails",()=>f,"getTasks",()=>e])},45676,a=>{"use strict";var b=a.i(14832);a.s([],72039),a.i(72039),a.s(["4093e230b09ee0e14f0ed87f9494bb7eb9f3d785fe",()=>b.getTaskDetails,"60835ba3510b5f2f4a930e6acd08391136c2854ed5",()=>b.cancelTask,"78c75681a7c352ef0dab31a72b3171a45b7b7dcc2f",()=>b.getTasks],45676)}];

//# sourceMappingURL=_203c09f4._.js.map