import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Maximize2, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { TrafficLight } from '@/hooks/useWebSocket';

interface CameraGridProps {
  trafficLights: TrafficLight[];
}

const CameraGrid = ({ trafficLights }: CameraGridProps) => {
  const getCameraPlaceholder = (status: TrafficLight['status']) => {
    const colors = {
      green: 'from-traffic-green/20 to-traffic-green/5',
      amber: 'from-warning/20 to-warning/5',
      red: 'from-destructive/20 to-destructive/5'
    };
    return colors[status];
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Live Camera Feeds
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {trafficLights.map((light, index) => (
            <motion.div
              key={light.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Dialog>
                <DialogTrigger asChild>
                  <div className="group cursor-pointer">
                    <div className={`relative aspect-video rounded-lg bg-gradient-to-br ${getCameraPlaceholder(light.status)} border border-border overflow-hidden`}>
                      {/* Simulated camera feed */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Camera className="w-12 h-12 text-muted-foreground/30" />
                      </div>
                      
                      {/* Status indicator */}
                      <div className="absolute top-2 left-2 flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${
                          light.status === 'green' ? 'bg-traffic-green' :
                          light.status === 'amber' ? 'bg-warning' :
                          'bg-destructive'
                        } animate-pulse`} />
                        <span className="text-xs font-medium bg-black/50 text-white px-2 py-1 rounded">
                          LIVE
                        </span>
                      </div>

                      {/* Expand icon */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black/50 rounded p-1">
                          <Maximize2 className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      {/* Location label */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <p className="text-xs text-white font-medium truncate">
                          {light.location}
                        </p>
                        <p className="text-xs text-white/70">
                          Vehicles: {light.vehicleCount}
                        </p>
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>{light.location}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className={`relative aspect-video rounded-lg bg-gradient-to-br ${getCameraPlaceholder(light.status)} border border-border flex items-center justify-center`}>
                      <Camera className="w-24 h-24 text-muted-foreground/30" />
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          light.status === 'green' ? 'bg-traffic-green' :
                          light.status === 'amber' ? 'bg-warning' :
                          'bg-destructive'
                        } animate-pulse`} />
                        <span className="text-sm font-medium bg-black/50 text-white px-3 py-1 rounded">
                          LIVE FEED
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Snapshot
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Camera className="w-4 h-4 mr-2" />
                        Record
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraGrid;
