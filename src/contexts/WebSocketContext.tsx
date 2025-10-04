import { createContext, useContext, ReactNode } from 'react';
import { useWebSocket, TrafficLight, Incident } from '@/hooks/useWebSocket';

interface WebSocketContextType {
  trafficLights: TrafficLight[];
  incidents: Incident[];
  isConnected: boolean;
  updateLightStatus: (lightId: string, newStatus: 'green' | 'amber' | 'red') => void;
  addIncident: (incident: Omit<Incident, 'id' | 'timestamp'>) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const websocket = useWebSocket();

  return (
    <WebSocketContext.Provider value={websocket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within WebSocketProvider');
  }
  return context;
};
