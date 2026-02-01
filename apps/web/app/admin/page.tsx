import { Card, CardHeader, CardTitle, CardContent } from "@worklog/ui";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">관리자</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>사용자 관리</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              사용자 계정을 관리하고 권한을 설정합니다.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>시스템 설정</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              시스템 전반의 설정을 관리합니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
