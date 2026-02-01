import { Button, EmptyState } from "@worklog/ui";
import { FolderOpen } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">프로젝트</h1>
        <Button>새 프로젝트</Button>
      </div>
      <EmptyState
        icon={<FolderOpen className="h-12 w-12" />}
        title="프로젝트가 없습니다"
        description="새 프로젝트를 생성하여 업무 일지를 관리해보세요."
        action={<Button>첫 프로젝트 만들기</Button>}
      />
    </div>
  );
}
