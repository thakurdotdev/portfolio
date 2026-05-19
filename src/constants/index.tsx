export const personalInfo = {
  name: "Pankaj Thakur",
  role: "Junior Software Engineer",
  email: "pankaj@thakur.dev",
  company: "Netclues India",
  careerStartDate: "2024-02-01",
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
    architecture: "Distributed WebSockets & WebRTC Multi-user Architecture",
    desc: "Multi-user system for synchronized music playback, chat, and WebRTC video calls with passkey (WebAuthn) and 2FA authentication.",
    tech: [
      "React",
      "WebRTC",
      "WebSockets",
      "WebAuthn",
      "PostgreSQL",
      "Node.js",
      "Bun",
    ],
    repo: "https://github.com/thakurdotdev/syncvibe",
    live: "https://syncvibe.thakur.dev",
  },
  {
    title: "ShipYard",
    subtitle: "Self-hosted PaaS",
    architecture: "Process-level Supervisor & Reverse-Proxy Deploy Infrastructure",
    desc: "Built a self-hosted deployment platform supporting automated builds, deployments, and dynamic subdomains. Implemented build workers, deploy engine, webhook-triggered deployments, and real-time build logs using WebSockets. Managed process-level runtimes and reverse proxying with Nginx for deployed applications.",
    tech: [
      "Next.js",
      "TypeScript",
      "Bun",
      "Elysia",
      "PostgreSQL",
      "Nginx",
      "Cloudflare",
    ],
    repo: "https://github.com/thakurdotdev/shipyard",
    demo: "https://cdn.thakur.dev/shipyard.mp4",
  },
];

export const engineeringStandards = [
  {
    title: "Strict Type Safety",
    desc: "Zero-any TypeScript setups, rigorous DB schemas, and shared type boundaries.",
  },
  {
    title: "Production Resilience",
    desc: "Process supervisors, zero-downtime webhook pipelines, and secure reverse proxying.",
  },
  {
    title: "Performance First",
    desc: "Low-latency API response boundaries, edge bundle budgets, and strict Lighthouse audits.",
  },
];

export const workExperience = [
  {
    organization: "Netclues",
    roles: [
      {
        title: "Junior Software Engineer",
        startDate: "2024-09-01",
        endDate: "Present",
        highlights: [
          {
            title: "eGov Workflow Engine",
            desc: "Designed and built a state-machine driven multi-step workflow engine for a centralized eGov portal. Engineered dynamic department onboarding and metadata-driven service creation (e.g., business licenses, tax certificates, civic registrations, etc.) with parallel approval branching, conditional routing, and SLA tracking.",
          },
          {
            title: "Risk & GRC Platform",
            desc: "Led end-to-end development of a risk management portal for C&WJ Credit Union. Built control management, inherent/residual risk matrices, RBAC approval workflows, and reporting dashboards.",
            testimonial: "https://www.linkedin.com/posts/thakurdotdev_clienttestimonial-netclues-fintech-activity-7457841848527622144-h7oe",
          },
          {
            title: "Reliable Webhook Pipeline",
            desc: "Engineered a resilient event delivery system using Redis + BullMQ with exponential backoff and delivery logs. Secured payloads via HMAC-SHA256 signatures and validation timestamps to mitigate replay attacks.",
          },
        ],
      },
      {
        title: "Software Engineer Intern",
        startDate: "2024-02-01",
        endDate: "2024-08-31",
        highlights: [
          {
            title: "Socket.IO Chat Microservice",
            desc: "Built a real-time chat system using Socket.IO, Node.js, and React within a microservice architecture.",
          },
          {
            title: "Advanced Chat Features",
            desc: "Implemented one-to-one and group chat, file upload (images/PDFs), typing indicators, read receipts, online presence, and message archiving.",
          },
        ],
      },
    ],
  },
];

export const categorizedSkills = [
  {
    category: "Languages & Frameworks",
    items: ["TypeScript", "React", "Next.js", "Node.js", "Elysia"],
  },
  {
    category: "Data, ORMs & Queues",
    items: ["PostgreSQL", "MySQL", "Prisma", "Sequelize", "Redis", "BullMQ"],
  },
  {
    category: "Real-time & Infrastructure",
    items: ["WebRTC", "WebSockets", "WebAuthn", "Bun", "Nginx", "Cloudflare"],
  },
];

export const socialLinks = [
  { name: "GitHub", url: "https://github.com/thakurdotdev" },
  { name: "LinkedIn", url: "https://linkedin.com/in/thakurdotdev" },
  { name: "X", url: "https://x.com/thakurdotdev" },
];
