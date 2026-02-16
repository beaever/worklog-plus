import{j as e}from"./jsx-runtime-CDt2p4po.js";import{B as o}from"./select-ByATKeyD.js";import"./index-GiUgBvb1.js";import"./index-C8NrMXaH.js";const N={title:"Atoms/Badge",component:o,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{variant:{control:"select",options:["default","secondary","destructive","outline"]}}},r={args:{children:"기본",variant:"default"}},a={args:{children:"보조",variant:"secondary"}},s={args:{children:"위험",variant:"destructive"}},t={args:{children:"아웃라인",variant:"outline"}},n={render:()=>e.jsxs("div",{className:"flex gap-2",children:[e.jsx(o,{variant:"secondary",children:"예정"}),e.jsx(o,{variant:"default",children:"진행중"}),e.jsx(o,{variant:"outline",children:"완료"})]})};var c,d,i;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    children: '기본',
    variant: 'default'
  }
}`,...(i=(d=r.parameters)==null?void 0:d.docs)==null?void 0:i.source}}};var l,u,m;a.parameters={...a.parameters,docs:{...(l=a.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    children: '보조',
    variant: 'secondary'
  }
}`,...(m=(u=a.parameters)==null?void 0:u.docs)==null?void 0:m.source}}};var p,g,v;s.parameters={...s.parameters,docs:{...(p=s.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    children: '위험',
    variant: 'destructive'
  }
}`,...(v=(g=s.parameters)==null?void 0:g.docs)==null?void 0:v.source}}};var f,h,x;t.parameters={...t.parameters,docs:{...(f=t.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    children: '아웃라인',
    variant: 'outline'
  }
}`,...(x=(h=t.parameters)==null?void 0:h.docs)==null?void 0:x.source}}};var y,B,S;n.parameters={...n.parameters,docs:{...(y=n.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => <div className='flex gap-2'>
      <Badge variant='secondary'>예정</Badge>
      <Badge variant='default'>진행중</Badge>
      <Badge variant='outline'>완료</Badge>
    </div>
}`,...(S=(B=n.parameters)==null?void 0:B.docs)==null?void 0:S.source}}};const P=["Default","Secondary","Destructive","Outline","ProjectStatus"];export{r as Default,s as Destructive,t as Outline,n as ProjectStatus,a as Secondary,P as __namedExportsOrder,N as default};
