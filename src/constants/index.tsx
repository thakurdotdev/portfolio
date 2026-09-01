export const personalInfo = {
  name: "Pankaj Thakur",
  role: "Full-Stack Software Engineer",
  email: "pankaj@thakur.dev",
  company: "Netclues India",
  careerStartDate: "2024-09-01",
  bio: "I design and build production-grade systems end-to-end—from high-performance backends and database architectures to frontend interfaces and developer infrastructure.",
  aboutLong: [
    "Specialized in event-driven systems, database synchronization, real-time protocols, and process management. Experienced owning production features from system architecture through deployment and telemetry.",
    "Currently engineering state-machine driven workflow engines, credit union risk portals, and resilient webhook pipelines at Netclues India.",
  ],
};

export const projects = [
  {
    title: "Tunl",
    subtitle: "Zero-Install Reverse Tunneling Platform",
    architecture: "OpenSSH Remote Forwarding & Edge Proxy",
    desc: "Exposes localhost web servers, APIs, WebSockets, and webhooks to the public internet via a single command with automatic TLS termination and zero CLI installation. Supports Ed25519/RSA public key auth, persistent subdomains, and real-time HTTP traffic inspection.",
    tech: [
      "Golang",
      "OpenSSH",
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Bun",
    ],
    repo: "https://github.com/thakurdotdev/tunl",
    live: "https://tunl.online",
  },
  {
    title: "SyncVibe",
    subtitle: "Real-time Social & Music Platform",
    architecture: "Distributed WebSockets & WebRTC Mesh",
    desc: "Real-time platform featuring synchronized multi-user audio playback, social feed & photo sharing, live chat, and low-latency WebRTC video calling. Authenticated securely via WebAuthn passkeys and 2FA, synchronizing state seamlessly across active clients.",
    tech: [
      "React",
      "TypeScript",
      "Node.js",
      "WebSockets",
      "WebRTC",
      "WebAuthn",
      "PostgreSQL",
      "Bun",
    ],
    repo: "https://github.com/thakurdotdev/syncvibe",
    live: "https://syncvibe.thakur.dev",
  },
  {
    title: "ShipYard",
    subtitle: "Self-hosted PaaS",
    architecture: "Process Supervisor & Reverse-Proxy Infrastructure",
    desc: "Self-hosted developer platform that automates builds and deployments for frontend and backend applications from Git repositories. Features native GitHub integration, environment variable management, and real-time build logs via WebSockets.",
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

export const engineeringWins = [
  {
    title: "Multi-Tenant Database Sync",
    focus: "Database Scaling & Outbox Pattern",
    metric: "Timeout → 200-300ms",
    desc: "Designed and implemented a Transactional Outbox Pattern to solve runtime database query timeouts occurring at ~50k records in a multi-tenant setup. Introduced local outbox tables across tenant databases and engineered background workers to sync records asynchronously into a centralized read database. Scaled system past 350k+ records with queries resolving in 200-300ms.",
  },
  {
    title: "Hybrid API Encryption Protocol",
    focus: "Security & Performance Engineering",
    metric: "RSA-2048 & AES-256-GCM",
    desc: "Designed and deployed a hybrid cryptographic exchange protocol for securing API payloads. Utilized RSA for asymmetric, secure dynamic session key exchange and AES for symmetric high-performance payload encryption. Optimized execution overhead to balance defense-in-depth security with high throughput requirements.",
  },
];

export const workExperience = [
  {
    organization: "Netclues",
    roles: [
      {
        title: "Full-Stack Software Engineer",
        startDate: "2024-09-01",
        endDate: "Present",
        highlights: [
          {
            title: "eGov Workflow Engine",
            desc: "Designed and built a state-machine driven multi-step workflow engine for a centralized eGov portal. Engineered dynamic department onboarding and metadata-driven service creation with parallel approval branching, conditional routing, and SLA tracking.",
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
    items: ["TypeScript", "Javascript", "React", "Next.js", "Node.js", "Express.js"],
  },
  {
    category: "Data, ORMs & Queues",
    items: ["PostgreSQL", "MySQL", "Prisma", "Sequelize", "Redis", "BullMQ"],
  },
  {
    category: "Real-time & Infrastructure",
    items: ["Docker", "WebRTC", "WebSockets", "WebAuthn", "Bun", "Nginx", "Cloudflare"],
  },
];

export const socialLinks = [
  { name: "GitHub", url: "https://github.com/thakurdotdev" },
  { name: "LinkedIn", url: "https://linkedin.com/in/thakurdotdev" },
  { name: "X", url: "https://x.com/thakurdotdev" },
];

