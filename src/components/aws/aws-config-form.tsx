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
  const [syncMonths, setSyncMonths] = useState(1);

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
        body: JSON.stringify({ 
          accessKeyId: accessKeyId.trim(), 
          secretAccessKey: secretAccessKey.trim(), 
          region 
        }),
      });
      
      if (res.ok) {
        setConfigured(true);
        setAccessKeyId("");
        setSecretAccessKey("");
        alert("Configuration saved!");
      } else {
        const data = await res.json();
        alert(`Failed to save configuration: ${data.error || "Unknown error"}`);
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
      // Calculate start date based on selected months
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - syncMonths);
      startDate.setDate(1); // Start from the 1st of that month

      const res = await fetch("/api/aws/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        }),
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
    <div className="space-y-6">
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
            <div className="mt-6 pt-6 border-t space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Last synced: {lastSynced ? new Date(lastSynced).toLocaleString() : "Never"}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="syncMonths">Sync Duration</Label>
                <select
                  id="syncMonths"
                  value={syncMonths}
                  onChange={(e) => setSyncMonths(Number(e.target.value))}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value={1}>Last 1 Month</option>
                  <option value={3}>Last 3 Months</option>
                  <option value={6}>Last 6 Months</option>
                  <option value={12}>Last 12 Months</option>
                </select>
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

      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-lg">Security & Permissions</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-4 text-muted-foreground">
          <div>
            <h4 className="font-semibold text-foreground mb-1">Required Permissions</h4>
            <p>
              Create an IAM user with the following policy to allow Cost Explorer access:
            </p>
            <pre className="mt-2 p-2 bg-muted rounded-md text-xs overflow-x-auto">
{`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ce:GetCostAndUsage"
      ],
      "Resource": "*"
    }
  ]
}`}
            </pre>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-1">Data Security</h4>
            <p>
              Your credentials are <strong>encrypted at rest</strong> using AES-256 and transmitted securely via HTTPS. 
              We never log your secret keys.
            </p>
          </div>

          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <p className="text-yellow-800 dark:text-yellow-200">
              <strong>Note:</strong> For your security, the TeckStart team cannot view or recover your credentials. 
              If you lose them, you will need to generate new keys in AWS and update them here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
