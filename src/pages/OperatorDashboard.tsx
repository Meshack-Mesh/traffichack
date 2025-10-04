import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket, TrafficLight } from '@/hooks/useWebSocket';
import TrafficMap from '@/components/TrafficMap';
import StatusCard from '@/components/StatusCard';
import IncidentPanel from '@/components/IncidentPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  LogOut,
  Radio,
  Camera,
  Settings
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OperatorDashboard = () => {
  const navigate = useNavigate();
  const { trafficLights, incidents, isConnected, updateLightStatus } = useWebSocket();
  const [selectedLight, setSelectedLight] = useState<TrafficLight | null>(null);

  const activeSignals = trafficLights.filter(l => l.status === 'green').length;
  const totalVehicles = trafficLights.reduce((sum, l) => sum + l.vehicleCount, 0);
  const avgVehicles = Math.round(totalVehicles / trafficLights.length);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const handleStatusChange = (newStatus: string) => {
    if (selectedLight && (newStatus === 'green' || newStatus === 'amber' || newStatus === 'red')) {
      updateLightStatus(selectedLight.id, newStatus);
      setSelectedLight(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <Activity className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Traffic Operator Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Real-time Traffic Control</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={isConnected ? "default" : "secondary"} className="gap-1">
                <Radio className={`w-3 h-3 ${isConnected ? 'animate-pulse-slow' : ''}`} />
                {isConnected ? 'Live' : 'Disconnected'}
              </Badge>
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
            title="Active Signals"
            value={`${activeSignals}/${trafficLights.length}`}
            icon={CheckCircle2}
            trend={{ value: 12, isPositive: true }}
          />
          <StatusCard
            title="Total Vehicles"
            value={totalVehicles}
            icon={Activity}
            trend={{ value: 8, isPositive: false }}
          />
          <StatusCard
            title="Active Incidents"
            value={incidents.length}
            icon={AlertTriangle}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Live Traffic Map
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[500px]">
                  <TrafficMap 
                    trafficLights={trafficLights}
                    onLightClick={setSelectedLight}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Camera Feeds */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Camera Feeds
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {trafficLights.slice(0, 4).map((light) => (
                    <div key={light.id} className="aspect-video bg-muted rounded-lg relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Camera className="w-12 h-12 text-muted-foreground/50" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-3">
                        <p className="text-xs text-white font-medium">{light.location}</p>
                        <p className="text-xs text-white/70">Live Feed</p>
                      </div>
                      <div className="absolute top-3 right-3">
                        <div className="flex items-center gap-1 bg-destructive/90 text-destructive-foreground px-2 py-1 rounded text-xs">
                          <div className="w-2 h-2 rounded-full bg-white animate-pulse-slow" />
                          REC
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Manual Control */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Manual Override
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedLight ? (
                  <>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm font-semibold mb-1">{selectedLight.location}</p>
                      <p className="text-xs text-muted-foreground mb-3">
                        Vehicles: {selectedLight.vehicleCount}
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-medium">Current Status:</span>
                        <Badge 
                          variant="outline"
                          className={`
                            ${selectedLight.status === 'green' ? 'bg-success/20 text-success border-success/30' : ''}
                            ${selectedLight.status === 'amber' ? 'bg-warning/20 text-warning border-warning/30' : ''}
                            ${selectedLight.status === 'red' ? 'bg-destructive/20 text-destructive border-destructive/30' : ''}
                          `}
                        >
                          {selectedLight.status.toUpperCase()}
                        </Badge>
                      </div>
                      <Select value={selectedLight.status} onValueChange={handleStatusChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Change status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="green">Green - Go</SelectItem>
                          <SelectItem value="amber">Amber - Caution</SelectItem>
                          <SelectItem value="red">Red - Stop</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Settings className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">Select a signal on the map to control</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Incidents */}
            <IncidentPanel incidents={incidents} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorDashboard;
