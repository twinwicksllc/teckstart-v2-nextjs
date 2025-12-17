import { CognitoIdentityProviderClient, InitiateAuthCommand, RespondToAuthChallengeCommand } from "@aws-sdk/client-cognito-identity-provider";
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
  const cookieStore = cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    return null;
  }

  try {
    // Verify JWT token (simplified - you'd want proper JWT verification)
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Session verification failed:", error);
    return null;
  }
}

export async function authenticateUser(email: string, password: string): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
  try {
    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: process.env.COGNITO_CLIENT_ID!,
      AuthParameters: {
        USERNAME: email,
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
        .where(eq(users.email, email))
        .limit(1);

      if (userRecords.length === 0) {
        // Create user in database if not exists
        await db.insert(users).values({
          email,
          loginMethod: "cognito",
          role: "user",
        });

        const createdUser = await db.select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (createdUser.length === 0) {
          return { success: false, error: "Failed to create user" };
        }

        return {
          success: true,
          user: mapDbUser(createdUser[0]),
          token: response.AuthenticationResult.IdToken!,
        };
      }

      return {
        success: true,
        user: mapDbUser(userRecords[0]),
        token: response.AuthenticationResult.IdToken!,
      };
    }

    return { success: false, error: "Authentication failed" };
  } catch (error) {
    console.error("Authentication error:", error);
    return { success: false, error: "Authentication failed" };
  }
}

export async function createSession(token: string, user: User): Promise<void> {
  const cookieStore = cookies();
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete("auth-token");
}