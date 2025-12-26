import { CognitoIdentityProviderClient, ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";
import dotenv from "dotenv";
import path from "path";

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function checkUsers() {
  try {
    const command = new ListUsersCommand({
      UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
      Limit: 10,
    });

    const response = await client.send(command);
    console.log("Users in pool:");
    response.Users?.forEach(user => {
      console.log(`- Username: ${user.Username}, Status: ${user.UserStatus}, Enabled: ${user.Enabled}`);
    });
    
    if (!response.Users || response.Users.length === 0) {
      console.log("No users found in the pool.");
    }
  } catch (error) {
    console.error("Error listing users:", error);
  }
}

checkUsers();
