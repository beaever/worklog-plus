import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@worklog-plus/ui';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <Card>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl'>로그인</CardTitle>
        <CardDescription>
          계정에 로그인하여 업무 일지를 관리하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
