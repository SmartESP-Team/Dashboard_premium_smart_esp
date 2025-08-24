import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Monitor, Activity } from 'lucide-react';

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

interface StatusCardsProps {
  data: IoTData[];
}

export function StatusCards({ data }: StatusCardsProps) {
  if (data.length === 0) return null;

  const latestData = data[data.length - 1];

  const getStatusPill = (value: string | boolean | number, label: string) => {
    let status = 'unknown';
    let displayValue = 'Unknown';

    if (typeof value === 'boolean') {
      status = value ? 'online' : 'offline';
      displayValue = value ? 'Online' : 'Offline';
    } else if (typeof value === 'string') {
      if (value.toLowerCase() === 'true') {
        status = 'online';
        displayValue = 'Online';
      } else if (value.toLowerCase() === 'false') {
        status = 'offline';
        displayValue = 'Offline';
      } else if (value === 'Not Available') {
        status = 'unknown';
        displayValue = 'N/A';
      } else {
        status = 'online';
        displayValue = value;
      }
    } else if (typeof value === 'number') {
      status = 'online';
      displayValue = value.toString();
    }

    return (
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className={`status-pill status-${status}`}>
          {displayValue}
        </span>
      </div>
    );
  };

  const bulbDevices = [
    { key: 'bulb1', label: 'Bulb 1' },
    { key: 'bulb2', label: 'Bulb 2' },
    { key: 'bulb3', label: 'Bulb 3' },
    { key: 'bulb4', label: 'Bulb 4' },
  ];

  const screenDevices = [
    { key: 'ecran1', label: 'Screen 1' },
    { key: 'ecran2', label: 'Screen 2' },
    { key: 'ecran3', label: 'Screen 3' },
    { key: 'ecran4', label: 'Screen 4' },
    { key: 'ecran5', label: 'Screen 5' },
    { key: 'ecran6', label: 'Screen 6' },
  ];

  const indicatorValues = [
    { key: 'indicateur1', label: 'Sensor 1', value: latestData.indicateur1 },
    { key: 'indicateur2', label: 'Sensor 2', value: latestData.indicateur2 },
    { key: 'indicateur3', label: 'Sensor 3', value: latestData.indicateur3 },
    { key: 'indicateur4', label: 'Sensor 4', value: latestData.indicateur4 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* Bulb Status */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-400" />
            Lighting System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {bulbDevices.map(({ key, label }) => (
            <div key={key}>
              {getStatusPill(latestData[key as keyof IoTData], label)}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Screen Status */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-blue-400" />
            Display System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {screenDevices.map(({ key, label }) => (
            <div key={key}>
              {getStatusPill(latestData[key as keyof IoTData], label)}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sensor Values */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-400" />
            Sensor Readings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {indicatorValues.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-sm font-medium">{label}</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary">{value}</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}