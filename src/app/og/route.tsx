import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", padding: 28, backgroundColor: "#21242e", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", flexDirection: "column", width: "100%", padding: 42, border: "5px solid #3d4f97", backgroundColor: "#7a8aba" }}>
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", paddingBottom: 18, borderBottom: "2px solid #3d4f97", color: "#26365f", fontSize: 22, fontWeight: 800 }}>
          <span>THE SELF-REFERENCE TEST</span><span>A TINY EXPERIMENT</span>
        </div>
        <div style={{ display: "flex", color: "#ffffff", fontSize: 90, fontWeight: 900, letterSpacing: -4, marginTop: 30 }}>JEV VS. JEV</div>
        <div style={{ display: "flex", color: "#21242e", fontSize: 46, fontWeight: 800, marginTop: 4 }}>Should Jev decide if you should use Jev?</div>
        <div style={{ display: "flex", gap: 18, marginTop: "auto" }}>
          <div style={{ display: "flex", flex: 1, padding: 24, border: "3px solid #3d4f97", backgroundColor: "#8ba1d4", color: "#21242e", fontSize: 28, fontWeight: 700 }}>YOU BRING A TASK</div>
          <div style={{ display: "flex", flex: 1, padding: 24, border: "3px solid #a84d0a", backgroundColor: "#f68d1f", color: "#21242e", fontSize: 28, fontWeight: 800 }}>JEV SAYS YES OR NO</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginTop: 24, color: "#26365f", fontSize: 19, fontWeight: 800 }}>
          <span>ONE TASK IN. ONE AWKWARD ANSWER OUT.</span><span>jev-vs-jev.vercel.app</span>
        </div>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
