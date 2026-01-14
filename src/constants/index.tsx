export const personalInfo = {
  name: "Pankaj Thakur",
  role: "Software Engineer",
  email: "pankaj@thakur.dev",
  company: "Netclues India",
  bio: "I build end-to-end systems — APIs, real-time backends, frontends, and deployment infrastructure.",
  aboutLong: [
    "My work spans real-time communication, workflow orchestration, risk management, payments, and deployment infrastructure.",
    "Outside my day job, I build and run my own platforms — a real-time social system, a business SaaS, and a self-hosted PaaS.",
  ],
};

export const projects = [
  {
    title: "SyncVibe",
    subtitle: "Real-time Social Platform",
    desc: "Multi-user system for synchronized music playback, chat, and WebRTC video calls with passkey (WebAuthn) and 2FA authentication.",
    tech: [
      "React",
      "WebRTC",
      "WebSockets",
      "WebAuthn",
      "PostgreSQL",
      "Node",
      "Bun",
    ],
    repo: "https://github.com/thakurdotdev/syncvibe",
    live: "https://syncvibe.thakur.dev",
  },
  {
    title: "Thakur Deploy",
    subtitle: "Self-hosted PaaS",
    desc: "Vercel-like deployment platform with build queues, realtime logs, webhook-triggered deploys, Nginx reverse proxy, and dynamic subdomains.",
    tech: ["Next.js", "Bun", "PostgreSQL", "Drizzle", "Nginx", "CI/CD"],
    repo: "https://github.com/thakurdotdev/thakur-deploy",
    // live: "https://thakur-deploy.thakur.dev",
  },
  {
    title: "GasOps",
    subtitle: "LPG Agency SaaS",
    desc: "Multi-tenant business platform for LPG agencies with delivery tracking, OTP & photo proof, cash/UPI payments, and agency dashboards.",
    tech: [
      "Node",
      "PostgreSQL",
      "Drizzle",
      "React",
      "React Native",
      "WebSockets",
    ],
    status: "In Development",
    // repo: "https://github.com/thakurdotdev/gasops",
  },
];

export const workHighlights = [
  {
    title: "eGov Workflow Engine",
    desc: "Multi-step approval engine with role-based assignment and department routing",
  },
  {
    title: "Risk & GRC Platform",
    desc: "Enterprise governance with scoring, mitigations, heatmaps, and RBAC",
  },
  {
    title: "Security Architecture",
    desc: "Per-request ephemeral keys protected by public-key cryptography",
  },
];

export const workTech = ["React", "Node.js", "PostgreSQL", "TypeScript"];

export const socialLinks = [
  { name: "GitHub", url: "https://github.com/thakurdotdev" },
  { name: "LinkedIn", url: "https://linkedin.com/in/thakurdotdev" },
  { name: "X", url: "https://x.com/thakurdotdev" },
];
