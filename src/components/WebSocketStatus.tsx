import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface WebSocketStatusProps {
  isConnected: boolean;
}

const WebSocketStatus = ({ isConnected }: WebSocketStatusProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Badge 
        variant={isConnected ? "default" : "destructive"}
        className="flex items-center gap-2"
      >
        {isConnected ? (
          <>
            <div className="w-2 h-2 rounded-full bg-traffic-green animate-pulse" />
            <Wifi className="w-3 h-3" />
            Live
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3" />
            Disconnected
          </>
        )}
      </Badge>
    </motion.div>
  );
};

export default WebSocketStatus;
