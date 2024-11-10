"use strict";(()=>{var e={};e.id=298,e.ids=[298],e.modules={1649:e=>{e.exports=require("next-auth/react")},145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6249:(e,r)=>{Object.defineProperty(r,"l",{enumerable:!0,get:function(){return function e(r,t){return t in r?r[t]:"then"in r&&"function"==typeof r.then?r.then(r=>e(r,t)):"function"==typeof r&&"default"===t?r:void 0}}})},9808:(e,r,t)=>{t.r(r),t.d(r,{config:()=>p,default:()=>d,routeModule:()=>l});var n={};t.r(n),t.d(n,{default:()=>c});var o=t(6794),u=t(6114),a=t(6249),s=t(1649),i=t(7557);async function c(e,r){let t=await (0,s.getSession)({req:e});if(!t)return r.status(401).json({message:"Unauthorized"});try{let{rows:e}=await (0,i.Z)("SELECT * FROM products WHERE user_id = $1",[t.user.id]);r.status(200).json(e)}catch(e){console.error("Error fetching products:",e),r.status(500).json({message:"Internal server error"})}}let d=(0,a.l)(n,"default"),p=(0,a.l)(n,"config"),l=new o.PagesAPIRouteModule({definition:{kind:u.x.PAGES_API,page:"/api/products/my-products",pathname:"/api/products/my-products",bundlePath:"",filename:""},userland:n})},7557:(e,r,t)=>{t.d(r,{Z:()=>o});let n=new(require("pg")).Pool({connectionString:process.env.DATABASE_URL}),o=async(e,r)=>{try{return await n.query(e,r)}catch(e){throw console.error("Database query error:",e),e}}},6114:(e,r)=>{var t;Object.defineProperty(r,"x",{enumerable:!0,get:function(){return t}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE",e.IMAGE="IMAGE"}(t||(t={}))},6794:(e,r,t)=>{e.exports=t(145)}};var r=require("../../../webpack-api-runtime.js");r.C(e);var t=r(r.s=9808);module.exports=t})();