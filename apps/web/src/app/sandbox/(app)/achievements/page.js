"use client";

import { useGetMyAchievementsQuery } from "@/lib/redux/achievementsApi";
import { Card } from "@/components/ui/Card";
import { cx } from "@/components/ui/cx";

export default function AchievementsPage() {
  const { data: achievements, isLoading } = useGetMyAchievementsQuery();

  return (
    <div className="py-2">
      <h1 className="text-[38px]">Achievements</h1>

      {isLoading ? (
        <p className="mt-6 text-[15px] text-neutral-700">Loading...</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {achievements?.map((achievement) => (
            <Card
              key={achievement.code}
              className={cx("flex items-start gap-3", !achievement.unlocked && "opacity-50")}
            >
              <span className="text-[28px]">{achievement.icon}</span>
              <div>
                <p className="text-[17px]">{achievement.name}</p>
                <p className="mt-1 text-[13px] text-neutral-700">{achievement.description}</p>
                {!achievement.unlocked ? (
                  <p className="mt-1 font-mono text-[10px] uppercase text-neutral-500">Locked</p>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
