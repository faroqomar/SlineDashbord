module.exports=[20539,a=>{"use strict";a.i(55781);var b=a.i(45618);function c(){return(0,b.createClient)("https://isddrknbjsgaantjojhm.supabase.co",process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{autoRefreshToken:!1,persistSession:!1}})}a.s(["createAdminClient",()=>c])},16349,a=>{"use strict";a.i(42537);var b=a.i(5860),c=a.i(5246);async function d(){let a=await (0,c.cookies)();return(0,b.createServerClient)("https://isddrknbjsgaantjojhm.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzZGRya25ianNnYWFudGpvamhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NzEzNTAsImV4cCI6MjA2ODI0NzM1MH0.nszrlk0ZUmn94ur0mUQPr_ObIRy-wGe8Z-uOCyZuftc",{cookies:{getAll:()=>a.getAll(),setAll(b){try{b.forEach(({name:b,value:c,options:d})=>a.set(b,c,d))}catch{}}}})}a.s(["createClient",()=>d])},20272,a=>{"use strict";a.i(55781);var b=a.i(16349),c=a.i(20539);async function d(a){let d=await (0,b.createClient)(),{data:{user:e},error:f}=await d.auth.getUser();if(f||!e)throw Error("Unauthorized: No active session");let g=(0,c.createAdminClient)(),{data:h,error:i}=await g.from("admin_users").select("role").eq("id",e.id).single();if(i||!h)throw Error("Unauthorized: Not an admin");if(!a.includes(h.role))throw Error(`Forbidden: Insufficient permissions. Required one of: ${a.join(", ")}`);return{userId:e.id,role:h.role}}async function e(a){let b=(0,c.createAdminClient)(),{error:d}=await b.from("audit_logs").insert(a);if(d)throw console.error("Failed to write audit log:",d),Error(`Audit Log Failure: ${d.message}`)}a.s(["logAuditEvent",()=>e,"requireAdminRole",()=>d])},62569,a=>{"use strict";function b(a){return{success:!0,data:a}}function c(a){return{success:!1,error:a}}function d(a){return a instanceof Error?a.message:"string"==typeof a?a:"An unknown error occurred"}a.s(["fail",()=>c,"ok",()=>b,"toErrorMessage",()=>d])},28872,a=>{"use strict";var b=a.i(37936),c=a.i(20539),d=a.i(18558),e=a.i(20272),f=a.i(62569),g=a.i(53112);let h=g.z.object({page:g.z.number().int().positive().default(1),status:g.z.string().default("all"),limit:g.z.number().int().positive().max(100).default(10)}),i=g.z.object({id:g.z.string().uuid("Invalid Dispute ID"),status:g.z.enum(["open","in_progress","resolved","escalated"]),resolution:g.z.string().optional()}),j=["support","moderator","admin","super_admin"],k=["moderator","admin","super_admin"];var l=a.i(13095);async function m(a=1,b="all",d=10,g=""){try{let i=h.safeParse({page:a,status:b,limit:d});if(!i.success)return(0,f.fail)(i.error.issues[0].message);await (0,e.requireAdminRole)(j);let k=(0,c.createAdminClient)(),l=i.data.limit,m=(i.data.page-1)*l,n=k.from("disputes").select(`
        *,
        task:tasks (
          id,
          title,
          budget,
          budget_cents
        ),
        complainant:profiles!disputes_initiator_id_fkey (
          id,
          full_name,
          email,
          avatar_url,
          active_role,
          roles
        ),
        defendant:profiles!disputes_defendant_id_fkey (
          id,
          full_name,
          email,
          avatar_url,
          active_role,
          roles
        )
      `,{count:"exact"});i.data.status&&"all"!==i.data.status&&(n=n.eq("status",i.data.status)),g&&(n=n.or(`reason.ilike.%${g}%,id.eq.${g}`)),n=n.range(m,m+l-1).order("created_at",{ascending:!1});let{data:o,error:p,count:q}=await n;if(p)return(0,f.fail)("Failed to fetch disputes");let r=(o||[]).map(a=>({id:a.id,task_id:a.task?.id||a.task_id,task_title:a.task?.title||"Unknown Task",complainant:{id:a.complainant?.id,full_name:a.complainant?.full_name||"Unknown",avatar_url:a.complainant?.avatar_url||"",email:a.complainant?.email||"",role:a.complainant?.active_role||"user"},defendant:{id:a.defendant?.id,full_name:a.defendant?.full_name||"Unknown",avatar_url:a.defendant?.avatar_url||"",email:a.defendant?.email||"",role:a.defendant?.active_role||"user"},reason:a.reason||"No reason provided",status:a.status||"open",amount:a.task?.budget_cents?a.task.budget_cents/100:a.task?.budget||0,created_at:a.created_at}));return(0,f.ok)({disputes:r,totalPages:Math.ceil((q||0)/l),totalDisputes:q||0})}catch(a){return console.error("getDisputes error:",a),(0,f.fail)((0,f.toErrorMessage)(a))}}let n=g.z.object({id:g.z.string().uuid("Invalid Dispute ID")});async function o(a){try{let b=n.safeParse({id:a});if(!b.success)return(0,f.fail)(b.error.issues[0].message);await (0,e.requireAdminRole)(j);let d=(0,c.createAdminClient)(),{data:g,error:h}=await d.from("disputes").select(`
        *,
        task:tasks (
          id,
          title,
          description,
          budget,
          budget_cents,
          deadline,
          status
        ),
        complainant:profiles!disputes_initiator_id_fkey (
          id,
          full_name,
          email,
          avatar_url,
          active_role
        ),
         defendant:profiles!disputes_defendant_id_fkey (
          id,
          full_name,
          email,
          avatar_url,
          active_role
        )
      `).eq("id",b.data.id).single();if(h||!g)return(0,f.fail)("Dispute not found");let i={id:g.id,task_id:g.task?.id||g.task_id,task_title:g.task?.title||"Unknown Task",complainant:{id:g.complainant?.id,full_name:g.complainant?.full_name||"Unknown",avatar_url:g.complainant?.avatar_url||"",email:g.complainant?.email||"",role:g.complainant?.active_role||"user"},defendant:{id:g.defendant?.id,full_name:g.defendant?.full_name||"Unknown",avatar_url:g.defendant?.avatar_url||"",email:g.defendant?.email||"",role:g.defendant?.active_role||"user"},reason:g.reason||"No reason provided",status:g.status||"open",amount:g.task?.budget_cents?g.task.budget_cents/100:g.task?.budget||0,created_at:g.created_at,resolution:g.resolution,resolved_at:g.resolved_at,task_details:{description:g.task?.description||"",budget:g.task?.budget_cents?g.task.budget_cents/100:g.task?.budget||0,deadline:g.task?.deadline,status:g.task?.status||"unknown"}};return(0,f.ok)(i)}catch(a){return console.error("getDisputeDetails error:",a),(0,f.fail)((0,f.toErrorMessage)(a))}}async function p(a,b,g){try{let h=i.safeParse({id:a,status:g,resolution:b});if(!h.success)return(0,f.fail)(h.error.issues[0].message);let{userId:j}=await (0,e.requireAdminRole)(k),l=(0,c.createAdminClient)(),{error:m}=await l.from("disputes").update({resolution:h.data.resolution,status:h.data.status,resolved_at:new Date().toISOString()}).eq("id",h.data.id);if(m)return(0,f.fail)("Failed to resolve dispute");return await (0,e.logAuditEvent)({action:"admin.disputes.resolve",actor_user_id:j,related_entity_type:"dispute",related_entity_id:h.data.id,meta:{resolution:h.data.resolution,status:h.data.status}}),(0,d.revalidatePath)("/dashboard/disputes"),(0,d.revalidatePath)(`/dashboard/disputes/${h.data.id}`),(0,f.ok)({id:h.data.id})}catch(a){return console.error("resolveDispute error:",a),(0,f.fail)((0,f.toErrorMessage)(a))}}(0,l.ensureServerEntryExports)([m,o,p]),(0,b.registerServerReference)(m,"78426240b1d8773b188f40ac563a57ffdcbd581e4e",null),(0,b.registerServerReference)(o,"402135f3d7e630ae6a1a4dd5e3c74765a613eb8a1b",null),(0,b.registerServerReference)(p,"70565f907ac21d4f049d0b83282285648a21b802e5",null),a.s(["getDisputeDetails",()=>o,"getDisputes",()=>m,"resolveDispute",()=>p],28872)},36523,a=>{"use strict";var b=a.i(37936),c=a.i(20539);async function d(a,b,e,f,g={}){let h=(0,c.createAdminClient)();try{await h.from("activity_log").insert({actor_id:a,event_type:b,entity_type:e,entity_id:f,metadata:g,user_id:f,created_at:new Date().toISOString()})}catch(a){console.error("Failed to log admin action:",a)}}(0,a.i(13095).ensureServerEntryExports)([d]),(0,b.registerServerReference)(d,"7c1370eea33586812caa3ca25156bac6c06e6cc0f0",null),a.s(["logAdminAction",()=>d])},7576,a=>{"use strict";var b=a.i(37936),c=a.i(20539),d=a.i(16349),e=a.i(36523),f=a.i(18558);async function g(a=1,b="open",d=10){let e=(0,c.createAdminClient)(),f=(a-1)*d,h=e.from("disputes").select("*, initiator:profiles!initiator_id(*), task:tasks(*)",{count:"exact"}).order("created_at",{ascending:!1}).range(f,f+d-1);b&&"all"!==b&&(h=h.eq("status",b));let{data:i,count:j,error:k}=await h;if(k)throw Error(`Failed to fetch disputes: ${k.message}`);return{disputes:i||[],total:j||0,totalPages:Math.ceil((j||0)/d)}}async function h(a){let b=(0,c.createAdminClient)(),{data:d,error:e}=await b.from("disputes").select(`
      *,
      initiator:profiles!initiator_id(*),
      task:tasks(*),
      messages:dispute_messages(*),
      evidence:dispute_evidence(*)
    `).eq("id",a).single();if(e)throw Error(`Failed to fetch dispute details: ${e.message}`);return d}async function i(a,b,g,h){let i=(0,c.createAdminClient)(),j=await (0,d.createClient)(),{data:{user:k}}=await j.auth.getUser();if(!k)throw Error("Unauthorized");let{error:l}=await i.from("disputes").update({status:"resolved",resolution:g,reason:h,resolved_at:new Date().toISOString()}).eq("id",a);if(l)throw Error(`Failed to resolve dispute: ${l.message}`);return await (0,e.logAdminAction)(k.id,"resolve_dispute","dispute",a,{resolution:b,outcome:g,notes:h}),(0,f.revalidatePath)("/dashboard/disputes"),(0,f.revalidatePath)(`/dashboard/disputes/${a}`),{success:!0}}(0,a.i(13095).ensureServerEntryExports)([g,h,i]),(0,b.registerServerReference)(g,"7008746d7c92d8bbcae7dd0cccaee1122ff1cdf1f5",null),(0,b.registerServerReference)(h,"40bb2ad8807a3985628fea283263573e21dadbcf0f",null),(0,b.registerServerReference)(i,"7862feec36bc7acb2c63f71c4d25d4123f524fce41",null);var j=a.i(28872);a.s([],84490),a.i(84490),a.s(["402135f3d7e630ae6a1a4dd5e3c74765a613eb8a1b",()=>j.getDisputeDetails,"70565f907ac21d4f049d0b83282285648a21b802e5",()=>j.resolveDispute,"78426240b1d8773b188f40ac563a57ffdcbd581e4e",()=>j.getDisputes,"7862feec36bc7acb2c63f71c4d25d4123f524fce41",()=>i],7576)}];

//# sourceMappingURL=_f7016d66._.js.map