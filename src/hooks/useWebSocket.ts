import { useEffect, useState, useCallback } from 'react';

export interface TrafficLight {
  id: string;
  location: string;
  status: 'green' | 'amber' | 'red';
  vehicleCount: number;
  lat: number;
  lng: number;
}

export interface Incident {
  id: string;
  type: 'accident' | 'congestion' | 'malfunction';
  location: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  description: string;
}

export const useWebSocket = () => {
  const [trafficLights, setTrafficLights] = useState<TrafficLight[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Mock WebSocket simulation
  useEffect(() => {
    // Initialize with mock data
    const initialLights: TrafficLight[] = [
      { id: '1', location: 'Uhuru Highway & Kenyatta Ave', status: 'green', vehicleCount: 45, lat: -1.2864, lng: 36.8172 },
      { id: '2', location: 'Moi Avenue & Haile Selassie', status: 'red', vehicleCount: 78, lat: -1.2832, lng: 36.8219 },
      { id: '3', location: 'Ngong Road & Kilimani', status: 'amber', vehicleCount: 56, lat: -1.2956, lng: 36.7828 },
      { id: '4', location: 'Thika Road & Outer Ring', status: 'green', vehicleCount: 34, lat: -1.2571, lng: 36.8868 },
      { id: '5', location: 'Waiyaki Way & Westlands', status: 'red', vehicleCount: 92, lat: -1.2635, lng: 36.8055 },
    ];

    const initialIncidents: Incident[] = [
      {
        id: '1',
        type: 'accident',
        location: 'Mombasa Road',
        severity: 'high',
        timestamp: new Date().toISOString(),
        description: 'Multi-vehicle collision blocking two lanes'
      },
      {
        id: '2',
        type: 'congestion',
        location: 'Ngong Road',
        severity: 'medium',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        description: 'Heavy traffic during peak hours'
      }
    ];

    setTrafficLights(initialLights);
    setIncidents(initialIncidents);
    setIsConnected(true);

    // Simulate real-time updates every 3 seconds
    const interval = setInterval(() => {
      setTrafficLights(prev => 
        prev.map(light => ({
          ...light,
          vehicleCount: Math.max(10, light.vehicleCount + Math.floor(Math.random() * 10) - 5),
          status: Math.random() > 0.8 ? 
            (['green', 'amber', 'red'] as const)[Math.floor(Math.random() * 3)] : 
            light.status
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const updateLightStatus = useCallback((lightId: string, newStatus: 'green' | 'amber' | 'red') => {
    setTrafficLights(prev =>
      prev.map(light =>
        light.id === lightId ? { ...light, status: newStatus } : light
      )
    );
  }, []);

  const addIncident = useCallback((incident: Omit<Incident, 'id' | 'timestamp'>) => {
    const newIncident: Incident = {
      ...incident,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setIncidents(prev => [newIncident, ...prev]);
  }, []);

  return {
    trafficLights,
    incidents,
    isConnected,
    updateLightStatus,
    addIncident,
  };
};
