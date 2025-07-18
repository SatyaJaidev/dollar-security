/*
import { NextResponse } from "next/server";
import { SignJWT } from "jose";

// This should be in an environment variable in production
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json(c);

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
*/

/*

import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);

// CORS utility function
function withCORS(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "http://18.188.242.116:3000"); 
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

// POST /api/login
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Mock authentication
    if (email === "test@example.com" && password === "password") {
      const token = await new SignJWT({ sub: "1", email })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(JWT_SECRET);

      return withCORS(NextResponse.json({ token }));
    }

    return withCORS(
      NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    );
  } catch (error) {
    console.error("Login error:", error);
    return withCORS(
      NextResponse.json({ error: "Internal server error" }, { status: 500 })
    );
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return withCORS(new NextResponse(null, { status: 204 }));
}
*/

import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);

// CORS utility function
function withCORS(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "http://18.188.242.116:3000"); 
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

// POST /api/login
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Mock authentication
    if (email === "test@example.com" && password === "password") {
      const token = await new SignJWT({ sub: "1", email })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(JWT_SECRET);

      return withCORS(NextResponse.json({ token }));
    }

    return withCORS(
      NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    );
  } catch (error) {
    console.error("Login error:", error);
    return withCORS(
      NextResponse.json({ error: "Internal server error" }, { status: 500 })
    );
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return withCORS(new NextResponse(null, { status: 204 }));
}
