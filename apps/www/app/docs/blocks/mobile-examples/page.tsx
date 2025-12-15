"use client";

import {
  NavigationHeader,
  FormContainer,
  DashboardLayout,
  AuthenticationBlock,
  PricingTable,
} from "@fragment_ui/blocks";
import { Button, Input, Checkbox, RadioGroup, Radio, Switch, DocumentContent } from "@fragment_ui/ui";
import { useState } from "react";

export default function MobileExamplesPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("free");

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="mobile-examples" className="text-3xl font-medium mb-4">Mobile Block Examples</h1>
      </div>
      <p className="mb-6 intro-text">
        This page showcases mobile-first examples of Fragment UI blocks. These examples demonstrate
        how blocks adapt to smaller screens and provide optimal user experience on mobile devices.
      </p>

      <h2 id="mobile-navigation">Mobile Navigation</h2>
      <p>
        The NavigationHeader block automatically adapts to mobile screens with a hamburger menu and
        responsive layout.
      </p>
      <div className="border border-[color:var(--color-border-base)] rounded-lg overflow-hidden my-6">
        <div className="max-w-md mx-auto">
          <NavigationHeader
            logoText="Mobile App"
            links={[
              { href: "#home", label: "Home" },
              { href: "#features", label: "Features" },
              { href: "#about", label: "About" },
            ]}
            mobileMenu={true}
          />
          <div className="p-4 bg-[color:var(--color-surface-1)]">
            <p className="text-sm text-[color:var(--color-fg-muted)]">
              On mobile, the navigation collapses into a hamburger menu. Click the menu icon to see
              the mobile menu.
            </p>
          </div>
        </div>
      </div>

      <h2 id="mobile-forms">Mobile Form Layout</h2>
      <p>
        Forms are optimized for mobile with full-width inputs, larger touch targets, and
        vertical stacking.
      </p>
      <div className="border border-[color:var(--color-border-base)] rounded-lg overflow-hidden my-6">
        <div className="max-w-md mx-auto">
          <FormContainer
            title="Mobile Form"
            description="Optimized for mobile devices"
            onSubmit={(data) => {
              console.log("Form submitted", data);
            }}
          >
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" defaultChecked />
                  <label htmlFor="remember" className="text-sm">Remember me</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="newsletter" />
                  <label htmlFor="newsletter" className="text-sm">Subscribe to newsletter</label>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notification Preferences</label>
                <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                  <Radio value="email" label="Email notifications" />
                  <Radio value="push" label="Push notifications" />
                  <Radio value="none" label="No notifications" />
                </RadioGroup>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="dark-mode" defaultChecked />
                <label htmlFor="dark-mode" className="text-sm">Enable dark mode</label>
              </div>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </div>
          </FormContainer>
        </div>
      </div>

      <h2 id="mobile-authentication">Mobile Authentication</h2>
      <p>
        Authentication blocks are optimized for mobile with touch-friendly buttons and simplified
        layouts.
      </p>
      <div className="border border-[color:var(--color-border-base)] rounded-lg overflow-hidden my-6">
        <div className="max-w-md mx-auto">
          <AuthenticationBlock
            mode="login"
            onSubmit={(data) => console.log("Login:", data)}
            showSocialLogin={true}
          />
        </div>
      </div>

      <h2 id="mobile-pricing">Mobile Pricing Table</h2>
      <p>
        Pricing tables stack vertically on mobile, making it easy to compare plans by scrolling.
      </p>
      <div className="border border-[color:var(--color-border-base)] rounded-lg overflow-hidden my-6">
        <div className="max-w-md mx-auto p-4">
          <PricingTable
            tiers={[
              {
                name: "Free",
                price: "$0",
                pricePeriod: "month",
                features: [
                  { name: "10 projects" },
                  { name: "Basic support" },
                  { name: "Community access" },
                ],
                ctaText: "Get Started",
                ctaOnClick: () => {},
              },
              {
                name: "Pro",
                price: "$29",
                pricePeriod: "month",
                popular: true,
                features: [
                  { name: "Unlimited projects" },
                  { name: "Priority support" },
                  { name: "Advanced features" },
                ],
                ctaText: "Start Free Trial",
                ctaOnClick: () => {},
              },
              {
                name: "Enterprise",
                price: "$99",
                pricePeriod: "month",
                features: [
                  { name: "Everything in Pro" },
                  { name: "Dedicated support" },
                  { name: "Custom integrations" },
                ],
                ctaText: "Contact Sales",
                ctaOnClick: () => {},
              },
            ]}
          />
        </div>
      </div>

      <h2 id="mobile-dashboard">Mobile Dashboard</h2>
      <p>
        Dashboards adapt to mobile with collapsible sidebars, stacked cards, and touch-optimized
        interactions.
      </p>
      <div className="border border-[color:var(--color-border-base)] rounded-lg overflow-hidden my-6">
        <div className="max-w-md mx-auto">
          <div className="p-4 bg-[color:var(--color-surface-1)]">
            <h3 className="text-lg font-semibold mb-2">Mobile Dashboard</h3>
            <p className="text-sm text-[color:var(--color-fg-muted)] mb-4">
              On mobile, the sidebar collapses into a drawer menu. Cards stack vertically for easy
              scrolling.
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-[color:var(--color-surface-2)] rounded-lg">
                <div className="text-sm font-medium mb-1">Total Users</div>
                <div className="text-2xl font-bold">1,234</div>
              </div>
              <div className="p-4 bg-[color:var(--color-surface-2)] rounded-lg">
                <div className="text-sm font-medium mb-1">Active Sessions</div>
                <div className="text-2xl font-bold">456</div>
              </div>
              <div className="p-4 bg-[color:var(--color-surface-2)] rounded-lg">
                <div className="text-sm font-medium mb-1">Revenue</div>
                <div className="text-2xl font-bold">$12,345</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 id="best-practices">Mobile Best Practices</h2>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>
          <strong>Touch Targets:</strong> Ensure buttons and interactive elements are at least 44x44
          pixels for easy tapping
        </li>
        <li>
          <strong>Vertical Stacking:</strong> Stack form fields and content vertically on mobile for
          better readability
        </li>
        <li>
          <strong>Full-Width Inputs:</strong> Use full-width inputs on mobile to maximize space and
          improve usability
        </li>
        <li>
          <strong>Collapsible Navigation:</strong> Use hamburger menus or drawer navigation for
          mobile screens
        </li>
        <li>
          <strong>Simplified Layouts:</strong> Reduce visual complexity on mobile by hiding
          secondary content
        </li>
        <li>
          <strong>Responsive Typography:</strong> Use appropriate font sizes for mobile (14-16px for
          body text)
        </li>
        <li>
          <strong>Spacing:</strong> Use adequate spacing between elements (16px minimum) for
          comfortable touch interaction
        </li>
      </ul>

      <h2 id="responsive-breakpoints">Responsive Breakpoints</h2>
      <p>Fragment UI uses standard breakpoints for responsive design:</p>
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border border-[color:var(--color-border-base)]">
          <thead>
            <tr>
              <th className="border border-[color:var(--color-border-base)] px-4 py-2 text-left">
                Breakpoint
              </th>
              <th className="border border-[color:var(--color-border-base)] px-4 py-2 text-left">
                Min Width
              </th>
              <th className="border border-[color:var(--color-border-base)] px-4 py-2 text-left">
                Usage
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-[color:var(--color-border-base)] px-4 py-2">Mobile</td>
              <td className="border border-[color:var(--color-border-base)] px-4 py-2">
                0px
              </td>
              <td className="border border-[color:var(--color-border-base)] px-4 py-2">
                Default, mobile-first
              </td>
            </tr>
            <tr>
              <td className="border border-[color:var(--color-border-base)] px-4 py-2">Tablet</td>
              <td className="border border-[color:var(--color-border-base)] px-4 py-2">
                768px (md)
              </td>
              <td className="border border-[color:var(--color-border-base)] px-4 py-2">
                Medium screens
              </td>
            </tr>
            <tr>
              <td className="border border-[color:var(--color-border-base)] px-4 py-2">
                Desktop
              </td>
              <td className="border border-[color:var(--color-border-base)] px-4 py-2">
                1024px (lg)
              </td>
              <td className="border border-[color:var(--color-border-base)] px-4 py-2">
                Large screens
              </td>
            </tr>
            <tr>
              <td className="border border-[color:var(--color-border-base)] px-4 py-2">
                Large Desktop
              </td>
              <td className="border border-[color:var(--color-border-base)] px-4 py-2">
                1280px (xl)
              </td>
              <td className="border border-[color:var(--color-border-base)] px-4 py-2">
                Extra large screens
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </DocumentContent>
  );
}

