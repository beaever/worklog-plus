import{j as t}from"./jsx-runtime-CDt2p4po.js";import{W as d}from"./stat-card-7srVDpsO.js";import"./index-GiUgBvb1.js";import"./select-ByATKeyD.js";import"./index-C8NrMXaH.js";import"./createLucideIcon-CbHznvEr.js";const b={title:"Organisms/WorklogCard",component:d,parameters:{layout:"centered"},tags:["autodocs"]},e={id:"1",projectId:"1",userId:"user-1",title:"API 인증 모듈 구현",content:"JWT 기반 인증 시스템 구현 완료. 액세스 토큰과 리프레시 토큰 발급 로직 개발.",date:new Date().toISOString().slice(0,10),duration:4,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()},o={args:{worklog:e,projectName:"WorkLog+ 백엔드"}},r={args:{worklog:{...e,title:"오늘 작성한 업무일지",content:"오늘 진행한 작업 내용입니다.",date:new Date().toISOString().slice(0,10)},projectName:"WorkLog+ 프론트엔드"}},n={args:{worklog:{...e,title:"어제 작성한 업무일지",content:"어제 진행한 작업 내용입니다.",date:new Date(Date.now()-864e5).toISOString().slice(0,10)},projectName:"모바일 앱 개발"}},a={args:{worklog:{...e,title:"긴 내용의 업무일지",content:"JWT 기반 인증 시스템 구현 완료. 액세스 토큰과 리프레시 토큰 발급 로직 개발. 토큰 만료 처리 미들웨어 구현. 비밀번호 해싱 (bcrypt) 적용. Rate limiting 적용. CORS 설정 완료."},projectName:"WorkLog+ 백엔드"}},s={args:{worklog:{...e,title:"짧은 작업",content:"간단한 버그 수정",duration:.5},projectName:"WorkLog+ 백엔드"}},c={args:{worklog:{...e,title:"긴 작업",content:"대규모 리팩토링 작업",duration:8},projectName:"WorkLog+ 백엔드"}},i={render:()=>t.jsxs("div",{className:"space-y-4 w-[600px]",children:[t.jsx(d,{worklog:{id:"1",projectId:"1",userId:"user-1",title:"API 인증 모듈 구현",content:"JWT 기반 인증 시스템 구현 완료.",date:new Date().toISOString().slice(0,10),duration:4,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()},projectName:"WorkLog+ 백엔드"}),t.jsx(d,{worklog:{id:"2",projectId:"2",userId:"user-1",title:"프론트엔드 컴포넌트 개발",content:"Button, Card, Modal 등 공통 UI 컴포넌트 개발.",date:new Date(Date.now()-864e5).toISOString().slice(0,10),duration:5,createdAt:new Date(Date.now()-864e5).toISOString(),updatedAt:new Date(Date.now()-864e5).toISOString()},projectName:"WorkLog+ 프론트엔드"}),t.jsx(d,{worklog:{id:"3",projectId:"1",userId:"user-1",title:"데이터베이스 스키마 설계",content:"User, Project, Worklog 테이블 설계 및 관계 정의.",date:new Date(Date.now()-1728e5).toISOString().slice(0,10),duration:3,createdAt:new Date(Date.now()-1728e5).toISOString(),updatedAt:new Date(Date.now()-1728e5).toISOString()},projectName:"WorkLog+ 백엔드"})]})};var g,l,p;o.parameters={...o.parameters,docs:{...(g=o.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    worklog: mockWorklog,
    projectName: 'WorkLog+ 백엔드'
  }
}`,...(p=(l=o.parameters)==null?void 0:l.docs)==null?void 0:p.source}}};var m,u,S;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    worklog: {
      ...mockWorklog,
      title: '오늘 작성한 업무일지',
      content: '오늘 진행한 작업 내용입니다.',
      date: new Date().toISOString().slice(0, 10)
    },
    projectName: 'WorkLog+ 프론트엔드'
  }
}`,...(S=(u=r.parameters)==null?void 0:u.docs)==null?void 0:S.source}}};var w,k,D;n.parameters={...n.parameters,docs:{...(w=n.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    worklog: {
      ...mockWorklog,
      title: '어제 작성한 업무일지',
      content: '어제 진행한 작업 내용입니다.',
      date: new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    },
    projectName: '모바일 앱 개발'
  }
}`,...(D=(k=n.parameters)==null?void 0:k.docs)==null?void 0:D.source}}};var I,W,j;a.parameters={...a.parameters,docs:{...(I=a.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    worklog: {
      ...mockWorklog,
      title: '긴 내용의 업무일지',
      content: 'JWT 기반 인증 시스템 구현 완료. 액세스 토큰과 리프레시 토큰 발급 로직 개발. 토큰 만료 처리 미들웨어 구현. 비밀번호 해싱 (bcrypt) 적용. Rate limiting 적용. CORS 설정 완료.'
    },
    projectName: 'WorkLog+ 백엔드'
  }
}`,...(j=(W=a.parameters)==null?void 0:W.docs)==null?void 0:j.source}}};var O,L,N;s.parameters={...s.parameters,docs:{...(O=s.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    worklog: {
      ...mockWorklog,
      title: '짧은 작업',
      content: '간단한 버그 수정',
      duration: 0.5
    },
    projectName: 'WorkLog+ 백엔드'
  }
}`,...(N=(L=s.parameters)==null?void 0:L.docs)==null?void 0:N.source}}};var A,C,x;c.parameters={...c.parameters,docs:{...(A=c.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    worklog: {
      ...mockWorklog,
      title: '긴 작업',
      content: '대규모 리팩토링 작업',
      duration: 8
    },
    projectName: 'WorkLog+ 백엔드'
  }
}`,...(x=(C=c.parameters)==null?void 0:C.docs)==null?void 0:x.source}}};var y,T,f;i.parameters={...i.parameters,docs:{...(y=i.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => <div className='space-y-4 w-[600px]'>
      <WorklogCard worklog={{
      id: '1',
      projectId: '1',
      userId: 'user-1',
      title: 'API 인증 모듈 구현',
      content: 'JWT 기반 인증 시스템 구현 완료.',
      date: new Date().toISOString().slice(0, 10),
      duration: 4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }} projectName='WorkLog+ 백엔드' />
      <WorklogCard worklog={{
      id: '2',
      projectId: '2',
      userId: 'user-1',
      title: '프론트엔드 컴포넌트 개발',
      content: 'Button, Card, Modal 등 공통 UI 컴포넌트 개발.',
      date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
      duration: 5,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString()
    }} projectName='WorkLog+ 프론트엔드' />
      <WorklogCard worklog={{
      id: '3',
      projectId: '1',
      userId: 'user-1',
      title: '데이터베이스 스키마 설계',
      content: 'User, Project, Worklog 테이블 설계 및 관계 정의.',
      date: new Date(Date.now() - 172800000).toISOString().slice(0, 10),
      duration: 3,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 172800000).toISOString()
    }} projectName='WorkLog+ 백엔드' />
    </div>
}`,...(f=(T=i.parameters)==null?void 0:T.docs)==null?void 0:f.source}}};const B=["Default","Today","Yesterday","LongContent","ShortDuration","LongDuration","WorklogList"];export{o as Default,a as LongContent,c as LongDuration,s as ShortDuration,r as Today,i as WorklogList,n as Yesterday,B as __namedExportsOrder,b as default};
