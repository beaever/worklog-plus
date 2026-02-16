import{j as e}from"./jsx-runtime-CDt2p4po.js";import{F as M,C as O,S as t}from"./stat-card-7srVDpsO.js";import{c as b}from"./createLucideIcon-CbHznvEr.js";import"./index-GiUgBvb1.js";import"./select-ByATKeyD.js";import"./index-C8NrMXaH.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=b("CheckCircle",[["path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14",key:"g774vq"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c=b("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]),w={title:"Organisms/StatCard",component:t,parameters:{layout:"centered"},tags:["autodocs"]},r={args:{title:"총 프로젝트",value:12,description:"활성 프로젝트 8개",icon:M}},a={args:{title:"이번 주 업무일지",value:24,description:"전주 대비",icon:c,trend:{value:12,isPositive:!0}}},i={args:{title:"이번 주 업무일지",value:18,description:"전주 대비",icon:c,trend:{value:8,isPositive:!1}}},s={args:{title:"총 작업 시간",value:"156h",description:"이번 달 누적",icon:O,trend:{value:8,isPositive:!0}}},n={args:{title:"완료된 프로젝트",value:4,description:"이번 분기",icon:D}},o={render:()=>e.jsxs("div",{className:"grid gap-4 w-[900px]",style:{gridTemplateColumns:"repeat(4, 1fr)"},children:[e.jsx(t,{title:"총 프로젝트",value:12,description:"활성 프로젝트 8개",icon:M}),e.jsx(t,{title:"이번 주 업무일지",value:24,description:"전주 대비",icon:c,trend:{value:12,isPositive:!0}}),e.jsx(t,{title:"총 작업 시간",value:"156h",description:"이번 달 누적",icon:O,trend:{value:8,isPositive:!0}}),e.jsx(t,{title:"완료된 프로젝트",value:4,description:"이번 분기",icon:D})]})};var l,d,p;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    title: '총 프로젝트',
    value: 12,
    description: '활성 프로젝트 8개',
    icon: FolderOpen
  }
}`,...(p=(d=r.parameters)==null?void 0:d.docs)==null?void 0:p.source}}};var u,m,v;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    title: '이번 주 업무일지',
    value: 24,
    description: '전주 대비',
    icon: FileText,
    trend: {
      value: 12,
      isPositive: true
    }
  }
}`,...(v=(m=a.parameters)==null?void 0:m.docs)==null?void 0:v.source}}};var g,h,C;i.parameters={...i.parameters,docs:{...(g=i.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    title: '이번 주 업무일지',
    value: 18,
    description: '전주 대비',
    icon: FileText,
    trend: {
      value: 8,
      isPositive: false
    }
  }
}`,...(C=(h=i.parameters)==null?void 0:h.docs)==null?void 0:C.source}}};var x,S,k;s.parameters={...s.parameters,docs:{...(x=s.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    title: '총 작업 시간',
    value: '156h',
    description: '이번 달 누적',
    icon: Clock,
    trend: {
      value: 8,
      isPositive: true
    }
  }
}`,...(k=(S=s.parameters)==null?void 0:S.docs)==null?void 0:k.source}}};var P,T,f;n.parameters={...n.parameters,docs:{...(P=n.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    title: '완료된 프로젝트',
    value: 4,
    description: '이번 분기',
    icon: CheckCircle
  }
}`,...(f=(T=n.parameters)==null?void 0:T.docs)==null?void 0:f.source}}};var y,j,F;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => <div className='grid gap-4 w-[900px]' style={{
    gridTemplateColumns: 'repeat(4, 1fr)'
  }}>
      <StatCard title='총 프로젝트' value={12} description='활성 프로젝트 8개' icon={FolderOpen} />
      <StatCard title='이번 주 업무일지' value={24} description='전주 대비' icon={FileText} trend={{
      value: 12,
      isPositive: true
    }} />
      <StatCard title='총 작업 시간' value='156h' description='이번 달 누적' icon={Clock} trend={{
      value: 8,
      isPositive: true
    }} />
      <StatCard title='완료된 프로젝트' value={4} description='이번 분기' icon={CheckCircle} />
    </div>
}`,...(F=(j=o.parameters)==null?void 0:j.docs)==null?void 0:F.source}}};const E=["Default","WithPositiveTrend","WithNegativeTrend","TimeValue","CompletedProjects","DashboardStats"];export{n as CompletedProjects,o as DashboardStats,r as Default,s as TimeValue,i as WithNegativeTrend,a as WithPositiveTrend,E as __namedExportsOrder,w as default};
