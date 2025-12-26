import { cookies } from "next/headers";
import { CognitoIdentityProviderClient, GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { db } from "@/lib/db";
import { users } from "@/drizzle.schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function DebugAuthPage() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth-token");
  
  const logs: string[] = [];
  const log = (msg: string) => logs.push(`${new Date().toISOString().split('T')[1]} - ${msg}`);
  
  let session = null;
  let error = null;
  let envCheck = {
    hasRegion: !!process.env.AWS_REGION,
    region: process.env.AWS_REGION,
    hasCognitoClient: !!process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID,
    hasCognitoDomain: !!process.env.NEXT_PUBLIC_COGNITO_DOMAIN,
    nodeEnv: process.env.NODE_ENV,
    hasDbUrl: !!process.env.DATABASE_URL,
  };

  if (authToken) {
    try {
      log("Token found. Initializing Cognito Client...");
      const region = process.env.AWS_REGION || "us-east-1";
      log(`Using region: ${region}`);
      
      const client = new CognitoIdentityProviderClient({
        region: region,
      });
      
      log("Sending GetUserCommand to Cognito...");
      const command = new GetUserCommand({ AccessToken: authToken.value });
      
      const response = await client.send(command);
      log(`Cognito Response: Username=${response.Username}`);
      
      const emailAttr = response.UserAttributes?.find(a => a.Name === "email");
      const email = emailAttr?.Value;
      log(`Email attribute found: ${email}`);
      
      if (email) {
        log("Checking database for user...");
        const userRecords = await db.select().from(users).where(eq(users.email, email)).limit(1);
        log(`DB Records found: ${userRecords.length}`);
        
        if (userRecords.length > 0) {
          session = userRecords[0];
          log(`User loaded: ID=${session.id}`);
        } else {
          log("User not found in DB.");
          // Try lowercase lookup just in case
          const lowerEmail = email.toLowerCase();
          log(`Trying lowercase lookup: ${lowerEmail}`);
          const lowerRecords = await db.select().from(users).where(eq(users.email, lowerEmail)).limit(1);
          log(`Lowercase DB Records found: ${lowerRecords.length}`);
        }
      } else {
        log("No email attribute in Cognito response");
        log(`Available attributes: ${response.UserAttributes?.map(a => a.Name).join(", ")}`);
      }
      
    } catch (e: any) {
      log(`ERROR: ${e.message}`);
      log(`Error Name: ${e.name}`);
      if (e.name === 'NotAuthorizedException') {
        log("Token might be expired or invalid");
      }
      error = e.message;
    }
  } else {
    log("No auth-token cookie found");
  }

  return (
    <div className="p-8 font-mono text-sm">
      <h1 className="text-xl font-bold mb-4">Auth Debugger (Deep Dive)</h1>
      
      <div className="mb-8">
        <h2 className="font-bold text-lg mb-2">Environment Check</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(envCheck, null, 2)}
        </pre>
      </div>

      <div className="mb-8">
        <h2 className="font-bold text-lg mb-2">Execution Logs</h2>
        <div className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto">
          {logs.map((l, i) => (
            <div key={i} className="mb-1">{l}</div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-bold text-lg mb-2">Session Result</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  );
}
