"use strict";(()=>{var e={};e.id=766,e.ids=[766],e.modules={1649:e=>{e.exports=require("next-auth/react")},145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6090:e=>{e.exports=import("stripe")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,r){return r in t?t[r]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,r)):"function"==typeof t&&"default"===r?t:void 0}}})},5346:(e,t,r)=>{r.a(e,async(e,n)=>{try{r.r(t),r.d(t,{config:()=>d,default:()=>c,routeModule:()=>l});var a=r(6794),s=r(6114),o=r(6249),i=r(2404),u=e([i]);i=(u.then?(await u)():u)[0];let c=(0,o.l)(i,"default"),d=(0,o.l)(i,"config"),l=new a.PagesAPIRouteModule({definition:{kind:s.x.PAGES_API,page:"/api/purchase",pathname:"/api/purchase",bundlePath:"",filename:""},userland:i});n()}catch(e){n(e)}})},7557:(e,t,r)=>{r.d(t,{Z:()=>a});let n=new(require("pg")).Pool({connectionString:process.env.DATABASE_URL}),a=async(e,t)=>{try{return await n.query(e,t)}catch(e){throw console.error("Database query error:",e),e}}},2404:(e,t,r)=>{r.a(e,async(e,n)=>{try{r.r(t),r.d(t,{default:()=>u});var a=r(1649),s=r(7557),o=r(6090),i=e([o]);let c=new(o=(i.then?(await i)():i)[0]).default(process.env.STRIPE_SECRET_KEY,{apiVersion:"2024-09-30.acacia"});async function u(e,t){if(!await (0,a.getSession)({req:e}))return t.status(401).json({message:"Unauthorized"});let{product_id:r}=e.body;try{let n=await (0,s.Z)("SELECT * FROM products WHERE id = $1",[r]);if(0===n.rows.length)return t.status(404).json({message:"Product not found"});let a=n.rows[0],o=await c.checkout.sessions.create({payment_method_types:["card"],line_items:[{price_data:{currency:"usd",product_data:{name:a.title},unit_amount:100*a.price},quantity:1}],mode:"payment",success_url:`${e.headers.origin}/success`,cancel_url:`${e.headers.origin}/cancel`});t.status(200).json({id:o.id})}catch(e){console.error("Error creating checkout session:",e),t.status(500).json({message:"Internal server error"})}}n()}catch(e){n(e)}})},6114:(e,t)=>{var r;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return r}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE",e.IMAGE="IMAGE"}(r||(r={}))},6794:(e,t,r)=>{e.exports=r(145)}};var t=require("../../webpack-api-runtime.js");t.C(e);var r=t(t.s=5346);module.exports=r})();