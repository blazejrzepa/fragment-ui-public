import { installComponent } from "./install-component.js";

export async function addComponent(
  componentName: string,
  projectPath?: string,
  options?: { overwrite?: boolean }
) {
  await installComponent(componentName, projectPath, undefined, options);
}

