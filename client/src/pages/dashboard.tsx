import type { Prospect } from "@shared/schema";
import { STATUSES, INTEREST_LEVELS } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Flame, ThumbsUp, Minus } from "lucide-react";

const columnColors: Record<string, string> = {
  Bookmarked: "bg-blue-500",
  Applied: "bg-indigo-500",
  "Phone Screen": "bg-violet-500",
  Interviewing: "bg-amber-500",
  Offer: "bg-emerald-500",
  Rejected: "bg-red-500",
  Withdrawn: "bg-gray-500",
};

const interestIcons: Record<string, React.ReactNode> = {
  High: <Flame className="w-4 h-4 text-red-500" />,
  Medium: <ThumbsUp className="w-4 h-4 text-amber-500" />,
  Low: <Minus className="w-4 h-4 text-muted-foreground" />,
};

export function Dashboard({ prospects, isLoading }: { prospects: Prospect[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-28 rounded-lg" />
        <Skeleton className="h-44 rounded-lg" />
        <Skeleton className="h-36 rounded-lg" />
      </div>
    );
  }

  const total = prospects.length;

  const statusCounts: Record<string, number> = {};
  for (const s of STATUSES) {
    statusCounts[s] = 0;
  }
  for (const p of prospects) {
    if (p.status in statusCounts) {
      statusCounts[p.status]++;
    }
  }

  const interestCounts: Record<string, number> = {};
  for (const l of INTEREST_LEVELS) {
    interestCounts[l] = 0;
  }
  for (const p of prospects) {
    if (p.interestLevel in interestCounts) {
      interestCounts[p.interestLevel]++;
    }
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto overflow-y-auto h-full">
      <Card data-testid="dashboard-total">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Prospects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <span className="text-3xl font-bold" data-testid="dashboard-total-count">{total}</span>
          </div>
        </CardContent>
      </Card>

      <Card data-testid="dashboard-by-status">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">By Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {STATUSES.map((status) => (
              <div
                key={status}
                className="flex items-center gap-2 p-3 rounded-lg border bg-card"
                data-testid={`dashboard-status-${status.replace(/\s+/g, "-").toLowerCase()}`}
              >
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${columnColors[status]}`} />
                <span className="text-sm truncate">{status}</span>
                <Badge variant="secondary" className="ml-auto text-xs shrink-0">
                  {statusCounts[status]}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card data-testid="dashboard-by-interest">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">By Interest Level</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {INTEREST_LEVELS.map((level) => (
              <div
                key={level}
                className="flex items-center gap-3 p-4 rounded-lg border bg-card"
                data-testid={`dashboard-interest-${level.toLowerCase()}`}
              >
                {interestIcons[level]}
                <span className="text-sm font-medium">{level}</span>
                <span className="ml-auto text-2xl font-bold">{interestCounts[level]}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
