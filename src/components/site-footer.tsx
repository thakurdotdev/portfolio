import { personalInfo } from "@/constants";

export function SiteFooter() {
  return (
    <footer className="px-4 pb-10 sm:px-6">
      <div className="mx-auto max-w-[1180px]">
        <div className="hairline-glow" />
        <div className="flex flex-col gap-2 pt-6 text-sm text-muted-dim sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {personalInfo.name}
          </p>
          <p>Served from the same server as everything above.</p>
        </div>
      </div>
    </footer>
  );
}
