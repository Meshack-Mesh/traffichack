import { useWebSocket } from '@/hooks/useWebSocket';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Navigation, 
  AlertTriangle,
  MapPin,
  Search,
  Activity,
  Clock
} from 'lucide-react';

const PublicView = () => {
  const { trafficLights, incidents } = useWebSocket();

  const getCongestionLevel = (vehicleCount: number) => {
    if (vehicleCount < 40) return { level: 'Low', color: 'success' };
    if (vehicleCount < 70) return { level: 'Medium', color: 'warning' };
    return { level: 'High', color: 'destructive' };
  };

  const getAreaCongestion = (location: string) => {
    const light = trafficLights.find(l => l.location.includes(location));
    if (!light) return { level: 'Unknown', color: 'muted' };
    return getCongestionLevel(light.vehicleCount);
  };

  const areas = [
    'Uhuru Highway',
    'Moi Avenue',
    'Ngong Road',
    'Thika Road',
    'Waiyaki Way'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-success/10">
      {/* Hero Section */}
      <div className="bg-gradient-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <Activity className="w-4 h-4" />
              <span className="text-sm font-medium">Live Traffic Updates</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Nairobi Traffic Status
            </h1>
            <p className="text-lg opacity-90 mb-6">
              Check real-time traffic conditions across the city
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search for a location or route..."
                  className="pl-12 pr-4 py-6 text-lg bg-white/95 backdrop-blur-sm border-0"
                />
                <Button 
                  size="lg"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Live Alerts */}
        {incidents.length > 0 && (
          <Card className="shadow-card mb-6 border-destructive/50 bg-destructive/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                Active Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {incidents.slice(0, 3).map((incident) => (
                  <div 
                    key={incident.id}
                    className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border"
                  >
                    <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-semibold capitalize">{incident.type}</p>
                        <Badge 
                          variant="outline"
                          className="text-xs"
                        >
                          {incident.severity}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {incident.location}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {incident.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Congestion by Area */}
        <Card className="shadow-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Traffic Conditions by Area
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {areas.map((area) => {
                const congestion = getAreaCongestion(area);
                return (
                  <div
                    key={area}
                    className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                      congestion.color === 'success' ? 'border-success bg-success/5' :
                      congestion.color === 'warning' ? 'border-warning bg-warning/5' :
                      congestion.color === 'destructive' ? 'border-destructive bg-destructive/5' :
                      'border-border bg-muted/20'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold">{area}</p>
                      <Badge 
                        variant="outline"
                        className={`${
                          congestion.color === 'success' ? 'border-success text-success' :
                          congestion.color === 'warning' ? 'border-warning text-warning' :
                          congestion.color === 'destructive' ? 'border-destructive text-destructive' :
                          'border-border text-muted-foreground'
                        }`}
                      >
                        {congestion.level}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Updated just now</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Understanding Traffic Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 rounded-full bg-success mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Low Congestion</p>
                  <p className="text-xs text-muted-foreground">Traffic flowing smoothly</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 rounded-full bg-warning mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Medium Congestion</p>
                  <p className="text-xs text-muted-foreground">Moderate traffic, expect delays</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 rounded-full bg-destructive mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">High Congestion</p>
                  <p className="text-xs text-muted-foreground">Heavy traffic, consider alternatives</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Data updates every 3 seconds • Powered by Smart Traffic Management System</p>
        </div>
      </div>
    </div>
  );
};

export default PublicView;
