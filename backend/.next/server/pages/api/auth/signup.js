"use strict";(()=>{var e={};e.id=708,e.ids=[708],e.modules={5486:e=>{e.exports=require("bcrypt")},5600:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6762:(e,t)=>{Object.defineProperty(t,"M",{enumerable:!0,get:function(){return function e(t,r){return r in t?t[r]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,r)):"function"==typeof t&&"default"===r?t:void 0}}})},7966:(e,t,r)=>{r.r(t),r.d(t,{config:()=>m,default:()=>f,routeModule:()=>A});var a={};r.r(a),r.d(a,{default:()=>P});var n=r(9947),s=r(2706),i=r(6762),u=r(9567),o=r(5486),c=r.n(o);async function d(e){let t=await c().genSalt(12);return await c().hash(e,t)}let l=require("yup"),p=l.object().shape({username:l.string().required(),email:l.string().email().required(),password:l.string().min(8).matches(/[a-z]/,"Password must contain a lowercase letter").matches(/[0-9]/,"Password must contain a number")});async function P(e,t){if("POST"!==e.method)return t.status(405).end();let{username:r,email:a,password:n}=e.body;try{await p.validate({username:r,email:a,password:n});let e=await d(n);await (0,u.A)("INSERT INTO users (name, email, passwordHash) VALUES ($1, $2, $3)",[r,a,e]),t.status(201).json({message:"User registered successfully"})}catch(e){if(e instanceof l.ValidationError)return t.status(400).json({message:e.message});t.status(500).json({message:"Registration failed",error:e})}}let f=(0,i.M)(a,"default"),m=(0,i.M)(a,"config"),A=new n.PagesAPIRouteModule({definition:{kind:s.A.PAGES_API,page:"/api/auth/signup",pathname:"/api/auth/signup",bundlePath:"",filename:""},userland:a})},9567:(e,t,r)=>{r.d(t,{A:()=>n});let a=new(require("pg")).Pool({connectionString:process.env.DATABASE_URL}),n=async(e,t)=>{try{return await a.query(e,t)}catch(e){throw console.error("Database query error:",e),e}}},2706:(e,t)=>{var r;Object.defineProperty(t,"A",{enumerable:!0,get:function(){return r}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE",e.IMAGE="IMAGE"}(r||(r={}))},9947:(e,t,r)=>{e.exports=r(5600)}};var t=require("../../../webpack-api-runtime.js");t.C(e);var r=t(t.s=7966);module.exports=r})();