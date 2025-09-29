import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import TopBar from '@/components/TopBar';

export default function ProjectSetupScreen({ onBack }: { onBack?: () => void }) {
  return (
  <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
     {/* Header */}
      <TopBar title="Project" onBack={onBack} />
  <Card className="w-full max-w-md mx-4 dark:bg-gray-800">
  <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">FULL UI SCAFFOLD GENERATION</h1>
          </div>

          <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
           COMING SOON!
          </p>
        </CardContent>
      </Card>
      {/* Safe area bottom padding */}
      <div className="pb-[env(safe-area-inset-bottom)]"></div>
    </div>
  );
}
