'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis } from 'recharts';
import { ReadinessScore } from '@/lib/readiness';

export default function ReadinessRadar({ score }: { score: ReadinessScore }) {
  const data = [
    { subject: 'Technical', A: score.technical, fullMark: 100 },
    { subject: 'Consistency', A: score.consistency, fullMark: 100 },
    { subject: 'Versatility', A: score.versatility, fullMark: 100 },
  ];

  return (
    <div className="h-full w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#ffffff10" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} />
          <Radar
            name="Readiness"
            dataKey="A"
            stroke="#06b6d4"
            fill="#06b6d4"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
