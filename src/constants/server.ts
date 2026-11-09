/*
 * A snapshot of `pm0 ls` on the server that hosts my projects (and this site).
 * Captured 2026-11-09. Only my own projects are listed; other apps are counted in `hidden`.
 * Refresh by running `pm0 ls` on the box and copying the rows.
 */

export interface ServerProcess {
  id: number;
  app: string;
  mode: "fork" | "cluster";
  port: string;
  pid: number;
  uptime: string;
  restarts: number;
  cpu: string;
  mem: string;
  /** Matches a project title in constants/index.tsx. */
  project: string;
}

export const serverSnapshot = {
  capturedOn: "Nov 9, 2026",
  host: "ubuntu@instance-20260702-0122",
  processes: [
    { id: 0, app: "control-api", mode: "fork", port: ":4010", pid: 1238472, uptime: "19h", restarts: 1, cpu: "0.1%", mem: "111.7mb", project: "ShipYard" },
    { id: 1, app: "deploy-engine", mode: "fork", port: ":4012", pid: 1024949, uptime: "1d", restarts: 0, cpu: "0.1%", mem: "67.1mb", project: "ShipYard" },
    { id: 2, app: "ui", mode: "fork", port: ":4013", pid: 1148330, uptime: "1d", restarts: 0, cpu: "0.0%", mem: "135.1mb", project: "ShipYard" },
    { id: 33, app: "pm0-site", mode: "fork", port: ":5000", pid: 4112299, uptime: "15d", restarts: 0, cpu: "0.0%", mem: "174.5mb", project: "pm0" },
    { id: 58, app: "tunl-control-plane", mode: "fork", port: ":3091", pid: 605041, uptime: "5d", restarts: 0, cpu: "0.1%", mem: "144.2mb", project: "Tunl" },
    { id: 59, app: "tunl-dashboard", mode: "fork", port: ":3090", pid: 1178462, uptime: "1d", restarts: 0, cpu: "0.0%", mem: "159.8mb", project: "Tunl" },
    { id: 60, app: "tunl-tunnel-server", mode: "fork", port: ":2222 (+2)", pid: 605043, uptime: "5d", restarts: 0, cpu: "0.1%", mem: "16.3mb", project: "Tunl" },
    { id: 77, app: "syncvibe-api", mode: "fork", port: ":4000", pid: 1072424, uptime: "1d", restarts: 0, cpu: "0.1%", mem: "174.5mb", project: "SyncVibe" },
  ] satisfies ServerProcess[],
  hidden: 6,
  totalOnline: 14,
  appUsage: { cpu: "0.5%", mem: "1340.8mb" },
  host_cpu: "2 cores (load: 0.02, 0.33, 0.35)",
  host_mem: { pct: 21.9, label: "21.9% (2.6 GB / 11.6 GB)" },
};

export const projectSlug = (title: string) => `project-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
