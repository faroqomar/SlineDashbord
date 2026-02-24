module.exports=[20539,a=>{"use strict";a.i(55781);var b=a.i(45618);function c(){return(0,b.createClient)("https://isddrknbjsgaantjojhm.supabase.co",process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{autoRefreshToken:!1,persistSession:!1}})}a.s(["createAdminClient",()=>c])},63681,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d={RequestCookies:function(){return f.RequestCookies},ResponseCookies:function(){return f.ResponseCookies},stringifyCookie:function(){return f.stringifyCookie}};for(var e in d)Object.defineProperty(c,e,{enumerable:!0,get:d[e]});let f=a.r(36226)},28340,(a,b,c)=>{"use strict";function d(){let a,b,c=new Promise((c,d)=>{a=c,b=d});return{resolve:a,reject:b,promise:c}}Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"createPromiseWithResolvers",{enumerable:!0,get:function(){return d}})},31382,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d,e={RenderStage:function(){return i},StagedRenderingController:function(){return j}};for(var f in e)Object.defineProperty(c,f,{enumerable:!0,get:e[f]});let g=a.r(50640),h=a.r(28340);var i=((d={})[d.Before=1]="Before",d[d.Static=2]="Static",d[d.Runtime=3]="Runtime",d[d.Dynamic=4]="Dynamic",d[d.Abandoned=5]="Abandoned",d);class j{constructor(a=null,b){this.abortSignal=a,this.hasRuntimePrefetch=b,this.currentStage=1,this.staticInterruptReason=null,this.runtimeInterruptReason=null,this.staticStageEndTime=1/0,this.runtimeStageEndTime=1/0,this.runtimeStageListeners=[],this.dynamicStageListeners=[],this.runtimeStagePromise=(0,h.createPromiseWithResolvers)(),this.dynamicStagePromise=(0,h.createPromiseWithResolvers)(),this.mayAbandon=!1,a&&(a.addEventListener("abort",()=>{let{reason:b}=a;this.currentStage<3&&(this.runtimeStagePromise.promise.catch(k),this.runtimeStagePromise.reject(b)),(this.currentStage<4||5===this.currentStage)&&(this.dynamicStagePromise.promise.catch(k),this.dynamicStagePromise.reject(b))},{once:!0}),this.mayAbandon=!0)}onStage(a,b){if(this.currentStage>=a)b();else if(3===a)this.runtimeStageListeners.push(b);else if(4===a)this.dynamicStageListeners.push(b);else throw Object.defineProperty(new g.InvariantError(`Invalid render stage: ${a}`),"__NEXT_ERROR_CODE",{value:"E881",enumerable:!1,configurable:!0})}canSyncInterrupt(){if(1===this.currentStage)return!1;let a=this.hasRuntimePrefetch?4:3;return this.currentStage<a}syncInterruptCurrentStageWithReason(a){if(1!==this.currentStage){if(this.mayAbandon)return this.abandonRenderImpl();switch(this.currentStage){case 2:this.staticInterruptReason=a,this.advanceStage(4);return;case 3:this.hasRuntimePrefetch&&(this.runtimeInterruptReason=a,this.advanceStage(4));return}}}getStaticInterruptReason(){return this.staticInterruptReason}getRuntimeInterruptReason(){return this.runtimeInterruptReason}getStaticStageEndTime(){return this.staticStageEndTime}getRuntimeStageEndTime(){return this.runtimeStageEndTime}abandonRender(){if(!this.mayAbandon)throw Object.defineProperty(new g.InvariantError("`abandonRender` called on a stage controller that cannot be abandoned."),"__NEXT_ERROR_CODE",{value:"E938",enumerable:!1,configurable:!0});this.abandonRenderImpl()}abandonRenderImpl(){let{currentStage:a}=this;switch(a){case 2:this.currentStage=5,this.resolveRuntimeStage();return;case 3:this.currentStage=5;return}}advanceStage(a){if(a<=this.currentStage)return;let b=this.currentStage;if(this.currentStage=a,b<3&&a>=3&&(this.staticStageEndTime=performance.now()+performance.timeOrigin,this.resolveRuntimeStage()),b<4&&a>=4){this.runtimeStageEndTime=performance.now()+performance.timeOrigin,this.resolveDynamicStage();return}}resolveRuntimeStage(){let a=this.runtimeStageListeners;for(let b=0;b<a.length;b++)a[b]();a.length=0,this.runtimeStagePromise.resolve()}resolveDynamicStage(){let a=this.dynamicStageListeners;for(let b=0;b<a.length;b++)a[b]();a.length=0,this.dynamicStagePromise.resolve()}getStagePromise(a){switch(a){case 3:return this.runtimeStagePromise.promise;case 4:return this.dynamicStagePromise.promise;default:throw Object.defineProperty(new g.InvariantError(`Invalid render stage: ${a}`),"__NEXT_ERROR_CODE",{value:"E881",enumerable:!1,configurable:!0})}}waitForStage(a){return this.getStagePromise(a)}delayUntilStage(a,b,c){var d,e,f;let g,h=(d=this.getStagePromise(a),e=b,f=c,g=new Promise((a,b)=>{d.then(a.bind(null,f),b)}),void 0!==e&&(g.displayName=e),g);return this.abortSignal&&h.catch(k),h}}function k(){}},4712,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d={ActionDidNotRevalidate:function(){return f},ActionDidRevalidateDynamicOnly:function(){return h},ActionDidRevalidateStaticAndDynamic:function(){return g}};for(var e in d)Object.defineProperty(c,e,{enumerable:!0,get:d[e]});let f=0,g=1,h=2},45670,a=>{"use strict";var b=a.i(37936),c=a.i(20539),d=a.i(18558);async function e(a=1,b="all",d=10,f=""){let g=(0,c.createAdminClient)(),h=(a-1)*d;try{let a=g.from("disputes").select(`
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
      `).eq("id",a).single();if(d||!c)throw Error("Dispute not found");return{id:c.id,task_id:c.task?.id||c.task_id,task_title:c.task?.title||"Unknown Task",complainant:{id:c.complainant?.id,full_name:c.complainant?.full_name||"Unknown",avatar_url:c.complainant?.avatar_url||"",email:c.complainant?.email||"",role:c.complainant?.active_role||"user"},defendant:{id:c.defendant?.id,full_name:c.defendant?.full_name||"Unknown",avatar_url:c.defendant?.avatar_url||"",email:c.defendant?.email||"",role:c.defendant?.active_role||"user"},reason:c.reason||"No reason provided",status:c.status||"open",amount:c.task?.budget_cents?c.task.budget_cents/100:c.task?.budget||0,created_at:c.created_at,resolution:c.resolution,resolved_at:c.resolved_at,task_details:{description:c.task?.description||"",budget:c.task?.budget_cents?c.task.budget_cents/100:c.task?.budget||0,deadline:c.task?.deadline,status:c.task?.status||"unknown"}}}catch(a){return console.error("getDisputeDetails error:",a),null}}async function g(a,b,e){let f=(0,c.createAdminClient)();try{let{error:c}=await f.from("disputes").update({resolution:b,status:e,resolved_at:new Date().toISOString()}).eq("id",a);if(c)throw c;return await f.from("admin_logs").insert({action:"RESOLVE_DISPUTE",target_resource:"dispute",target_id:a,metadata:{resolution:b,status:e}}),(0,d.revalidatePath)("/dashboard/disputes"),(0,d.revalidatePath)(`/dashboard/disputes/${a}`),{success:!0}}catch(a){return console.error("resolveDispute error:",a),{success:!1,error:"Failed to resolve dispute"}}}(0,a.i(13095).ensureServerEntryExports)([e,f,g]),(0,b.registerServerReference)(e,"787f9d279052702c68a8817da77987ab0f16dc7763",null),(0,b.registerServerReference)(f,"4038d811abf5b954071404e68d20a4f7646a6959de",null),(0,b.registerServerReference)(g,"70ee33dfc3b658954bdc2aad5f8f25f6271a4f5805",null),a.s(["getDisputeDetails",()=>f,"getDisputes",()=>e,"resolveDispute",()=>g])},65653,a=>{"use strict";var b=a.i(45670);a.s([],93346),a.i(93346),a.s(["4038d811abf5b954071404e68d20a4f7646a6959de",()=>b.getDisputeDetails,"70ee33dfc3b658954bdc2aad5f8f25f6271a4f5805",()=>b.resolveDispute,"787f9d279052702c68a8817da77987ab0f16dc7763",()=>b.getDisputes],65653)}];

//# sourceMappingURL=_48573d8a._.js.map