import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Navigation, MapPin } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RouteSimulator = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    if (origin && destination) {
      setShowResults(true);
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="w-5 h-5" />
          Route Congestion Checker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Enter starting point..."
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Enter destination..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} className="w-full">
            <Search className="w-4 h-4 mr-2" />
            Check Route
          </Button>
        </div>

        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 pt-4 border-t border-border"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Estimated Travel Time</span>
                  <span className="font-semibold">25-35 min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Distance</span>
                  <span className="font-semibold">12.5 km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Congestion Level</span>
                  <span className="font-semibold text-warning">Medium</span>
                </div>
              </div>

              {/* Route segments */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Route Breakdown</p>
                <div className="space-y-2">
                  {[
                    { name: 'Uhuru Highway', status: 'low', color: 'bg-traffic-green' },
                    { name: 'Moi Avenue', status: 'medium', color: 'bg-warning' },
                    { name: 'Ngong Road', status: 'high', color: 'bg-destructive' }
                  ].map((segment, index) => (
                    <motion.div
                      key={segment.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className={`w-3 h-3 rounded-full ${segment.color}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{segment.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{segment.status} traffic</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default RouteSimulator;
