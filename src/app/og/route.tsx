import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const task = new URL(req.url).searchParams.get("task") || "Should Jev do it?";
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", backgroundColor: "#090a0f", color: "#f8fafc", padding: 72, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", color: "#c084fc", fontSize: 42, fontWeight: 800 }}>JEV VS. JEV</div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ color: "#94a3b8", fontSize: 24 }}>Should Jev do it?</div>
        <div style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.2, marginTop: 20 }}>{task.slice(0, 120)}</div>
      </div>
      <div style={{ display: "flex", color: "#94a3b8", fontSize: 20 }}>Jev judges whether Jev should handle your task.</div>
    </div>,
    { width: 1200, height: 630 },
  );
}
