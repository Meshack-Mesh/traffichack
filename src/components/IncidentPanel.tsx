import { Incident } from '@/hooks/useWebSocket';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Car, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface IncidentPanelProps {
  incidents: Incident[];
}

const IncidentPanel = ({ incidents }: IncidentPanelProps) => {
  const getIncidentIcon = (type: Incident['type']) => {
    switch (type) {
      case 'accident': return AlertTriangle;
      case 'congestion': return Car;
      case 'malfunction': return AlertCircle;
    }
  };

  const getSeverityColor = (severity: Incident['severity']) => {
    switch (severity) {
      case 'low': return 'bg-success/20 text-success border-success/30';
      case 'medium': return 'bg-warning/20 text-warning border-warning/30';
      case 'high': return 'bg-destructive/20 text-destructive border-destructive/30';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ago`;
  };

  return (
    <Card className="shadow-card h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          Live Incidents
          <Badge variant="secondary" className="ml-auto">
            {incidents.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-3 p-6 pt-0">
            {incidents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">No active incidents</p>
              </div>
            ) : (
              incidents.map((incident) => {
                const IncidentIcon = getIncidentIcon(incident.type);
                return (
                  <div
                    key={incident.id}
                    className="p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors animate-slide-in"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        incident.type === 'accident' ? 'bg-destructive/10' :
                        incident.type === 'congestion' ? 'bg-warning/10' :
                        'bg-primary/10'
                      }`}>
                        <IncidentIcon className={`w-4 h-4 ${
                          incident.type === 'accident' ? 'text-destructive' :
                          incident.type === 'congestion' ? 'text-warning' :
                          'text-primary'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="font-semibold text-sm capitalize">{incident.type}</p>
                          <Badge 
                            variant="outline" 
                            className={`${getSeverityColor(incident.severity)} text-xs`}
                          >
                            {incident.severity}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-foreground mb-1">
                          {incident.location}
                        </p>
                        <p className="text-xs text-muted-foreground mb-2">
                          {incident.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatTime(incident.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default IncidentPanel;
