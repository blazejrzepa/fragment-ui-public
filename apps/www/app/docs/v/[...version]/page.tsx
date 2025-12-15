import { notFound, redirect } from "next/navigation";
import { getVersion, getCurrentVersion, VERSIONS } from "../../../../src/lib/versions";
import { DocLayout } from "../../../../src/components/doc-layout";
import { VersionedContentRenderer } from "../../../../src/components/versioned-content-renderer";
import { DocumentContent } from "@fragment_ui/ui";

interface PageProps {
  params: Promise<{
    version: string[];
  }>;
}

export default async function VersionedDocsPage({ params }: PageProps) {
  const { version } = await params;
  
  // Parse version from path
  // After middleware rewrite: /docs/v/0-9-0/changelog → version = ['0-9-0', 'changelog']
  // We need to convert dashes back to dots for the version
  
  if (!version || version.length === 0) {
    return notFound();
  }
  
  // Parse version and slug from segments
  // After middleware rewrite: version will be ['0-9-0', 'changelog'] (dots replaced with dashes)
  
  let versionString: string;
  let slug: string[] | undefined;
  
  // Check if first segment is version with dashes (from middleware rewrite)
  if (version[0] && /^\d+-\d+-\d+$/.test(version[0])) {
    // Middleware rewrote dots to dashes: '0-9-0' -> '0.9.0'
    versionString = version[0].replace(/-/g, '.');
    slug = version.length > 1 ? version.slice(1) : undefined;
  } else if (version[0] && version[0].includes('.')) {
    // Version is preserved with dots (fallback for direct access)
    versionString = version[0];
    slug = version.length > 1 ? version.slice(1) : undefined;
  } else {
    // Version was split by dots (e.g., ['0', '9', '0']) - fallback case
    // Reconstruct from numeric segments
    let versionSegments: string[] = [];
    let slugStartIndex = -1;
    
    for (let i = 0; i < version.length; i++) {
      const segment = version[i];
      if (/^\d+$/.test(segment)) {
        versionSegments.push(segment);
        // Stop after 3 segments (major.minor.patch)
        if (versionSegments.length === 3) {
          slugStartIndex = i + 1;
          break;
        }
      } else {
        slugStartIndex = i;
        break;
      }
    }
    
    if (versionSegments.length >= 2) {
      versionString = versionSegments.join('.');
      slug = slugStartIndex >= 0 ? version.slice(slugStartIndex) : undefined;
    } else {
      // Fallback: use first segment as-is
      versionString = version[0] || '';
      slug = version.length > 1 ? version.slice(1) : undefined;
    }
  }
  
  const versionInfo = getVersion(versionString);
  const currentVersion = getCurrentVersion();

  // If no version found, show 404
  if (!versionInfo) {
    return notFound();
  }

  // If version is current, redirect to non-versioned docs
  if (versionString === currentVersion.version) {
    const path = slug ? `/docs/${slug.join("/")}` : "/docs";
    redirect(path);
  }

  // Build the path for versioned content
  const docPath = slug ? slug.join("/") : "";

  return (
    <DocLayout version={versionString}>
      <div className="mb-6 p-4 rounded-lg border border-[color:var(--color-fg-muted)]/30 bg-[color:var(--color-surface-1)]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Documentation for v{versionString}
            </h1>
            <p className="text-[color:var(--color-fg-muted)]">
              {versionInfo.status === "deprecated" && (
                <span className="text-[color:var(--color-accent-red)] font-semibold">
                  ⚠️ This version is deprecated.{" "}
                </span>
              )}
              Released on {versionInfo.releaseDate}
            </p>
          </div>
          {versionInfo.status === "deprecated" && (
            <span className="px-3 py-1 rounded bg-[color:var(--color-accent-red)]/20 text-[color:var(--color-accent-red)] text-sm font-semibold">
              Deprecated
            </span>
          )}
        </div>
      </div>

      <DocumentContent as="div">
        {docPath ? (
          <VersionedContentRenderer version={versionString} path={slug || []} />
        ) : (
          <div>
            <h2>Version {versionString} Documentation</h2>
            <p>
              This is the documentation index for version {versionString}.
            </p>
            <div className="mt-6">
              <h3 id="available-sections">Available Sections</h3>
              <ul>
                <li>
                  <a
                    href={`/docs/v${versionString}/foundations/tokens`}
                    className="text-[color:var(--color-brand-primary)] hover:underline"
                  >
                    Foundations / Tokens
                  </a>
                </li>
                <li>
                  <a
                    href={`/docs/v${versionString}/components`}
                    className="text-[color:var(--color-brand-primary)] hover:underline"
                  >
                    Components
                  </a>
                </li>
                <li>
                  <a
                    href={`/docs/v${versionString}/changelog`}
                    className="text-[color:var(--color-brand-primary)] hover:underline"
                  >
                    Changelog
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}

        <div className="mt-8 p-6 rounded-lg bg-[color:var(--color-surface-1)] border border-[color:var(--color-fg-muted)]/30">
          <h3 id="about-this-version">About This Version</h3>
          {versionInfo.changelog && versionInfo.changelog.length > 0 && (
            <div className="mt-4">
              <h4 id={`whats-new-${versionString}`}>What&apos;s New:</h4>
              <ul>
                {versionInfo.changelog.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-4">
            <a
              href="/docs/changelog"
              className="text-[color:var(--color-brand-primary)] hover:underline"
            >
              View full changelog →
            </a>
          </div>
        </div>

        {versionString !== currentVersion.version && (
          <div className="mt-6 p-4 rounded-lg bg-[color:var(--color-brand-primary)]/10 border border-[color:var(--color-brand-primary)]/30">
            <p>
              <strong>Tip:</strong> You&apos;re viewing an older version.{" "}
              <a
                href={docPath ? `/docs/${docPath}` : "/docs"}
                className="text-[color:var(--color-brand-primary)] hover:underline font-semibold"
              >
                View current version ({currentVersion.version}) →
              </a>
            </p>
          </div>
        )}
      </DocumentContent>
    </DocLayout>
  );
}


