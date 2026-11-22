import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false },
};

/*
 * Served by nginx for any address that does not exist (`error_page 404 /404.html`). Same
 * type and tokens as the page, none of the motion: it has one job, which is to get you back.
 */
export default function NotFound() {
  return (
    <main className="page-w flex min-h-[100svh] flex-col justify-between px-5 py-6 sm:px-8 sm:py-8 lg:px-12">
      <a href="/" className="flex w-fit items-center gap-2.5 py-2.5 text-body font-semibold tracking-[-0.01em]">
        <span className="dot" aria-hidden="true" />
        Pankaj Thakur
      </a>

      <div>
        <p className="text-label font-mono text-muted">
          <span className="text-fg">$</span> pm0 ls <span className="text-dim">this-page</span>
        </p>
        <h1 className="display display-xl mt-4 -ml-[0.05em]">Nothing runs here.</h1>
        <p className="lead mt-5 max-w-[36ch] text-muted">
          The address may be mistyped, or the page has moved. Everything on this site lives on one page.
        </p>
        <p className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-body">
          <a href="/" className="link">
            Back to the homepage
          </a>
          <a href="/#work" className="link">
            See the projects
          </a>
        </p>
      </div>

      <p className="border-t border-line pt-5 text-label font-mono text-dim">404</p>
    </main>
  );
}
