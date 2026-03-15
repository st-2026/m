"use client";

import { useGetReferralStatsQuery } from "@/lib/api";
import { Users, Award, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReferralStats() {
  const { data: stats, isLoading, isError } = useGetReferralStatsQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <Card className="bg-white/5 border-white/10 backdrop-blur-md rounded-2xl overflow-hidden hover:bg-white/10 transition-colors">
        <CardContent className="p-4 flex flex-col items-center justify-center space-y-2">
          <div className="p-2 bg-blue-500/20 rounded-full text-blue-400">
            <Users size={20} />
          </div>
          <div className="text-center">
            <p className="text-xs text-white/50 uppercase tracking-wider font-semibold">
              Invitees
            </p>
            <p className="text-2xl font-bold text-white tracking-tight">
              {stats.totalInvited}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10 backdrop-blur-md rounded-2xl overflow-hidden hover:bg-white/10 transition-colors">
        <CardContent className="p-4 flex flex-col items-center justify-center space-y-2">
          <div className="p-2 bg-amber-500/20 rounded-full text-amber-400">
            <Award size={20} />
          </div>
          <div className="text-center">
            <p className="text-xs text-white/50 uppercase tracking-wider font-semibold">
              Earned
            </p>
            <p className="text-2xl font-bold text-amber-400 tracking-tight">
              {stats.totalRewards}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
