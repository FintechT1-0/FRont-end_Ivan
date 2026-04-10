import Logo from "../assets/Logo.png";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#0b2a45",
        padding: "60px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          borderRadius: "30px",
          padding: "40px",
          background:
            "linear-gradient(180deg, rgba(20,52,86,0.95) 0%, rgba(10,35,60,0.98) 100%)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "30px",
            color: "#ffffff",
          }}
        >
          <div>
            <h3 style={{ marginBottom: "16px" }}>
              FinTech UniVerse
            </h3>

            <p style={{ color: "#9db2c6", lineHeight: "1.6" }}>
              Platform for learning fintech, exploring insights and building
              your career path in digital finance.
            </p>
          </div>

          <div>
            <p style={title}>Platform</p>
            <p style={link}>Courses</p>
            <p style={link}>Insights</p>
            <p style={link}>Partners</p>
          </div>

          <div>
            <p style={title}>Resources</p>
            <p style={link}>Documentation</p>
            <p style={link}>Support</p>
            <p style={link}>Privacy</p>
          </div>

          <div>
            <p style={title}>Follow</p>

            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <div style={icon}>IG</div>
              <div style={icon}>FB</div>
              <div style={icon}>X</div>
              <div style={icon}>TG</div>
            </div>

            <img
              src={Logo}
              alt="logo"
              style={{ width: "60px", marginTop: "10px" }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

const title = {
  fontWeight: "600",
  marginBottom: "12px",
};

const link = {
  color: "#9db2c6",
  marginBottom: "8px",
  cursor: "pointer",
};

const icon = {
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  background: "#B3131A",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  color: "#fff",
};