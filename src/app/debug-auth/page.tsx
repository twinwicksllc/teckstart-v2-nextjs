import { cookies } from "next/headers";
import { getServerSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DebugAuthPage() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth-token");
  
  let session = null;
  let error = null;
  let envCheck = {
    hasRegion: !!process.env.AWS_REGION,
    hasCognitoClient: !!process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID,
    hasCognitoDomain: !!process.env.NEXT_PUBLIC_COGNITO_DOMAIN,
    nodeEnv: process.env.NODE_ENV,
  };

  try {
    session = await getServerSession();
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  return (
    <div className="p-8 font-mono text-sm">
      <h1 className="text-xl font-bold mb-4">Auth Debugger</h1>
      
      <div className="mb-8">
        <h2 className="font-bold text-lg mb-2">Environment Check</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(envCheck, null, 2)}
        </pre>
      </div>

      <div className="mb-8">
        <h2 className="font-bold text-lg mb-2">Cookies</h2>
        <div className="bg-gray-100 p-4 rounded">
          <p><strong>auth-token present:</strong> {authToken ? "Yes" : "No"}</p>
          {authToken && (
            <p className="break-all mt-2"><strong>Value (first 20 chars):</strong> {authToken.value.substring(0, 20)}...</p>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-bold text-lg mb-2">Session Result</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>

      {error && (
        <div className="mb-8">
          <h2 className="font-bold text-lg mb-2 text-red-600">Error</h2>
          <pre className="bg-red-50 p-4 rounded text-red-600">
            {error}
          </pre>
        </div>
      )}
    </div>
  );
}
