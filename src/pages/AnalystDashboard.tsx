import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '@/hooks/useWebSocket';
import StatusCard from '@/components/StatusCard';
import TrafficChart from '@/components/TrafficChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  LogOut,
  Download,
  Calendar,
  MapPin
} from 'lucide-react';

const AnalystDashboard = () => {
  const navigate = useNavigate();
  const { trafficLights, isConnected } = useWebSocket();

  const totalVehicles = trafficLights.reduce((sum, l) => sum + l.vehicleCount, 0);
  const avgVehicles = Math.round(totalVehicles / trafficLights.length);
  const peakIntersection = trafficLights.reduce((max, light) => 
    light.vehicleCount > max.vehicleCount ? light : max
  , trafficLights[0]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/');
  };

  // Mock weekly data
  const weeklyData = [
    { time: 'Mon', value: 1850 },
    { time: 'Tue', value: 2100 },
    { time: 'Wed', value: 2350 },
    { time: 'Thu', value: 2200 },
    { time: 'Fri', value: 2800 },
    { time: 'Sat', value: 1900 },
    { time: 'Sun', value: 1400 },
  ];

  const hourlyData = [
    { time: '06:00', value: 120 },
    { time: '07:00', value: 280 },
    { time: '08:00', value: 450 },
    { time: '09:00', value: 380 },
    { time: '10:00', value: 320 },
    { time: '11:00', value: 290 },
    { time: '12:00', value: 340 },
    { time: '13:00', value: 310 },
    { time: '14:00', value: 290 },
    { time: '15:00', value: 320 },
    { time: '16:00', value: 420 },
    { time: '17:00', value: 520 },
    { time: '18:00', value: 480 },
  ];

  const intersectionData = trafficLights.map(light => ({
    time: light.location.split('&')[0].trim(),
    value: light.vehicleCount
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Traffic Analyst Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Data Analytics & Insights</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatusCard
            title="Average Vehicles/Hour"
            value={avgVehicles}
            icon={Activity}
            trend={{ value: 15, isPositive: true }}
          />
          <StatusCard
            title="Peak Hour Traffic"
            value={520}
            icon={TrendingUp}
            trend={{ value: 8, isPositive: false }}
          />
          <StatusCard
            title="Monitored Junctions"
            value={trafficLights.length}
            icon={MapPin}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <TrafficChart
            data={hourlyData}
            type="area"
            title="Hourly Traffic Pattern"
            dataKey="vehicles"
          />
          <TrafficChart
            data={weeklyData}
            type="bar"
            title="Weekly Traffic Volume"
            dataKey="vehicles"
          />
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Intersection Analysis */}
          <div className="lg:col-span-2">
            <TrafficChart
              data={intersectionData}
              type="bar"
              title="Traffic by Intersection"
              dataKey="vehicles"
            />
          </div>

          {/* Peak Hours & Stats */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Peak Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gradient-primary rounded-lg text-primary-foreground">
                <p className="text-sm opacity-90 mb-1">Busiest Intersection</p>
                <p className="font-bold text-lg mb-2">{peakIntersection?.location}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {peakIntersection?.vehicleCount} vehicles
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 border border-border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Morning Peak</p>
                  <p className="text-2xl font-bold">07:00 - 09:00</p>
                  <p className="text-xs text-muted-foreground mt-1">Average: 380 vehicles/hour</p>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Evening Peak</p>
                  <p className="text-2xl font-bold">17:00 - 19:00</p>
                  <p className="text-xs text-muted-foreground mt-1">Average: 500 vehicles/hour</p>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Weekend Average</p>
                  <p className="text-2xl font-bold">1,650</p>
                  <p className="text-xs text-muted-foreground mt-1">Vehicles per day</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Congestion Heatmap Info */}
        <Card className="shadow-card mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Congestion Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {trafficLights.map((light) => {
                const congestionLevel = light.vehicleCount < 40 ? 'low' : 
                                       light.vehicleCount < 70 ? 'medium' : 'high';
                return (
                  <div 
                    key={light.id}
                    className={`p-4 rounded-lg border transition-all ${
                      congestionLevel === 'low' ? 'border-success bg-success/10' :
                      congestionLevel === 'medium' ? 'border-warning bg-warning/10' :
                      'border-destructive bg-destructive/10'
                    }`}
                  >
                    <p className="text-xs font-medium mb-2 truncate">{light.location.split('&')[0]}</p>
                    <p className="text-2xl font-bold mb-1">{light.vehicleCount}</p>
                    <Badge 
                      variant="outline"
                      className={`text-xs ${
                        congestionLevel === 'low' ? 'border-success text-success' :
                        congestionLevel === 'medium' ? 'border-warning text-warning' :
                        'border-destructive text-destructive'
                      }`}
                    >
                      {congestionLevel.toUpperCase()}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalystDashboard;
