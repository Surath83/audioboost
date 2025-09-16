"use client"

import { useMemo } from "react"
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"
import { AUDIO_FREQUENCIES } from "@/lib/constants"

interface HearingProfile {
  [frequency: number]: number
}

interface HearingProfileChartProps {
  leftEar: HearingProfile
  rightEar: HearingProfile
}

export default function HearingProfileChart({ leftEar, rightEar }: HearingProfileChartProps) {
  const data = useMemo(() => {
    return AUDIO_FREQUENCIES.map(freq => ({
      name: freq >= 1000 ? `${freq / 1000}k` : `${freq}`,
      "Left Ear": leftEar[freq] || 0,
      "Right Ear": rightEar[freq] || 0,
    }))
  }, [leftEar, rightEar])

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" unit="Hz" />
          <YAxis unit="dB" domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Left Ear" stroke="#3b82f6" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="Right Ear" stroke="#22c55e" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
