import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TrafficCone } from "lucide-react";

const Login = () => {
  const [role, setRole] = useState("operator");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store role in localStorage for demo purposes
    localStorage.setItem("userRole", role);
    
    // Navigate based on role
    if (role === "operator") {
      navigate("/operator");
    } else if (role === "analyst") {
      navigate("/analyst");
    } else {
      navigate("/public");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-primary/10 p-4">
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
            <TrafficCone className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Smart Traffic Management</CardTitle>
            <CardDescription>Sign in to access the system</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-3">
              <Label>Select Role</Label>
              <RadioGroup value={role} onValueChange={setRole} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="operator" id="operator" />
                  <Label htmlFor="operator" className="cursor-pointer">
                    Traffic Operator
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="analyst" id="analyst" />
                  <Label htmlFor="analyst" className="cursor-pointer">
                    Traffic Analyst
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public" className="cursor-pointer">
                    Public User
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full bg-gradient-primary">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
