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
      `).eq("id",a).single();if(d||!c)throw Error("Dispute not found");return{id:c.id,task_id:c.task?.id||c.task_id,task_title:c.task?.title||"Unknown Task",complainant:{id:c.complainant?.id,full_name:c.complainant?.full_name||"Unknown",avatar_url:c.complainant?.avatar_url||"",email:c.complainant?.email||"",role:c.complainant?.active_role||"user"},defendant:{id:c.defendant?.id,full_name:c.defendant?.full_name||"Unknown",avatar_url:c.defendant?.avatar_url||"",email:c.defendant?.email||"",role:c.defendant?.active_role||"user"},reason:c.reason||"No reason provided",status:c.status||"open",amount:c.task?.budget_cents?c.task.budget_cents/100:c.task?.budget||0,created_at:c.created_at,resolution:c.resolution,resolved_at:c.resolved_at,task_details:{description:c.task?.description||"",budget:c.task?.budget_cents?c.task.budget_cents/100:c.task?.budget||0,deadline:c.task?.deadline,status:c.task?.status||"unknown"}}}catch(a){return console.error("getDisputeDetails error:",a),null}}async function g(a,b,e){let f=(0,c.createAdminClient)();try{let{error:c}=await f.from("disputes").update({resolution:b,status:e,resolved_at:new Date().toISOString()}).eq("id",a);if(c)throw c;return await f.from("admin_logs").insert({action:"RESOLVE_DISPUTE",target_resource:"dispute",target_id:a,metadata:{resolution:b,status:e}}),(0,d.revalidatePath)("/dashboard/disputes"),(0,d.revalidatePath)(`/dashboard/disputes/${a}`),{success:!0}}catch(a){return console.error("resolveDispute error:",a),{success:!1,error:"Failed to resolve dispute"}}}(0,a.i(13095).ensureServerEntryExports)([e,f,g]),(0,b.registerServerReference)(e,"7841c69db8bef786b58604ff243e4ba6159ab90a90",null),(0,b.registerServerReference)(f,"405af5688f945bb0a89788c27ee6114c8f0ed43edc",null),(0,b.registerServerReference)(g,"70e15dac2d1adfcb702e8b19ca95f1039b1e4bcd98",null),a.s(["getDisputeDetails",()=>f,"getDisputes",()=>e,"resolveDispute",()=>g])},65653,a=>{"use strict";var b=a.i(45670);a.s([],93346),a.i(93346),a.s(["405af5688f945bb0a89788c27ee6114c8f0ed43edc",()=>b.getDisputeDetails,"70e15dac2d1adfcb702e8b19ca95f1039b1e4bcd98",()=>b.resolveDispute,"7841c69db8bef786b58604ff243e4ba6159ab90a90",()=>b.getDisputes],65653)}];

//# sourceMappingURL=_171f60d3._.js.map