module.exports=[20539,a=>{"use strict";a.i(55781);var b=a.i(45618);function c(){return(0,b.createClient)("https://isddrknbjsgaantjojhm.supabase.co",process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{autoRefreshToken:!1,persistSession:!1}})}a.s(["createAdminClient",()=>c])},45670,a=>{"use strict";var b=a.i(37936),c=a.i(20539),d=a.i(18558);async function e(a=1,b="all",d=10,f=""){let g=(0,c.createAdminClient)(),h=(a-1)*d;try{let a=g.from("disputes").select(`
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
      `,{count:"exact"});b&&"all"!==b&&(a=a.eq("status",b)),f&&(a=a.or(`reason.ilike.%${f}%,id.eq.${f}`)),a=a.range(h,h+d-1).order("created_at",{ascending:!1});let{data:c,error:e,count:i}=await a;if(e)throw console.error("Error fetching disputes:",e),Error("Failed to fetch disputes");return{disputes:c.map(a=>({id:a.id,task_id:a.task?.id||a.task_id,task_title:a.task?.title||"Unknown Task",complainant:{id:a.complainant?.id,full_name:a.complainant?.full_name||"Unknown",avatar_url:a.complainant?.avatar_url||"",email:a.complainant?.email||"",role:a.complainant?.active_role||"user"},defendant:{id:a.defendant?.id,full_name:a.defendant?.full_name||"Unknown",avatar_url:a.defendant?.avatar_url||"",email:a.defendant?.email||"",role:a.defendant?.active_role||"user"},reason:a.reason||"No reason provided",status:a.status||"open",amount:a.task?.budget_cents?a.task.budget_cents/100:a.task?.budget||0,created_at:a.created_at})),totalPages:Math.ceil((i||0)/d),totalDisputes:i||0}}catch(a){return console.error("getDisputes error:",a),{disputes:[],totalPages:0,totalDisputes:0}}}async function f(a){let b=(0,c.createAdminClient)();try{let{data:c,error:d}=await b.from("disputes").select(`
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
      `).eq("id",a).single();if(d||!c)throw Error("Dispute not found");return{id:c.id,task_id:c.task?.id||c.task_id,task_title:c.task?.title||"Unknown Task",complainant:{id:c.complainant?.id,full_name:c.complainant?.full_name||"Unknown",avatar_url:c.complainant?.avatar_url||"",email:c.complainant?.email||"",role:c.complainant?.active_role||"user"},defendant:{id:c.defendant?.id,full_name:c.defendant?.full_name||"Unknown",avatar_url:c.defendant?.avatar_url||"",email:c.defendant?.email||"",role:c.defendant?.active_role||"user"},reason:c.reason||"No reason provided",status:c.status||"open",amount:c.task?.budget_cents?c.task.budget_cents/100:c.task?.budget||0,created_at:c.created_at,resolution:c.resolution,resolved_at:c.resolved_at,task_details:{description:c.task?.description||"",budget:c.task?.budget_cents?c.task.budget_cents/100:c.task?.budget||0,deadline:c.task?.deadline,status:c.task?.status||"unknown"}}}catch(a){return console.error("getDisputeDetails error:",a),null}}async function g(a,b,e){let f=(0,c.createAdminClient)();try{let{error:c}=await f.from("disputes").update({resolution:b,status:e,resolved_at:new Date().toISOString()}).eq("id",a);if(c)throw c;return await f.from("admin_logs").insert({action:"RESOLVE_DISPUTE",target_resource:"dispute",target_id:a,metadata:{resolution:b,status:e}}),(0,d.revalidatePath)("/dashboard/disputes"),(0,d.revalidatePath)(`/dashboard/disputes/${a}`),{success:!0}}catch(a){return console.error("resolveDispute error:",a),{success:!1,error:"Failed to resolve dispute"}}}(0,a.i(13095).ensureServerEntryExports)([e,f,g]),(0,b.registerServerReference)(e,"7841c69db8bef786b58604ff243e4ba6159ab90a90",null),(0,b.registerServerReference)(f,"405af5688f945bb0a89788c27ee6114c8f0ed43edc",null),(0,b.registerServerReference)(g,"70e15dac2d1adfcb702e8b19ca95f1039b1e4bcd98",null),a.s(["getDisputeDetails",()=>f,"getDisputes",()=>e,"resolveDispute",()=>g])},16349,a=>{"use strict";a.i(42537);var b=a.i(5860),c=a.i(5246);async function d(){let a=await (0,c.cookies)();return(0,b.createServerClient)("https://isddrknbjsgaantjojhm.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzZGRya25ianNnYWFudGpvamhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NzEzNTAsImV4cCI6MjA2ODI0NzM1MH0.nszrlk0ZUmn94ur0mUQPr_ObIRy-wGe8Z-uOCyZuftc",{cookies:{getAll:()=>a.getAll(),setAll(b){try{b.forEach(({name:b,value:c,options:d})=>a.set(b,c,d))}catch{}}}})}a.s(["createClient",()=>d])},36523,a=>{"use strict";var b=a.i(37936),c=a.i(20539);async function d(a,b,e,f,g={}){let h=(0,c.createAdminClient)();try{await h.from("activity_log").insert({actor_id:a,event_type:b,entity_type:e,entity_id:f,metadata:g,user_id:f,created_at:new Date().toISOString()})}catch(a){console.error("Failed to log admin action:",a)}}(0,a.i(13095).ensureServerEntryExports)([d]),(0,b.registerServerReference)(d,"7c81d64abe9ca9dcb0da8409544415719c6785e0c0",null),a.s(["logAdminAction",()=>d])},47575,a=>{"use strict";var b=a.i(37936),c=a.i(20539),d=a.i(16349),e=a.i(36523),f=a.i(18558);async function g(a=1,b="open",d=10){let e=(0,c.createAdminClient)(),f=(a-1)*d,h=e.from("disputes").select("*, initiator:profiles!initiator_id(*), task:tasks(*)",{count:"exact"}).order("created_at",{ascending:!1}).range(f,f+d-1);b&&"all"!==b&&(h=h.eq("status",b));let{data:i,count:j,error:k}=await h;if(k)throw Error(`Failed to fetch disputes: ${k.message}`);return{disputes:i||[],total:j||0,totalPages:Math.ceil((j||0)/d)}}async function h(a){let b=(0,c.createAdminClient)(),{data:d,error:e}=await b.from("disputes").select(`
      *,
      initiator:profiles!initiator_id(*),
      task:tasks(*),
      messages:dispute_messages(*),
      evidence:dispute_evidence(*)
    `).eq("id",a).single();if(e)throw Error(`Failed to fetch dispute details: ${e.message}`);return d}async function i(a,b,g,h){let i=(0,c.createAdminClient)(),j=await (0,d.createClient)(),{data:{user:k}}=await j.auth.getUser();if(!k)throw Error("Unauthorized");let{error:l}=await i.from("disputes").update({status:"resolved",resolution:g,reason:h,resolved_at:new Date().toISOString()}).eq("id",a);if(l)throw Error(`Failed to resolve dispute: ${l.message}`);return await (0,e.logAdminAction)(k.id,"resolve_dispute","dispute",a,{resolution:b,outcome:g,notes:h}),(0,f.revalidatePath)("/dashboard/disputes"),(0,f.revalidatePath)(`/dashboard/disputes/${a}`),{success:!0}}(0,a.i(13095).ensureServerEntryExports)([g,h,i]),(0,b.registerServerReference)(g,"70400f1848ebb00b5369f24667dc6565c3078800c1",null),(0,b.registerServerReference)(h,"40be4bba73c7899eee81b0d52b16feb8b6797b7340",null),(0,b.registerServerReference)(i,"7840a7728cc786f5fc184f17372ab518a656718004",null);var j=a.i(45670);a.s([],6358),a.i(6358),a.s(["405af5688f945bb0a89788c27ee6114c8f0ed43edc",()=>j.getDisputeDetails,"70e15dac2d1adfcb702e8b19ca95f1039b1e4bcd98",()=>j.resolveDispute,"7840a7728cc786f5fc184f17372ab518a656718004",()=>i,"7841c69db8bef786b58604ff243e4ba6159ab90a90",()=>j.getDisputes],47575)}];

//# sourceMappingURL=_a4e7fb40._.js.map