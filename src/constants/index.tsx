import type { StaticImageData } from "next/image";
import pm0Shot from "@/assets/projects/pm0.png";
import shipyardShot from "@/assets/projects/shipyard.png";
import syncvibeShot from "@/assets/projects/syncvibe.png";
import tunlShot from "@/assets/projects/tunl.png";

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
  /**
   * Imported, not linked by path: the build gives each file a content-hashed URL, so an
   * updated screenshot is never stuck behind the site's year-long image cache.
   */
  image: StaticImageData;
  /** Up to two extra screens, shown on the sheets behind the main screenshot. */
  screens?: string[];
  /** Brand color for the card stage and glow. */
  accent: string;
  /** Crops empty margins in the screenshot. 1 = off. */
  zoom?: number;
  /** Two or three short, verifiable facts shown as chips on the work tile. */
  facts: string[];
  /** The shape the dots take while this project is on screen (see components/world/shaders.ts). */
  scene: "tunnel" | "supervisor" | "wave" | "pipeline";
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
    image: tunlShot,
    accent: "#22c55e",
    facts: ["No client install", "Live request inspector", "Custom domains"],
    zoom: 1.1,
    scene: "tunnel",
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
    image: pm0Shot,
    accent: "#ef4444",
    facts: ["~16 MB idle daemon", "77% less memory than PM2", "Sub-40 ms status"],
    zoom: 1,
    scene: "supervisor",
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
    image: syncvibeShot,
    accent: "#ec4899",
    facts: ["Synced playback", "WebRTC video calls", "Passkey sign-in"],
    zoom: 1,
    scene: "wave",
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
    image: shipyardShot,
    accent: "#14b8a6",
    facts: ["Deploys from Git", "Live build logs", "GitHub integration"],
    zoom: 1,
    scene: "pipeline",
  },
];

export const engineeringWins = [
  {
    title: "Multi-tenant database sync",
    focus: "Database Scaling & Outbox Pattern",
    metric: "Timeout to 200–300 ms",
    desc: "Queries across tenant databases began timing out at around 50,000 records. I added an outbox table to each tenant database and background workers that copy changes into one central read database. The same queries now return in 200 to 300 ms at more than 350,000 records.",
  },
  {
    title: "Hybrid API encryption",
    focus: "Security & Performance Engineering",
    metric: "RSA-2048 + AES-256-GCM",
    desc: "API payloads are encrypted end to end. RSA exchanges a fresh session key for each session, and AES-GCM encrypts the payloads with it, which keeps the per-request overhead low.",
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

/*
 * The experience section, as short chapters. Each one is drawn as a dot simulation of the
 * work itself (see components/world/shaders.ts). The full notes stay in workExperience.
 */
export interface ExperienceChapter {
  id: string;
  scene: "workflow" | "outbox" | "encrypt" | "screen" | "chat";
  /** Name in the scene rail. */
  label: string;
  role: string;
  context: string;
  /** Plain words: what it is. */
  headline: string;
  /** One or two sentences: what I did. */
  body: string;
  /** Three short, concrete pieces or results, shown on hairlines like the project facts. */
  facts: string[];
  link?: { href: string; text: string };
}

export const experienceChapters: ExperienceChapter[] = [
  {
    id: "workflows",
    scene: "workflow",
    label: "Workflows",
    role: "Engineer",
    context: "ECCB complaint portal",
    headline: "Complaint portal for a central bank",
    body: "I led the architecture and built both the customer and admin portals for the Eastern Caribbean Central Bank's Office of Financial Conduct.",
    facts: ["Complaint intake and case management", "Auto-assignment by channel and progress", "Escalation workflows"],
  },
  {
    id: "outbox",
    scene: "outbox",
    label: "Outbox",
    role: "Engineer",
    context: "Multi-tenant database sync",
    headline: "Timeouts to 200–300 ms",
    body: "Queries across tenant databases were timing out at around 50,000 records. I added an outbox to each tenant database and workers that copy its changes into one central read database.",
    facts: ["Transactional outbox", "Central read database", "200–300 ms at 350K records"],
  },
  {
    id: "encryption",
    scene: "encrypt",
    label: "Encryption",
    role: "Engineer",
    context: "API security",
    headline: "Encrypted API traffic",
    body: "I secured API requests and responses with hybrid encryption: RSA exchanges a fresh key for each session, and AES-GCM encrypts the payloads with it.",
    facts: ["RSA-2048 key exchange", "AES-256-GCM payloads", "A fresh key per session"],
  },
  {
    id: "risk",
    scene: "screen",
    label: "KYC / AML",
    role: "Engineer",
    context: "Risk platform for CWJCU",
    headline: "Risk platform for a credit union",
    body: "I delivered a client-facing risk management platform for CWJCU, and built the backend gateways for KYC/AML checks and other third-party services.",
    facts: ["Risk management workflows", "KYC/AML gateways", "Third-party integrations"],
    link: {
      href: "https://www.linkedin.com/posts/thakurdotdev_clienttestimonial-netclues-fintech-activity-7457841848527622144-h7oe",
      text: "Read the client's note on LinkedIn",
    },
  },
  {
    id: "chat",
    scene: "chat",
    label: "Chat",
    role: "Intern",
    context: "Socket.IO chat service",
    headline: "Real-time chat, as an intern",
    body: "My first project at Netclues: a chat microservice built with Socket.IO, Node.js and React.",
    facts: ["One-to-one and group chats", "Image and PDF sharing", "Typing, read receipts, presence"],
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

