import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { formatTime } from '@/lib/utils';

interface IoTData {
  timestamp: string;
  email: string;
  bulb1: string | boolean;
  bulb2: string | boolean;
  bulb3: string | boolean;
  bulb4: string | boolean;
  ecran1: string | boolean;
  ecran2: string | boolean;
  ecran3: string | boolean;
  ecran4: string | number;
  ecran5: string | boolean;
  ecran6: string | boolean;
  indicateur1: number;
  indicateur2: number;
  indicateur3: number;
  indicateur4: number;
}

interface ChartSectionProps {
  data: IoTData[];
}

export function ChartSection({ data }: ChartSectionProps) {
  const [activeLine, setActiveLine] = useState<string | null>(null);

  if (data.length === 0) return null;

  // Format data for line chart
  const chartData = data.slice(-20).map((item, index) => ({
    index: index + 1,
    time: formatTime(item.timestamp),
    indicateur1: item.indicateur1,
    indicateur2: item.indicateur2,
    indicateur3: item.indicateur3,
    indicateur4: item.indicateur4,
  }));

  // Format data for bar chart (latest values)
  const latestData = data[data.length - 1];
  const barData = [
    { name: 'Sensor 1', value: latestData.indicateur1 },
    { name: 'Sensor 2', value: latestData.indicateur2 },
    { name: 'Sensor 3', value: latestData.indicateur3 },
    { name: 'Sensor 4', value: latestData.indicateur4 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm text-muted-foreground">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Line Chart */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Sensor Trends (Last 20 readings)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="time"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                {/* Indicateur 1 */}
                <Line
                  type="monotone"
                  dataKey="indicateur1"
                  stroke="hsl(199, 89%, 48%)"
                  strokeWidth={activeLine === "indicateur1" ? 3 : 2}
                  strokeOpacity={activeLine === "indicateur1" ? 1 : 0.2}
                  dot={{
                    fill: "hsl(199, 89%, 48%)",
                    strokeWidth: activeLine === "indicateur1" ? 4 : 2,
                    r: activeLine === "indicateur1" ? 6 : 4,
                    filter: activeLine === "indicateur1" ? "drop-shadow(0 0 4px hsl(199, 89%, 48%))" : "none",
                  }}
                  style={{
                    filter: activeLine === "indicateur1" ? "drop-shadow(0 0 6px hsl(199, 89%, 48%))" : "none",
                  }}
                  name="Sensor 1"
                  onClick={() => setActiveLine(activeLine === "indicateur1" ? null : "indicateur1")}
                />
                {/* Indicateur 2 */}
                <Line
                  type="monotone"
                  dataKey="indicateur2"
                  stroke="hsl(142, 76%, 36%)"
                  strokeWidth={activeLine === "indicateur2" ? 3 : 2}
                  strokeOpacity={activeLine === "indicateur2" ? 1 : 0.2}
                  dot={{
                    fill: "hsl(142, 76%, 36%)",
                    strokeWidth: activeLine === "indicateur2" ? 4 : 2,
                    r: activeLine === "indicateur2" ? 6 : 4,
                    filter: activeLine === "indicateur2" ? "drop-shadow(0 0 4px hsl(142, 76%, 36%))" : "none",
                  }}
                  style={{
                    filter: activeLine === "indicateur2" ? "drop-shadow(0 0 6px hsl(142, 76%, 36%))" : "none",
                  }}
                  name="Sensor 2"
                  onClick={() => setActiveLine(activeLine === "indicateur2" ? null : "indicateur2")}
                />
                {/* Indicateur 3 */}
                <Line
                  type="monotone"
                  dataKey="indicateur3"
                  stroke="hsl(38, 92%, 50%)"
                  strokeWidth={activeLine === "indicateur3" ? 3 : 2}
                  strokeOpacity={activeLine === "indicateur3" ? 1 : 0.2}
                  dot={{
                    fill: "hsl(38, 92%, 50%)",
                    strokeWidth: activeLine === "indicateur3" ? 4 : 2,
                    r: activeLine === "indicateur3" ? 6 : 4,
                    filter: activeLine === "indicateur3" ? "drop-shadow(0 0 4px hsl(38, 92%, 50%))" : "none",
                  }}
                  style={{
                    filter: activeLine === "indicateur3" ? "drop-shadow(0 0 6px hsl(38, 92%, 50%))" : "none",
                  }}
                  name="Sensor 3"
                  onClick={() => setActiveLine(activeLine === "indicateur3" ? null : "indicateur3")}
                />
                {/* Indicateur 4 */}
                <Line
                  type="monotone"
                  dataKey="indicateur4"
                  stroke="hsl(280, 89%, 58%)"
                  strokeWidth={activeLine === "indicateur4" ? 3 : 2}
                  strokeOpacity={activeLine === "indicateur4" ? 1 : 0.2}
                  dot={{
                    fill: "hsl(280, 89%, 58%)",
                    strokeWidth: activeLine === "indicateur4" ? 4 : 2,
                    r: activeLine === "indicateur4" ? 6 : 4,
                    filter: activeLine === "indicateur4" ? "drop-shadow(0 0 4px hsl(280, 89%, 58%))" : "none",
                  }}
                  style={{
                    filter: activeLine === "indicateur4" ? "drop-shadow(0 0 6px hsl(280, 89%, 58%))" : "none",
                  }}
                  name="Sensor 4"
                  onClick={() => setActiveLine(activeLine === "indicateur4" ? null : "indicateur4")}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bar Chart */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Current Sensor Values
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  fill="url(#gradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
