import{j as e}from"./jsx-runtime-CDt2p4po.js";import{C as n,a as t,b as d,c as o,d as f,e as N,f as c}from"./select-ByATKeyD.js";import"./index-GiUgBvb1.js";import"./index-C8NrMXaH.js";const T={title:"Atoms/Card",component:n,parameters:{layout:"centered"},tags:["autodocs"]},r={render:()=>e.jsxs(n,{className:"w-80",children:[e.jsxs(t,{children:[e.jsx(d,{children:"카드 제목"}),e.jsx(f,{children:"카드 설명입니다."})]}),e.jsx(o,{children:e.jsx("p",{children:"카드 내용이 여기에 들어갑니다."})})]})},a={render:()=>e.jsxs(n,{className:"w-80",children:[e.jsxs(t,{children:[e.jsx(d,{children:"프로젝트 생성"}),e.jsx(f,{children:"새 프로젝트를 생성합니다."})]}),e.jsx(o,{children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"프로젝트를 생성하면 업무일지를 관리할 수 있습니다."})}),e.jsxs(N,{className:"flex justify-end gap-2",children:[e.jsx(c,{variant:"outline",children:"취소"}),e.jsx(c,{children:"생성"})]})]})},s={render:()=>e.jsxs(n,{className:"w-80 cursor-pointer transition-shadow hover:shadow-md",children:[e.jsx(t,{children:e.jsx(d,{children:"클릭 가능한 카드"})}),e.jsx(o,{children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"호버하면 그림자가 생깁니다."})})]})};var i,l,C;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: () => <Card className='w-80'>
      <CardHeader>
        <CardTitle>카드 제목</CardTitle>
        <CardDescription>카드 설명입니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>카드 내용이 여기에 들어갑니다.</p>
      </CardContent>
    </Card>
}`,...(C=(l=r.parameters)==null?void 0:l.docs)==null?void 0:C.source}}};var m,p,u;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => <Card className='w-80'>
      <CardHeader>
        <CardTitle>프로젝트 생성</CardTitle>
        <CardDescription>새 프로젝트를 생성합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className='text-sm text-muted-foreground'>
          프로젝트를 생성하면 업무일지를 관리할 수 있습니다.
        </p>
      </CardContent>
      <CardFooter className='flex justify-end gap-2'>
        <Button variant='outline'>취소</Button>
        <Button>생성</Button>
      </CardFooter>
    </Card>
}`,...(u=(p=a.parameters)==null?void 0:p.docs)==null?void 0:u.source}}};var x,h,j;s.parameters={...s.parameters,docs:{...(x=s.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => <Card className='w-80 cursor-pointer transition-shadow hover:shadow-md'>
      <CardHeader>
        <CardTitle>클릭 가능한 카드</CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-sm text-muted-foreground'>
          호버하면 그림자가 생깁니다.
        </p>
      </CardContent>
    </Card>
}`,...(j=(h=s.parameters)==null?void 0:h.docs)==null?void 0:j.source}}};const B=["Default","WithFooter","Clickable"];export{s as Clickable,r as Default,a as WithFooter,B as __namedExportsOrder,T as default};
