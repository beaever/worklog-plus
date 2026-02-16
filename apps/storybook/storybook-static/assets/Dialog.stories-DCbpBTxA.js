import{j as e}from"./jsx-runtime-CDt2p4po.js";import{D as t,k as i,f as a,l,m as o,n as d,o as c,p as g}from"./select-ByATKeyD.js";import"./index-GiUgBvb1.js";import{c as f}from"./createLucideIcon-CbHznvEr.js";import"./index-C8NrMXaH.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=f("AlertTriangle",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z",key:"c3ski4"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]),F={title:"Molecules/Dialog",parameters:{layout:"centered"},tags:["autodocs"]},n={render:()=>e.jsxs(t,{children:[e.jsx(i,{asChild:!0,children:e.jsx(a,{children:"다이얼로그 열기"})}),e.jsxs(l,{children:[e.jsxs(o,{children:[e.jsx(d,{children:"다이얼로그 제목"}),e.jsx(c,{children:"다이얼로그 설명이 여기에 들어갑니다."})]}),e.jsx("div",{className:"py-4",children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"다이얼로그 내용입니다."})}),e.jsxs(g,{children:[e.jsx(a,{variant:"outline",children:"취소"}),e.jsx(a,{children:"확인"})]})]})]})},r={render:()=>e.jsxs(t,{children:[e.jsx(i,{asChild:!0,children:e.jsx(a,{variant:"destructive",children:"삭제"})}),e.jsxs(l,{children:[e.jsxs(o,{children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"rounded-full bg-destructive/10 p-2",children:e.jsx(b,{className:"h-5 w-5 text-destructive"})}),e.jsx(d,{children:"프로젝트 삭제"})]}),e.jsx(c,{children:"이 작업은 되돌릴 수 없습니다."})]}),e.jsx("div",{className:"py-4",children:e.jsxs("p",{className:"text-sm text-muted-foreground",children:[e.jsx("strong",{className:"text-foreground",children:"WorkLog+ 백엔드"})," ","프로젝트를 삭제하시겠습니까?"]})}),e.jsxs(g,{children:[e.jsx(a,{variant:"outline",children:"취소"}),e.jsx(a,{variant:"destructive",children:"삭제"})]})]})]})},s={render:()=>e.jsxs(t,{children:[e.jsx(i,{asChild:!0,children:e.jsx(a,{children:"새 프로젝트"})}),e.jsxs(l,{className:"sm:max-w-[425px]",children:[e.jsxs(o,{children:[e.jsx(d,{children:"새 프로젝트 생성"}),e.jsx(c,{children:"프로젝트 정보를 입력하세요."})]}),e.jsxs("div",{className:"grid gap-4 py-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-sm font-medium",children:"프로젝트 이름"}),e.jsx("input",{className:"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",placeholder:"프로젝트 이름"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-sm font-medium",children:"설명"}),e.jsx("textarea",{className:"flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",placeholder:"프로젝트 설명"})]})]}),e.jsxs(g,{children:[e.jsx(a,{variant:"outline",children:"취소"}),e.jsx(a,{children:"생성"})]})]})]})};var m,u,x;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => <Dialog>
      <DialogTrigger asChild>
        <Button>다이얼로그 열기</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>다이얼로그 제목</DialogTitle>
          <DialogDescription>
            다이얼로그 설명이 여기에 들어갑니다.
          </DialogDescription>
        </DialogHeader>
        <div className='py-4'>
          <p className='text-sm text-muted-foreground'>
            다이얼로그 내용입니다.
          </p>
        </div>
        <DialogFooter>
          <Button variant='outline'>취소</Button>
          <Button>확인</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
}`,...(x=(u=n.parameters)==null?void 0:u.docs)==null?void 0:x.source}}};var p,D,h;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => <Dialog>
      <DialogTrigger asChild>
        <Button variant='destructive'>삭제</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className='flex items-center gap-2'>
            <div className='rounded-full bg-destructive/10 p-2'>
              <AlertTriangle className='h-5 w-5 text-destructive' />
            </div>
            <DialogTitle>프로젝트 삭제</DialogTitle>
          </div>
          <DialogDescription>이 작업은 되돌릴 수 없습니다.</DialogDescription>
        </DialogHeader>
        <div className='py-4'>
          <p className='text-sm text-muted-foreground'>
            <strong className='text-foreground'>WorkLog+ 백엔드</strong>{' '}
            프로젝트를 삭제하시겠습니까?
          </p>
        </div>
        <DialogFooter>
          <Button variant='outline'>취소</Button>
          <Button variant='destructive'>삭제</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
}`,...(h=(D=r.parameters)==null?void 0:D.docs)==null?void 0:h.source}}};var j,v,N;s.parameters={...s.parameters,docs:{...(j=s.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => <Dialog>
      <DialogTrigger asChild>
        <Button>새 프로젝트</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>새 프로젝트 생성</DialogTitle>
          <DialogDescription>프로젝트 정보를 입력하세요.</DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>프로젝트 이름</label>
            <input className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm' placeholder='프로젝트 이름' />
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>설명</label>
            <textarea className='flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm' placeholder='프로젝트 설명' />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline'>취소</Button>
          <Button>생성</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
}`,...(N=(v=s.parameters)==null?void 0:v.docs)==null?void 0:N.source}}};const w=["Default","DeleteConfirm","FormDialog"];export{n as Default,r as DeleteConfirm,s as FormDialog,w as __namedExportsOrder,F as default};
