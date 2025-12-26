import { CognitoIdentityProviderClient, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-1",
});

async function signUp(email: string, password: string) {
  try {
    const command = new SignUpCommand({
      ClientId: process.env.AWS_COGNITO_CLIENT_ID || process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: "email", Value: email },
      ],
    });

    const response = await client.send(command);
    console.log("Sign up successful:", response);
  } catch (error) {
    console.error("Sign up failed:", error);
  }
}

// Usage: npx tsx scripts/signup.ts <email> <password>
const [email, password] = process.argv.slice(2);
if (email && password) {
  signUp(email, password);
} else {
  console.log("Usage: npx tsx scripts/signup.ts <email> <password>");
}
