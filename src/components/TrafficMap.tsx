import { useEffect, useRef } from 'react';
import { TrafficLight } from '@/hooks/useWebSocket';
import { MapPin } from 'lucide-react';

interface TrafficMapProps {
  trafficLights: TrafficLight[];
  onLightClick?: (light: TrafficLight) => void;
}

const TrafficMap = ({ trafficLights, onLightClick }: TrafficMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  const getStatusColor = (status: TrafficLight['status']) => {
    switch (status) {
      case 'green': return 'bg-traffic-green';
      case 'amber': return 'bg-warning';
      case 'red': return 'bg-destructive';
    }
  };

  const getCongestionLevel = (vehicleCount: number) => {
    if (vehicleCount < 40) return 'Low';
    if (vehicleCount < 70) return 'Medium';
    return 'High';
  };

  return (
    <div className="relative w-full h-full bg-muted/20 rounded-lg overflow-hidden">
      {/* Map placeholder with gradient */}
      <div 
        ref={mapRef}
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-muted/30 to-primary/5"
        style={{
          backgroundImage: `
            radial-gradient(circle at 30% 40%, hsl(var(--primary) / 0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 60%, hsl(var(--success) / 0.1) 0%, transparent 50%)
          `
        }}
      >
        {/* Grid overlay for map effect */}
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

        {/* Traffic light markers */}
        <div className="relative w-full h-full">
          {trafficLights.map((light) => {
            // Calculate position (simplified mapping)
            const x = ((light.lng + 36.95) / 0.2) * 100; // Normalize to 0-100%
            const y = ((light.lat + 1.35) / 0.15) * 100;

            return (
              <div
                key={light.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-fade-in"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                }}
              >
                <button
                  onClick={() => onLightClick?.(light)}
                  className="group relative"
                >
                  {/* Pulsing ring for active lights */}
                  <div className={`absolute inset-0 ${getStatusColor(light.status)} rounded-full opacity-30 animate-pulse-slow scale-150`} />
                  
                  {/* Main marker */}
                  <div className={`relative ${getStatusColor(light.status)} rounded-full p-3 shadow-elevated hover:scale-110 transition-transform cursor-pointer`}>
                    <MapPin className="w-5 h-5 text-white" />
                  </div>

                  {/* Tooltip */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="bg-card border border-border rounded-lg shadow-elevated p-3 min-w-[200px]">
                      <p className="font-semibold text-sm mb-1">{light.location}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Status:</span>
                        <span className={`font-medium capitalize ${
                          light.status === 'green' ? 'text-success' :
                          light.status === 'amber' ? 'text-warning' :
                          'text-destructive'
                        }`}>
                          {light.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className="text-muted-foreground">Vehicles:</span>
                        <span className="font-medium">{light.vehicleCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className="text-muted-foreground">Congestion:</span>
                        <span className="font-medium">{getCongestionLevel(light.vehicleCount)}</span>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-card">
          <p className="text-sm font-semibold mb-3">Traffic Signal Status</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-traffic-green" />
              <span className="text-xs">Green - Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning" />
              <span className="text-xs">Amber - Caution</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span className="text-xs">Red - Stop</span>
            </div>
          </div>
        </div>

        {/* Nairobi label */}
        <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-lg shadow-card">
          <p className="text-sm font-bold">Nairobi, Kenya</p>
          <p className="text-xs opacity-90">Live Traffic Monitor</p>
        </div>
      </div>
    </div>
  );
};

export default TrafficMap;
