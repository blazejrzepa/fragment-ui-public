declare module '@fragment_ui/registry/registry.json' {
  interface ComponentInfo {
    import?: string;
    props?: Record<string, any>;
    note?: string;
  }

  interface Registry {
    components: Record<string, ComponentInfo | string>;
  }

  const registry: Registry;
  export default registry;
}
