import { NextResponse } from "next/server";
import { SignJWT } from "jose";

// This should be in an environment variable in production
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // TODO: Replace with your actual user authentication logic
    // This is just a mock implementation
    if (email === "test@example.com" && password === "password") {
      const token = await new SignJWT({ sub: "1", email })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(JWT_SECRET);

      return NextResponse.json({ token });
    }

    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 