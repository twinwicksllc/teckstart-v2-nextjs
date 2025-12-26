"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function AWSConfigForm() {
  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretAccessKey, setSecretAccessKey] = useState("");
  const [region, setRegion] = useState("us-east-1");
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/aws/config");
      const data = await res.json();
      if (data.configured) {
        setConfigured(true);
        setLastSynced(data.lastSyncedAt);
        setRegion(data.awsRegion);
      }
    } catch (error) {
      console.error("Failed to fetch config", error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/aws/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessKeyId, secretAccessKey, region }),
      });
      
      if (res.ok) {
        setConfigured(true);
        setAccessKeyId("");
        setSecretAccessKey("");
        alert("Configuration saved!");
      } else {
        alert("Failed to save configuration");
      }
    } catch (error) {
      console.error(error);
      alert("Error saving configuration");
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/aws/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // Use defaults
      });
      
      if (res.ok) {
        alert("Sync completed successfully!");
        fetchConfig(); // Refresh last synced
      } else {
        const data = await res.json();
        alert(`Sync failed: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      alert("Error syncing");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>AWS Cost Explorer Integration</CardTitle>
        <CardDescription>
          Connect your AWS account to automatically import expenses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accessKey">Access Key ID</Label>
            <Input
              id="accessKey"
              value={accessKeyId}
              onChange={(e) => setAccessKeyId(e.target.value)}
              placeholder={configured ? "••••••••••••••••" : "AKIA..."}
              required={!configured}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secretKey">Secret Access Key</Label>
            <Input
              id="secretKey"
              type="password"
              value={secretAccessKey}
              onChange={(e) => setSecretAccessKey(e.target.value)}
              placeholder={configured ? "••••••••••••••••" : "Secret Key"}
              required={!configured}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Input
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="us-east-1"
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : configured ? "Update Credentials" : "Connect AWS"}
          </Button>
        </form>

        {configured && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">
                Last synced: {lastSynced ? new Date(lastSynced).toLocaleString() : "Never"}
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleSync}
              disabled={syncing}
            >
              {syncing ? "Syncing..." : "Sync Now"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
