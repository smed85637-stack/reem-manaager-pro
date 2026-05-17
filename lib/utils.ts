export type PaymentStatus="مدفوع"|"غير مدفوع"|"جزئي";
export function today(){return new Date().toISOString().slice(0,10)}
export function addDays(date:string,days:number){const d=new Date(date+"T00:00:00");d.setDate(d.getDate()+days);return d.toISOString().slice(0,10)}
export function daysUntil(date?:string|null){if(!date)return null;const t=new Date(date+"T00:00:00");const n=new Date();n.setHours(0,0,0,0);return Math.ceil((t.getTime()-n.getTime())/(1000*60*60*24))}
export function whatsappUrl(phone:string,msg:string){return `https://wa.me/${phone.replace(/\D/g,"")}?text=${encodeURIComponent(msg)}`}
export function csv(name:string,headers:string[],rows:any[][]){const body=[headers,...rows].map(r=>r.map(v=>`"${String(v??"").replace(/"/g,'""')}"`).join(",")).join("
");const blob=new Blob(["﻿"+body],{type:"text/csv;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url)}
