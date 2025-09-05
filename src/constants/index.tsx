export const projects = [
    {
      title: "SyncVibe (Web)",
      desc: "Social music platform where strangers bond over questionable playlists. Real-time rooms, chat, and passkey login.",
      repo: "https://github.com/thakurdotdev/syncvibe",
      live: "https://syncvibe.xyz",
      tech: ["React", "Socket.IO", "PostgreSQL", "Express", "WebRTC"]
    },
    {
      title: "Tune",
      desc: "Yet another music player, but this one actually remembers where you left off. Built with Next.js + TanStack Query.",
      repo: "https://github.com/thakurdotdev/tune",
      live: "https://tune.thakur.dev",
      tech: ["Next.js", "TanStack Query", "TypeScript", "Vercel"]
    },
  ];

  export const socialLinks = [
    { name: "GitHub", url: "https://github.com/thakurdotdev" },
    { name: "LinkedIn", url: "https://linkedin.com/in/thakurdotdev" },
    { name: "X", url: "https://x.com/thakurdotdev" },
    { name: "Email", url: "mailto:pankaj@thakur.dev" }
  ];

  // JSON-LD structured data for SEO
  export const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Pankaj Thakur",
    "jobTitle": "Full-Stack Developer",
    "description": "Full-stack developer specializing in React, Node.js, and modern web technologies",
    "url": "https://thakur.dev",
    "email": "pankaj@thakur.dev",
    "worksFor": {
      "@type": "Organization",
      "name": "Netclues India"
    },
    "knowsAbout": [
      "React", "Node.js", "Express", "MySQL", "Socket.IO", "Next.js", 
      "TypeScript", "PostgreSQL", "WebRTC", "TanStack Query", "Vercel"
    ],
    "sameAs": [
      "https://github.com/thakurdotdev",
      "https://linkedin.com/in/thakurdotdev",
      "https://x.com/thakurdotdev"
    ]
  };