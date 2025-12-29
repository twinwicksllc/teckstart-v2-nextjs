import { CognitoIdentityProviderClient, InitiateAuthCommand, GetUserCommand, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cookies } from "next/headers";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-1",
});

interface User {
  id: number;
  email: string;
  name: string;
  role: "user" | "admin";
}

export async function getServerSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    console.log("getServerSession: No auth-token cookie found");
    return null;
  }

  try {
    console.log("getServerSession: Verifying token (token length:", token.length, ")");
    
    let email: string | undefined;

    // 1. Try UserInfo endpoint (Required for Google/OAuth tokens)
    const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
    if (domain) {
      const baseUrl = domain.startsWith("http") ? domain : `https://${domain}`;
      try {
        console.log("getServerSession: Attempting UserInfo endpoint...");
        const userInfoResponse = await fetch(`${baseUrl}/oauth2/userInfo`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store'
        });
        
        if (userInfoResponse.ok) {
          const data = await userInfoResponse.json();
          email = data.email;
          console.log("getServerSession: UserInfo success, email:", email);
        } else {
          console.log("getServerSession: UserInfo failed with status:", userInfoResponse.status);
        }
      } catch (e) {
        console.error("getServerSession: UserInfo fetch error:", e);
      }
    }

    // 2. Fallback to GetUserCommand (For native Cognito tokens)
    if (!email) {
      try {
        console.log("getServerSession: Attempting GetUserCommand fallback...");
        const command = new GetUserCommand({ AccessToken: token });
        const response = await cognitoClient.send(command);
        email = response.UserAttributes?.find(attr => attr.Name === "email")?.Value;
        console.log("getServerSession: GetUserCommand success, email:", email);
      } catch (e) {
        // GetUserCommand fails for OAuth tokens - this is expected
        // Log at debug level, not error
        if (process.env.NODE_ENV === 'development') {
          console.log("getServerSession: GetUserCommand fallback not applicable (likely OAuth token)");
        }
      }
    }
    
    if (!email) {
      console.error("getServerSession: Could not retrieve email from token");
      return null;
    }

    const normalizedEmail = email.toLowerCase();

    // Get user from database
    const { db } = await import("@/lib/db");
    const { users } = await import("@/drizzle.schema");
    const { eq } = await import("drizzle-orm");

    const userRecords = await db.select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (userRecords.length === 0) {
      console.error(`getServerSession: User not found in database for email: ${normalizedEmail}`);
      return null;
    }

    const dbUser = userRecords[0];
    console.log("getServerSession: User found in DB:", dbUser.id);
    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name ?? normalizedEmail.split("@")[0],
      role: dbUser.role,
    };
  } catch (error) {
    console.error("getServerSession: Session verification failed:", error);
    if (error instanceof Error) {
      console.error("getServerSession: Error message:", error.message);
    }
    return null;
  }
}

export async function authenticateUser(email: string, password: string): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
  try {
    const normalizedEmail = email.toLowerCase();
    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: (process.env.AWS_COGNITO_CLIENT_ID || process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID)!,
      AuthParameters: {
        USERNAME: normalizedEmail,
        PASSWORD: password,
      },
    });

    const response = await cognitoClient.send(command);

    if (response.AuthenticationResult) {
      // Get user info from your database
      const { db } = await import("@/lib/db");
      const { users } = await import("@/drizzle.schema");
      const { eq } = await import("drizzle-orm");

      const mapDbUser = (record: typeof users.$inferSelect): User => ({
        id: record.id,
        email: record.email,
        name: record.name ?? record.email.split("@")[0],
        role: record.role,
      });

      const userRecords = await db.select()
        .from(users)
        .where(eq(users.email, normalizedEmail))
        .limit(1);

      if (userRecords.length === 0) {
        // Create user in database if not exists
        await db.insert(users).values({
          email: normalizedEmail,
          loginMethod: "cognito",
          role: "user",
        });

        const createdUser = await db.select()
          .from(users)
          .where(eq(users.email, normalizedEmail))
          .limit(1);

        if (createdUser.length === 0) {
          return { success: false, error: "Failed to create user" };
        }

        return {
          success: true,
          user: mapDbUser(createdUser[0]),
          token: response.AuthenticationResult.AccessToken!,
        };
      }

      return {
        success: true,
        user: mapDbUser(userRecords[0]),
        token: response.AuthenticationResult.AccessToken!,
      };
    }

    return { success: false, error: "Authentication failed" };
  } catch (error) {
    console.error("Cognito authentication error details:", error);
    if (error instanceof Error) {
      // Check for specific Cognito errors
      if (error.name === "UserNotConfirmedException") {
        return { success: false, error: "Please confirm your email before logging in." };
      }
      if (error.name === "NotAuthorizedException") {
        return { success: false, error: "Incorrect username or password." };
      }
      return { success: false, error: error.message };
    }
    return { success: false, error: "Authentication failed" };
  }
}

export async function createSession(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
}
export async function registerUser(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const command = new SignUpCommand({
      ClientId: (process.env.AWS_COGNITO_CLIENT_ID || process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID)!,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: "email", Value: email },
      ],
    });

    await cognitoClient.send(command);

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Registration failed" };
  }
}
