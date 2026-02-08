import type { Meta, StoryObj } from '@storybook/react';
import {
  ResponsiveModal,
  Button,
  Input,
  Label,
  Textarea,
} from '@worklog-plus/ui';
import { useState } from 'react';

const meta: Meta = {
  title: 'Molecules/ResponsiveModal',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const ModalExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>모달 열기</Button>
      <ResponsiveModal open={open} onOpenChange={setOpen}>
        <ResponsiveModal.Content>
          <ResponsiveModal.Header>
            <ResponsiveModal.Title>모달 제목</ResponsiveModal.Title>
          </ResponsiveModal.Header>
          <div className='py-4'>
            <p className='text-sm text-muted-foreground'>
              반응형 모달입니다. 데스크톱에서는 모달로, 모바일에서는 바텀시트로
              표시됩니다.
            </p>
          </div>
          <ResponsiveModal.Footer>
            <Button variant='outline' onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button onClick={() => setOpen(false)}>확인</Button>
          </ResponsiveModal.Footer>
        </ResponsiveModal.Content>
      </ResponsiveModal>
    </>
  );
};

export const Default: Story = {
  render: () => <ModalExample />,
};

const FormModalExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>업무일지 작성</Button>
      <ResponsiveModal open={open} onOpenChange={setOpen}>
        <ResponsiveModal.Content className='sm:max-w-[500px]'>
          <ResponsiveModal.Header>
            <ResponsiveModal.Title>업무일지 작성</ResponsiveModal.Title>
          </ResponsiveModal.Header>
          <form className='space-y-4'>
            <div className='space-y-2'>
              <Label>제목</Label>
              <Input placeholder='업무 제목을 입력하세요' />
            </div>
            <div className='space-y-2'>
              <Label>내용</Label>
              <Textarea placeholder='업무 내용을 상세히 기록하세요' rows={5} />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label>날짜</Label>
                <Input type='date' />
              </div>
              <div className='space-y-2'>
                <Label>작업 시간 (시간)</Label>
                <Input type='number' placeholder='예: 2.5' />
              </div>
            </div>
            <ResponsiveModal.Footer>
              <Button variant='outline' onClick={() => setOpen(false)}>
                취소
              </Button>
              <Button type='submit'>작성</Button>
            </ResponsiveModal.Footer>
          </form>
        </ResponsiveModal.Content>
      </ResponsiveModal>
    </>
  );
};

export const FormModal: Story = {
  render: () => <FormModalExample />,
};
