import{j as e}from"./jsx-runtime-CDt2p4po.js";import{S as a,g as s,h as o,i as d,j as l,L as b}from"./select-ByATKeyD.js";import"./index-GiUgBvb1.js";import"./index-C8NrMXaH.js";const f={title:"Molecules/Select",parameters:{layout:"centered"},tags:["autodocs"]},t={render:()=>e.jsxs(a,{children:[e.jsx(s,{className:"w-[200px]",children:e.jsx(o,{placeholder:"선택하세요"})}),e.jsxs(d,{children:[e.jsx(l,{value:"option1",children:"옵션 1"}),e.jsx(l,{value:"option2",children:"옵션 2"}),e.jsx(l,{value:"option3",children:"옵션 3"})]})]})},c={render:()=>e.jsxs("div",{className:"space-y-2 w-[200px]",children:[e.jsx(b,{children:"프로젝트 상태"}),e.jsxs(a,{defaultValue:"active",children:[e.jsx(s,{children:e.jsx(o,{})}),e.jsxs(d,{children:[e.jsx(l,{value:"planned",children:"예정"}),e.jsx(l,{value:"active",children:"진행중"}),e.jsx(l,{value:"done",children:"완료"})]})]})]})},r={render:()=>e.jsxs("div",{className:"space-y-2 w-[280px]",children:[e.jsx(b,{children:"프로젝트"}),e.jsxs(a,{children:[e.jsx(s,{children:e.jsx(o,{placeholder:"프로젝트 선택"})}),e.jsxs(d,{children:[e.jsx(l,{value:"1",children:"WorkLog+ 백엔드"}),e.jsx(l,{value:"2",children:"WorkLog+ 프론트엔드"}),e.jsx(l,{value:"3",children:"모바일 앱 개발"}),e.jsx(l,{value:"4",children:"API 문서화"})]})]})]})},n={render:()=>e.jsxs(a,{disabled:!0,children:[e.jsx(s,{className:"w-[200px]",children:e.jsx(o,{placeholder:"비활성화됨"})}),e.jsx(d,{children:e.jsx(l,{value:"option1",children:"옵션 1"})})]})};var i,S,m;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: () => <Select>
      <SelectTrigger className='w-[200px]'>
        <SelectValue placeholder='선택하세요' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='option1'>옵션 1</SelectItem>
        <SelectItem value='option2'>옵션 2</SelectItem>
        <SelectItem value='option3'>옵션 3</SelectItem>
      </SelectContent>
    </Select>
}`,...(m=(S=t.parameters)==null?void 0:S.docs)==null?void 0:m.source}}};var p,u,x;c.parameters={...c.parameters,docs:{...(p=c.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => <div className='space-y-2 w-[200px]'>
      <Label>프로젝트 상태</Label>
      <Select defaultValue='active'>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='planned'>예정</SelectItem>
          <SelectItem value='active'>진행중</SelectItem>
          <SelectItem value='done'>완료</SelectItem>
        </SelectContent>
      </Select>
    </div>
}`,...(x=(u=c.parameters)==null?void 0:u.docs)==null?void 0:x.source}}};var h,j,v;r.parameters={...r.parameters,docs:{...(h=r.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => <div className='space-y-2 w-[280px]'>
      <Label>프로젝트</Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder='프로젝트 선택' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='1'>WorkLog+ 백엔드</SelectItem>
          <SelectItem value='2'>WorkLog+ 프론트엔드</SelectItem>
          <SelectItem value='3'>모바일 앱 개발</SelectItem>
          <SelectItem value='4'>API 문서화</SelectItem>
        </SelectContent>
      </Select>
    </div>
}`,...(v=(j=r.parameters)==null?void 0:j.docs)==null?void 0:v.source}}};var g,I,L;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <Select disabled>
      <SelectTrigger className='w-[200px]'>
        <SelectValue placeholder='비활성화됨' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='option1'>옵션 1</SelectItem>
      </SelectContent>
    </Select>
}`,...(L=(I=n.parameters)==null?void 0:I.docs)==null?void 0:L.source}}};const V=["Default","WithLabel","ProjectSelect","Disabled"];export{t as Default,n as Disabled,r as ProjectSelect,c as WithLabel,V as __namedExportsOrder,f as default};
