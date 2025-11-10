import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  MapPin,
  Phone,
  Wind,
  Waves,
  Mountain,
  Clock,
  Shield,
  Activity,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  PhoneCall,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { toast } from "sonner";

interface EmergencyAlert {
  id: number;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  source: string;
  time: string;
  area: string;
  coordinates?: { lat: number; lng: number };
  actions?: string[];
  lastUpdated: Date;
}

export function EmergencyPreparedness() {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  // ✅ Fetch data from MapaKalamidad.ph (through corsproxy)
  const fetchEmergencyAlerts = async () => {
    try {
      const response = await fetch(
        "https://corsproxy.io/?" +
          encodeURIComponent("https://api.mapakalamidad.ph/reports")
      );
      const data = await response.json();
      console.log("MapaKalamidad Data:", data);

      // ✅ Detect actual data structure (sometimes wrapped in {reports: [...]})
      const reports = Array.isArray(data)
        ? data
        : Array.isArray(data.reports)
        ? data.reports
        : [];

      const formattedAlerts: EmergencyAlert[] = reports
        .filter((item: any) =>
          ["flood", "earthquake", "fire", "typhoon"].includes(
            (item.category || "").toLowerCase()
          )
        )
        .map((item: any, index: number) => ({
          id: item.id || index,
          type: item.category || "general",
          severity:
            item.status === "verified"
              ? "high"
              : item.status === "new"
              ? "medium"
              : "low",
          title: item.type
            ? `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} Alert`
            : "Community Alert",
          description: item.description || "No description available.",
          source: "MapaKalamidad.ph",
          time: item.updated_at || item.created_at || new Date().toISOString(),
          area: item.location?.name || "Unknown area",
          coordinates: {
            lat: item.location?.lat || 0,
            lng: item.location?.lng || 0,
          },
          actions: ["Stay alert", "Follow local authority instructions"],
          lastUpdated: new Date(),
        }));

      setAlerts(formattedAlerts);
      setLastUpdate(new Date());
      toast.success(`Fetched ${formattedAlerts.length} active alerts`);
    } catch (error) {
      console.error("Error fetching MapaKalamidad reports:", error);
      toast.error("Failed to fetch MapaKalamidad reports");
    }
  };

  // ✅ Auto-refresh every 60 seconds
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoRefresh) {
      fetchEmergencyAlerts();
      interval = setInterval(fetchEmergencyAlerts, 60000);
    }
    return () => interval && clearInterval(interval);
  }, [isAutoRefresh]);

  const emergencyContacts = [
    { name: "National Emergency Hotline", number: "911", description: "Police, Fire, Medical" },
    { name: "NDRRMC", number: "(02) 8911-1406", description: "Disaster Response" },
    { name: "Philippine Red Cross", number: "143", description: "Emergency Services" },
    { name: "Coast Guard", number: "(02) 8527-8481", description: "Maritime Emergency" },
    { name: "MMDA", number: "136", description: "Metro Manila Traffic" },
    { name: "DOH Health Emergency", number: "(02) 8651-7800", description: "Health Emergencies" },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-red-500 bg-red-50";
      case "high":
        return "border-orange-500 bg-orange-50";
      case "medium":
        return "border-yellow-500 bg-yellow-50";
      case "low":
        return "border-blue-500 bg-blue-50";
      default:
        return "border-gray-500 bg-gray-50";
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return "destructive";
      case "medium":
        return "default";
      default:
        return "secondary";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "typhoon":
        return Wind;
      case "flood":
        return Waves;
      case "earthquake":
        return Mountain;
      case "fire":
        return Zap;
      case "volcano":
        return Mountain;
      default:
        return AlertTriangle;
    }
  };

  const handleEmergencyCall = (number: string) => {
    toast.success(`Calling ${number}...`);
    // window.location.href = `tel:${number}`; // Uncomment for mobile
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2>Emergency & Calamity Preparedness</h2>
          <p className="text-muted-foreground">
            Real-time disaster alerts and survival preparation for the Philippines
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchEmergencyAlerts} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh Alerts
          </Button>
          <div className="flex items-center gap-2">
            <Label htmlFor="auto-refresh" className="text-sm">
              Auto-refresh
            </Label>
            <Switch id="auto-refresh" checked={isAutoRefresh} onCheckedChange={setIsAutoRefresh} />
          </div>
        </div>
      </div>

      {/* Last Update */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="w-4 h-4" />
        Last updated: {lastUpdate.toLocaleTimeString()}
        {isAutoRefresh && (
          <Badge variant="secondary" className="gap-1">
            <Activity className="w-3 h-3" />
            Live
          </Badge>
        )}
      </div>

      <Tabs defaultValue="alerts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="alerts">Live Alerts</TabsTrigger>
          <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
        </TabsList>

        {/* Live Alerts */}
        <TabsContent value="alerts" className="space-y-4">
          {alerts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Shield className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="font-medium text-lg mb-2">No Active Emergency Alerts</h3>
                <p className="text-muted-foreground text-center">
                  All clear! We're continuously monitoring for emergency situations.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => {
                const TypeIcon = getTypeIcon(alert.type);
                return (
                  <Card key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity)}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              alert.severity === "critical" || alert.severity === "high"
                                ? "bg-red-100"
                                : "bg-blue-100"
                            }`}
                          >
                            <TypeIcon
                              className={`w-5 h-5 ${
                                alert.severity === "critical" || alert.severity === "high"
                                  ? "text-red-600"
                                  : "text-blue-600"
                              }`}
                            />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{alert.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={getSeverityBadge(alert.severity) as any}>
                                {alert.severity.toUpperCase()}
                              </Badge>
                              <span className="text-sm text-muted-foreground">{alert.source}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <div>{new Date(alert.time).toLocaleTimeString()}</div>
                          <div>{alert.area}</div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p>{alert.description}</p>
                      {alert.actions && (
                        <div>
                          <h4 className="font-medium mb-2">Recommended Actions:</h4>
                          <ul className="space-y-1">
                            {alert.actions.map((action, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <ChevronRight className="w-3 h-3 text-primary" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="gap-1">
                          <ExternalLink className="w-3 h-3" />
                          View Full Report
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1">
                          <MapPin className="w-3 h-3" />
                          Show on Map
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Contacts */}
        <TabsContent value="contacts" className="space-y-4">
          <div className="grid gap-4">
            {emergencyContacts.map((contact, index) => (
              <Card key={index}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Phone className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{contact.name}</h4>
                      <p className="text-sm text-muted-foreground">{contact.description}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleEmergencyCall(contact.number)}
                  >
                    <PhoneCall className="w-4 h-4" />
                    {contact.number}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
