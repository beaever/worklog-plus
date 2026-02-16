import{j as e}from"./jsx-runtime-CDt2p4po.js";import{P as p}from"./stat-card-7srVDpsO.js";import"./index-GiUgBvb1.js";import"./select-ByATKeyD.js";import"./index-C8NrMXaH.js";import"./createLucideIcon-CbHznvEr.js";const h={title:"Organisms/ProjectCard",component:p,parameters:{layout:"centered"},tags:["autodocs"]},r={id:"1",name:"WorkLog+ 백엔드",status:"ACTIVE",progress:65,worklogCount:24,updatedAt:new Date().toISOString()},o={args:{project:r}},t={args:{project:{...r,id:"2",name:"모바일 앱 개발",status:"PLANNED",progress:10,worklogCount:3}}},s={args:{project:{...r,id:"3",name:"API 문서화",status:"DONE",progress:100,worklogCount:12}}},n={args:{project:{...r,id:"4",name:"신규 프로젝트",status:"ACTIVE",progress:15,worklogCount:2}}},a={args:{project:{...r,id:"5",name:"거의 완료된 프로젝트",status:"ACTIVE",progress:95,worklogCount:45}}},c={render:()=>e.jsxs("div",{className:"grid gap-4 w-[900px]",style:{gridTemplateColumns:"repeat(3, 1fr)"},children:[e.jsx(p,{project:{id:"1",name:"예정된 프로젝트",status:"PLANNED",progress:0,worklogCount:0,updatedAt:new Date().toISOString()}}),e.jsx(p,{project:{id:"2",name:"진행중인 프로젝트",status:"ACTIVE",progress:65,worklogCount:24,updatedAt:new Date().toISOString()}}),e.jsx(p,{project:{id:"3",name:"완료된 프로젝트",status:"DONE",progress:100,worklogCount:48,updatedAt:new Date().toISOString()}})]})};var d,g,m;o.parameters={...o.parameters,docs:{...(d=o.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    project: mockProject
  }
}`,...(m=(g=o.parameters)==null?void 0:g.docs)==null?void 0:m.source}}};var u,i,l;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    project: {
      ...mockProject,
      id: '2',
      name: '모바일 앱 개발',
      status: 'PLANNED',
      progress: 10,
      worklogCount: 3
    }
  }
}`,...(l=(i=t.parameters)==null?void 0:i.docs)==null?void 0:l.source}}};var j,C,w;s.parameters={...s.parameters,docs:{...(j=s.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    project: {
      ...mockProject,
      id: '3',
      name: 'API 문서화',
      status: 'DONE',
      progress: 100,
      worklogCount: 12
    }
  }
}`,...(w=(C=s.parameters)==null?void 0:C.docs)==null?void 0:w.source}}};var A,P,k;n.parameters={...n.parameters,docs:{...(A=n.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    project: {
      ...mockProject,
      id: '4',
      name: '신규 프로젝트',
      status: 'ACTIVE',
      progress: 15,
      worklogCount: 2
    }
  }
}`,...(k=(P=n.parameters)==null?void 0:P.docs)==null?void 0:k.source}}};var S,D,E;a.parameters={...a.parameters,docs:{...(S=a.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    project: {
      ...mockProject,
      id: '5',
      name: '거의 완료된 프로젝트',
      status: 'ACTIVE',
      progress: 95,
      worklogCount: 45
    }
  }
}`,...(E=(D=a.parameters)==null?void 0:D.docs)==null?void 0:E.source}}};var I,N,O;c.parameters={...c.parameters,docs:{...(I=c.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: () => <div className='grid gap-4 w-[900px]' style={{
    gridTemplateColumns: 'repeat(3, 1fr)'
  }}>
      <ProjectCard project={{
      id: '1',
      name: '예정된 프로젝트',
      status: 'PLANNED',
      progress: 0,
      worklogCount: 0,
      updatedAt: new Date().toISOString()
    }} />
      <ProjectCard project={{
      id: '2',
      name: '진행중인 프로젝트',
      status: 'ACTIVE',
      progress: 65,
      worklogCount: 24,
      updatedAt: new Date().toISOString()
    }} />
      <ProjectCard project={{
      id: '3',
      name: '완료된 프로젝트',
      status: 'DONE',
      progress: 100,
      worklogCount: 48,
      updatedAt: new Date().toISOString()
    }} />
    </div>
}`,...(O=(N=c.parameters)==null?void 0:N.docs)==null?void 0:O.source}}};const y=["Active","Planned","Done","LowProgress","HighProgress","AllStatuses"];export{o as Active,c as AllStatuses,s as Done,a as HighProgress,n as LowProgress,t as Planned,y as __namedExportsOrder,h as default};
