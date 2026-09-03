import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e1b4b 0%, #4338ca 50%, #7c3aed 100%)",
          color: "white",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "20px",
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
            }}
          >
            &#x1F393;
          </div>
          <span style={{ fontSize: "48px", fontWeight: "bold" }}>SmartLMS</span>
        </div>
        <div
          style={{
            fontSize: "32px",
            fontWeight: 600,
            textAlign: "center",
            marginBottom: "16px",
            opacity: 0.95,
          }}
        >
          AI-Powered Learning Management System
        </div>
        <div
          style={{
            fontSize: "22px",
            textAlign: "center",
            opacity: 0.7,
            maxWidth: "800px",
          }}
        >
          Create, manage, and sell online courses with the most powerful LMS platform.
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
