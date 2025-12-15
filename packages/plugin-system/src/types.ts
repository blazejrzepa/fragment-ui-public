/**
 * Plugin System Types
 * 
 * Core types for Fragment UI plugin system
 */

export interface PluginManifest {
  /** Unique plugin identifier */
  id: string;
  /** Plugin name */
  name: string;
  /** Plugin version */
  version: string;
  /** Plugin description */
  description?: string;
  /** Plugin author */
  author?: string;
  /** Plugin entry point */
  entry: string;
  /** Plugin capabilities */
  capabilities?: PluginCapabilities;
  /** Plugin dependencies */
  dependencies?: Record<string, string>;
}

export interface PluginCapabilities {
  /** Can generate components */
  componentGenerator?: boolean;
  /** Can modify themes */
  themePlugin?: boolean;
  /** Can integrate with external tools */
  integration?: boolean;
  /** Custom capabilities */
  custom?: string[];
}

export interface PluginContext {
  /** Registry access */
  registry: any;
  /** Logger */
  logger: PluginLogger;
  /** File system utilities */
  fs: PluginFileSystem;
  /** Configuration */
  config: Record<string, any>;
}

export interface PluginLogger {
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
}

export interface PluginFileSystem {
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
  exists(path: string): Promise<boolean>;
  mkdir(path: string, recursive?: boolean): Promise<void>;
}

/**
 * Base plugin interface
 */
export interface Plugin {
  /** Plugin manifest */
  manifest: PluginManifest;
  /** Initialize plugin */
  initialize(context: PluginContext): Promise<void>;
  /** Cleanup plugin */
  cleanup?(): Promise<void>;
}

/**
 * Component Generator Plugin
 */
export interface ComponentGeneratorPlugin extends Plugin {
  /** Generate component code */
  generateComponent(options: ComponentGeneratorOptions): Promise<ComponentGeneratorResult>;
  /** Get available templates */
  getTemplates?(): Promise<string[]>;
}

export interface ComponentGeneratorOptions {
  /** Component name */
  name: string;
  /** Component type */
  type?: "ui" | "block";
  /** Template to use */
  template?: string;
  /** Additional options */
  options?: Record<string, any>;
}

export interface ComponentGeneratorResult {
  /** Generated files */
  files: GeneratedFile[];
  /** Dependencies to install */
  dependencies?: string[];
  /** Post-install instructions */
  instructions?: string[];
}

export interface GeneratedFile {
  /** File path */
  path: string;
  /** File content */
  content: string;
  /** File type */
  type?: "component" | "test" | "story" | "types" | "other";
}

/**
 * Theme Plugin
 */
export interface ThemePlugin extends Plugin {
  /** Transform theme */
  transformTheme(theme: any, options?: ThemeTransformOptions): Promise<any>;
  /** Get theme presets */
  getPresets?(): Promise<ThemePreset[]>;
}

export interface ThemeTransformOptions {
  /** Target format */
  format?: "css" | "js" | "json";
  /** Additional options */
  options?: Record<string, any>;
}

export interface ThemePreset {
  /** Preset name */
  name: string;
  /** Preset description */
  description?: string;
  /** Preset theme data */
  theme: any;
}

/**
 * Integration Plugin
 */
export interface IntegrationPlugin extends Plugin {
  /** Execute integration action */
  execute(action: string, options?: Record<string, any>): Promise<any>;
  /** Get available actions */
  getActions?(): Promise<string[]>;
}

