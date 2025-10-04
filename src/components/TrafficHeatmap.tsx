import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';
import { TrafficLight } from '@/hooks/useWebSocket';
import { motion } from 'framer-motion';

interface TrafficHeatmapProps {
  trafficLights: TrafficLight[];
}

const TrafficHeatmap = ({ trafficLights }: TrafficHeatmapProps) => {
  const [timeOfDay, setTimeOfDay] = useState([12]);

  const getIntensityColor = (vehicleCount: number) => {
    if (vehicleCount < 40) return 'bg-traffic-green/60';
    if (vehicleCount < 70) return 'bg-warning/60';
    return 'bg-destructive/60';
  };

  const getIntensitySize = (vehicleCount: number) => {
    if (vehicleCount < 40) return 'w-12 h-12';
    if (vehicleCount < 70) return 'w-16 h-16';
    return 'w-20 h-20';
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Congestion Heatmap</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Time slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Time of Day</label>
            <span className="text-sm text-muted-foreground">
              {String(timeOfDay[0]).padStart(2, '0')}:00
            </span>
          </div>
          <Slider
            value={timeOfDay}
            onValueChange={setTimeOfDay}
            max={23}
            step={1}
            className="w-full"
          />
        </div>

        {/* Heatmap visualization */}
        <div className="relative w-full h-[400px] bg-muted/20 rounded-lg overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-primary/5 via-muted/20 to-primary/5"
            style={{
              backgroundImage: `
                radial-gradient(circle at 30% 40%, hsl(var(--primary) / 0.05) 0%, transparent 50%),
                radial-gradient(circle at 70% 60%, hsl(var(--success) / 0.05) 0%, transparent 50%)
              `
            }}
          />

          {/* Grid overlay */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />

          {/* Heatmap points */}
          <div className="relative w-full h-full">
            {trafficLights.map((light, index) => {
              const x = ((light.lng + 36.95) / 0.2) * 100;
              const y = ((light.lat + 1.35) / 0.15) * 100;
              
              return (
                <motion.div
                  key={light.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${x}%`, top: `${y}%` }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`${getIntensitySize(light.vehicleCount)} ${getIntensityColor(light.vehicleCount)} rounded-full blur-xl`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-card/90 rounded px-2 py-1 text-xs font-medium whitespace-nowrap">
                      {light.vehicleCount}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-card">
            <p className="text-xs font-semibold mb-2">Congestion Level</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-traffic-green/60" />
                <span className="text-xs">Low (&lt;40)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <span className="text-xs">Medium (40-70)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <span className="text-xs">High (&gt;70)</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrafficHeatmap;
