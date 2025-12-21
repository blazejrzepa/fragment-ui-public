/**
 * Runtime Manifest Types
 * 
 * Defines the structure of the runtime manifest JSON that provides
 * a unified contract between generator, bundler, iframe, and UI editor.
 */

export interface RuntimeManifest {
  /**
   * Version of the manifest schema
   */
  version: string;
  
  /**
   * Timestamp when manifest was generated
   */
  generatedAt: string;
  
  /**
   * Dependency versions used in the runtime
   */
  dependencies: {
    react: string;
    "react-dom": string;
    [key: string]: string;
  };
  
  /**
   * Import map entries for ESM modules
   * Maps module specifiers to URLs or paths
   */
  importmap: {
    imports: Record<string, string>;
    scopes?: Record<string, Record<string, string>>;
  };
  
  /**
   * CSS bundle paths
   */
  css: {
    /**
     * Main CSS bundle path (tokens + UI styles)
     */
    bundle: string;
    /**
     * Vendor CSS paths (e.g., react-day-picker)
     */
    vendor?: string[];
  };
  
  /**
   * Feature flags
   */
  features: {
    /**
     * Enable/disable accessibility checks
     */
    a11y: boolean;
    /**
     * Enable/disable development mode features
     */
    devMode: boolean;
    /**
     * Enable/disable telemetry
     */
    telemetry: boolean;
  };
  
  /**
   * API endpoints
   */
  endpoints: {
    bundle: string;
    "bundle-blocks": string;
    "bundle-css": string;
    "runtime-manifest": string;
  };
}

