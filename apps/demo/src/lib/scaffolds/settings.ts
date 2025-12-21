/**
 * Settings page scaffold
 * 
 * Generates a settings page with form sections for user preferences
 */

import type { UiPage, UiSection, UiComponent } from "@fragment_ui/ui-dsl";

/**
 * Generate UUID v4
 */
function randomUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Create settings page scaffold
 */
export function createSettingsScaffold(params?: {
  title?: string;
  sections?: string[];
}): UiPage {
  const {
    title = "Settings",
    sections: requestedSections = ["profile", "preferences", "security", "notifications"],
  } = params || {};

  const pageId = randomUUID();
  const sections: UiSection[] = [];

  // Profile section
  if (requestedSections.includes("profile")) {
    const profileSection: UiSection = {
      type: "section",
      id: randomUUID(),
      variant: "card",
      title: "Profile",
      children: [
        {
          type: "component",
          id: randomUUID(),
          component: "Input",
          props: { label: "Name", placeholder: "Enter your name" },
        } as UiComponent,
        {
          type: "component",
          id: randomUUID(),
          component: "Input",
          props: { label: "Email", type: "email", placeholder: "Enter your email" },
        } as UiComponent,
        {
          type: "component",
          id: randomUUID(),
          component: "Button",
          variant: "default",
          copy: "Save Changes",
        } as UiComponent,
      ],
    };
    sections.push(profileSection);
  }

  // Preferences section
  if (requestedSections.includes("preferences")) {
    const preferencesSection: UiSection = {
      type: "section",
      id: randomUUID(),
      variant: "card",
      title: "Preferences",
      children: [
        {
          type: "component",
          id: randomUUID(),
          component: "Select",
          props: { label: "Language", options: ["English", "Spanish", "French"] },
        } as UiComponent,
        {
          type: "component",
          id: randomUUID(),
          component: "Select",
          props: { label: "Theme", options: ["Light", "Dark", "System"] },
        } as UiComponent,
        {
          type: "component",
          id: randomUUID(),
          component: "Button",
          variant: "default",
          copy: "Save Preferences",
        } as UiComponent,
      ],
    };
    sections.push(preferencesSection);
  }

  // Security section
  if (requestedSections.includes("security")) {
    const securitySection: UiSection = {
      type: "section",
      id: randomUUID(),
      variant: "card",
      title: "Security",
      children: [
        {
          type: "component",
          id: randomUUID(),
          component: "Input",
          props: { label: "Current Password", type: "password" },
        } as UiComponent,
        {
          type: "component",
          id: randomUUID(),
          component: "Input",
          props: { label: "New Password", type: "password" },
        } as UiComponent,
        {
          type: "component",
          id: randomUUID(),
          component: "Input",
          props: { label: "Confirm Password", type: "password" },
        } as UiComponent,
        {
          type: "component",
          id: randomUUID(),
          component: "Button",
          variant: "default",
          copy: "Update Password",
        } as UiComponent,
      ],
    };
    sections.push(securitySection);
  }

  // Notifications section
  if (requestedSections.includes("notifications")) {
    const notificationsSection: UiSection = {
      type: "section",
      id: randomUUID(),
      variant: "card",
      title: "Notifications",
      children: [
        {
          type: "component",
          id: randomUUID(),
          component: "Checkbox",
          props: { label: "Email notifications" },
        } as UiComponent,
        {
          type: "component",
          id: randomUUID(),
          component: "Checkbox",
          props: { label: "Push notifications" },
        } as UiComponent,
        {
          type: "component",
          id: randomUUID(),
          component: "Checkbox",
          props: { label: "SMS notifications" },
        } as UiComponent,
        {
          type: "component",
          id: randomUUID(),
          component: "Button",
          variant: "default",
          copy: "Save Notification Settings",
        } as UiComponent,
      ],
    };
    sections.push(notificationsSection);
  }

  return {
    type: "page",
    id: pageId,
    title,
    children: sections,
    layout: {
      maxWidth: "lg",
      gap: 6,
    },
    metadata: {
      version: "1.0.0",
      generatedAt: new Date().toISOString(),
      source: "settings-scaffold",
    },
  };
}

