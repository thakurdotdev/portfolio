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

export interface Project {
  title: string;
  subtitle: string;
  architecture: string;
  /** Full description (use it in detail views or modals). */
  desc: string;
  /** Card copy: one or two lines, ~90 characters, outcome first. */
  blurb: string;
  /** Most important technologies first. The card shows the first three. */
  tech: string[];
  repo?: string;
  live?: string;
  demo?: string;
  image: string;
  /** Up to two extra screens, shown on the sheets behind the main screenshot. */
  screens?: string[];
  /** Brand color for the card stage and glow. */
  accent: string;
  /** Crops empty margins in the screenshot. 1 = off. */
  zoom?: number;
}

export const projects: Project[] = [
  {
    title: "Tunl",
    subtitle: "Zero-Install Reverse Tunneling Platform",
    architecture: "OpenSSH Remote Forwarding & Edge Proxy",
    desc: "Exposes localhost web servers, APIs, WebSockets, and webhooks to the public internet via a single command with automatic TLS termination and zero CLI installation. Supports Ed25519/RSA public key auth, persistent subdomains, and real-time HTTP traffic inspection.",
    blurb:
      "Share localhost with one command. Automatic TLS, subdomains and live traffic inspection.",
    tech: ["Golang", "OpenSSH", "Next.js", "TypeScript", "PostgreSQL", "Bun"],
    repo: "https://github.com/thakurdotdev/tunl",
    live: "https://tunl.online",
    image: "/projects/tunl.png",
    // screens: ["/projects/tunl-dashboard.png", "/projects/tunl-inspector.png"],
    accent: "#22c55e",
    zoom: 1.1,
  },
  {
    title: "pm0",
    subtitle: "Drop-in PM2-Compatible Process Supervisor",
    architecture: "Unix Socket IPC & Kernel-Level Process Supervisor",
    desc: "Drop-in PM2-compatible process supervisor in a single static Go binary. Delivers 77% less memory consumption, sub-40ms CLI execution at 500 apps, SO_REUSEPORT rolling reloads, and cgroup v2 tracking with zero runtime dependencies.",
    blurb: "A single-binary Go replacement for PM2 that uses 77% less memory.",
    tech: ["Go", "Linux Kernel", "cgroups v2", "Unix Sockets", "IPC", "CLI"],
    repo: "https://github.com/thakurdotdev/pm0",
    live: "https://pm0.thakur.dev",
    image: "/projects/pm0.png",
    accent: "#ef4444",
    zoom: 1,
  },
  {
    title: "SyncVibe",
    subtitle: "Real-time Social & Music Platform",
    architecture: "Distributed WebSockets & WebRTC Mesh",
    desc: "Real-time platform featuring synchronized multi-user audio playback, social feed & photo sharing, live chat, and low-latency WebRTC video calling. Authenticated securely via WebAuthn passkeys and 2FA, synchronizing state seamlessly across active clients.",
    blurb:
      "Listen together in real time with chat, photo sharing and WebRTC video calls.",
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
    image: "/projects/syncvibe.png",
    accent: "#ec4899",
    zoom: 1,
  },
  {
    title: "ShipYard",
    subtitle: "Self-hosted PaaS",
    architecture: "Process Supervisor & Reverse-Proxy Infrastructure",
    desc: "Self-hosted developer platform that automates builds and deployments for frontend and backend applications from Git repositories. Features native GitHub integration, environment variable management, and real-time build logs via WebSockets.",
    blurb:
      "Self-hosted deploys straight from Git, with live build logs and GitHub integration.",
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
    image: "/projects/shipyard.png",
    accent: "#14b8a6",
    zoom: 1,
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
    location: "India, on-site and hybrid",
    roles: [
      {
        title: "Full-Stack Software Engineer",
        startDate: "2024-09-01",
        endDate: "Present",
        highlights: [
          {
            title: "ECCB OFC Complaint Management Portal",
            desc: "Led architecture design and end-to-end development of customer and admin portals for the Eastern Caribbean Central Bank's Office of Financial Conduct. Built complaint submission, case management, and escalation workflows, including automated complaint assignment and routing based on case progress and submission channel.",
          },
          {
            title: "Risk Management Platform",
            desc: "Delivered a client-facing risk management project for CWJCU, supporting business-critical risk management workflows.",
            testimonial:
              "https://www.linkedin.com/posts/thakurdotdev_clienttestimonial-netclues-fintech-activity-7457841848527622144-h7oe",
          },
          {
            title: "Backend Performance",
            desc: "Implemented the transaction outbox pattern and centralized read-database architecture, achieving 200–300 ms latency in tests involving 350K records.",
          },
          {
            title: "API Security",
            desc: "Implemented hybrid RSA and AES encryption to secure API request-response communication.",
          },
          {
            title: "Backend Integrations",
            desc: "Developed backend gateways for KYC/AML workflows and third-party service integrations.",
          },
          {
            title: "Enterprise Architecture",
            desc: "Contributed to backend services, workflow orchestration, database architecture, and secure data handling for client-facing applications.",
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

