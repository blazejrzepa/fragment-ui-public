/**
 * Tests for Promotion System (PR-bot)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { promoteSubmission } from "../promote";
import type { Submission } from "../types";
import * as githubUtils from "@/lib/github-utils";
import * as fs from "node:fs/promises";

// Mock dependencies
vi.mock("@/lib/github-utils");
vi.mock("node:fs/promises");

describe("Promotion System", () => {
  const mockSubmission: Submission = {
    id: "test-submission-123",
    type: "component",
    dsl: {
      type: "form",
      fields: [],
    },
    tsx: `export default function TestButton() {
      return <button>Click me</button>;
    }`,
    status: "verified",
    author: "test-author",
    createdAt: new Date().toISOString(),
    result: {
      lint: { errors: 0, warnings: 0, issues: [] },
      a11y: { violations: 0, issues: [] },
      tokens: { violations: 0, issues: [] },
      figma: { coverage: 100, missing: [] },
      score: 95,
      suggestions: [],
    },
  };

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Mock environment variables
    process.env.GITHUB_TOKEN = "test-token";
    process.env.GITHUB_REPO = "test-owner/test-repo";
    process.env.GITHUB_BRANCH = "main";
  });

  afterEach(() => {
    delete process.env.GITHUB_TOKEN;
    delete process.env.GITHUB_REPO;
    delete process.env.GITHUB_BRANCH;
  });

  describe("promoteSubmission", () => {
    it("should throw error when GitHub config is missing", async () => {
      delete process.env.GITHUB_TOKEN;
      delete process.env.GITHUB_REPO;

      await expect(promoteSubmission(mockSubmission)).rejects.toThrow(
        "GitHub configuration missing"
      );
    });

    it("should throw error when GITHUB_REPO format is invalid", async () => {
      process.env.GITHUB_REPO = "invalid-format";

      await expect(promoteSubmission(mockSubmission)).rejects.toThrow(
        "Invalid GITHUB_REPO format"
      );
    });

    it("should extract component name from TSX code", async () => {
      const mockCreatePR = vi.fn().mockResolvedValue({
        url: "https://github.com/test-owner/test-repo/pull/1",
        number: 1,
      });

      vi.mocked(githubUtils.createPullRequest).mockImplementation(mockCreatePR);
      vi.mocked(fs.readFile).mockRejectedValue(new Error("File not found")); // Registry doesn't exist

      const result = await promoteSubmission(mockSubmission);

      expect(mockCreatePR).toHaveBeenCalled();
      const callArgs = mockCreatePR.mock.calls[0];
      expect(callArgs[1].files).toBeDefined();
      expect(callArgs[1].files[0].path).toContain("testbutton.tsx");
      expect(result.prUrl).toBeDefined();
    });

    it("should create PR with correct branch name", async () => {
      const mockCreatePR = vi.fn().mockResolvedValue({
        url: "https://github.com/test-owner/test-repo/pull/1",
        number: 1,
      });

      vi.mocked(githubUtils.createPullRequest).mockImplementation(mockCreatePR);
      vi.mocked(fs.readFile).mockRejectedValue(new Error("File not found"));

      await promoteSubmission(mockSubmission);

      expect(mockCreatePR).toHaveBeenCalled();
      const callArgs = mockCreatePR.mock.calls[0];
      expect(callArgs[1].head).toBe("feat/submission-test-sub");
    });

    it("should include component file in PR", async () => {
      const mockCreatePR = vi.fn().mockResolvedValue({
        url: "https://github.com/test-owner/test-repo/pull/1",
        number: 1,
      });

      vi.mocked(githubUtils.createPullRequest).mockImplementation(mockCreatePR);
      vi.mocked(fs.readFile).mockRejectedValue(new Error("File not found"));

      await promoteSubmission(mockSubmission);

      const callArgs = mockCreatePR.mock.calls[0];
      const files = callArgs[1].files;
      
      expect(files.length).toBeGreaterThan(0);
      expect(files[0].path).toContain("packages/ui/src");
      expect(files[0].content).toBe(mockSubmission.tsx);
    });

    it("should include story file if provided", async () => {
      const submissionWithStory = {
        ...mockSubmission,
        stories: `export default {
          title: "TestButton",
          component: TestButton,
        };`,
      };

      const mockCreatePR = vi.fn().mockResolvedValue({
        url: "https://github.com/test-owner/test-repo/pull/1",
        number: 1,
      });

      vi.mocked(githubUtils.createPullRequest).mockImplementation(mockCreatePR);
      vi.mocked(fs.readFile).mockRejectedValue(new Error("File not found"));

      await promoteSubmission(submissionWithStory);

      const callArgs = mockCreatePR.mock.calls[0];
      const files = callArgs[1].files;
      
      expect(files.length).toBeGreaterThan(1);
      const storyFile = files.find((f: any) => f.path.includes(".stories.tsx"));
      expect(storyFile).toBeDefined();
      expect(storyFile.content).toBe(submissionWithStory.stories);
    });

    it("should include registry update if registry exists", async () => {
      const mockRegistry = JSON.stringify([
        { name: "ExistingComponent", type: "component" },
      ]);

      const mockCreatePR = vi.fn().mockResolvedValue({
        url: "https://github.com/test-owner/test-repo/pull/1",
        number: 1,
      });

      vi.mocked(githubUtils.createPullRequest).mockImplementation(mockCreatePR);
      vi.mocked(fs.readFile).mockResolvedValue(mockRegistry);

      await promoteSubmission(mockSubmission);

      const callArgs = mockCreatePR.mock.calls[0];
      const files = callArgs[1].files;
      
      const registryFile = files.find((f: any) =>
        f.path.includes("registry.json")
      );
      expect(registryFile).toBeDefined();
      const updatedRegistry = JSON.parse(registryFile.content);
      expect(Array.isArray(updatedRegistry)).toBe(true);
      expect(updatedRegistry.length).toBeGreaterThan(1);
    });

    it("should generate PR body with verification report", async () => {
      const mockCreatePR = vi.fn().mockResolvedValue({
        url: "https://github.com/test-owner/test-repo/pull/1",
        number: 1,
      });

      vi.mocked(githubUtils.createPullRequest).mockImplementation(mockCreatePR);
      vi.mocked(fs.readFile).mockRejectedValue(new Error("File not found"));

      await promoteSubmission(mockSubmission);

      const callArgs = mockCreatePR.mock.calls[0];
      const prBody = callArgs[1].body;
      
      expect(prBody).toContain("Verification Report");
      expect(prBody).toContain("95/100"); // Score is formatted with markdown
      expect(prBody).toContain("Lint");
      expect(prBody).toContain("Accessibility");
      expect(prBody).toContain("Design Tokens");
      expect(prBody).toContain("Figma Parity");
    });

    it("should handle different submission types correctly", async () => {
      const blockSubmission: Submission = {
        ...mockSubmission,
        type: "block",
        tsx: `export default function TestBlock() {
          return <div>Block content</div>;
        }`,
      };

      const mockCreatePR = vi.fn().mockResolvedValue({
        url: "https://github.com/test-owner/test-repo/pull/1",
        number: 1,
      });

      vi.mocked(githubUtils.createPullRequest).mockImplementation(mockCreatePR);
      vi.mocked(fs.readFile).mockRejectedValue(new Error("File not found"));

      await promoteSubmission(blockSubmission);

      const callArgs = mockCreatePR.mock.calls[0];
      const files = callArgs[1].files;
      
      expect(files[0].path).toContain("packages/blocks/src");
    });

    it("should return PR URL and number", async () => {
      const mockCreatePR = vi.fn().mockResolvedValue({
        url: "https://github.com/test-owner/test-repo/pull/42",
        number: 42,
      });

      vi.mocked(githubUtils.createPullRequest).mockImplementation(mockCreatePR);
      vi.mocked(fs.readFile).mockRejectedValue(new Error("File not found"));

      const result = await promoteSubmission(mockSubmission);

      expect(result.prUrl).toBe("https://github.com/test-owner/test-repo/pull/42");
      expect(result.prNumber).toBe(42);
    });

    it("should handle registry read errors gracefully", async () => {
      const mockCreatePR = vi.fn().mockResolvedValue({
        url: "https://github.com/test-owner/test-repo/pull/1",
        number: 1,
      });

      vi.mocked(githubUtils.createPullRequest).mockImplementation(mockCreatePR);
      vi.mocked(fs.readFile).mockRejectedValue(new Error("Permission denied"));

      // Should not throw, just skip registry update
      const result = await promoteSubmission(mockSubmission);

      expect(result.prUrl).toBeDefined();
      expect(mockCreatePR).toHaveBeenCalled();
    });

    it("should generate correct PR title", async () => {
      const mockCreatePR = vi.fn().mockResolvedValue({
        url: "https://github.com/test-owner/test-repo/pull/1",
        number: 1,
      });

      vi.mocked(githubUtils.createPullRequest).mockImplementation(mockCreatePR);
      vi.mocked(fs.readFile).mockRejectedValue(new Error("File not found"));

      await promoteSubmission(mockSubmission);

      const callArgs = mockCreatePR.mock.calls[0];
      const prTitle = callArgs[1].title;
      
      expect(prTitle).toContain("feat:");
      expect(prTitle).toContain("component");
      expect(prTitle).toContain("TestButton");
      expect(prTitle).toContain("test-sub");
    });
  });
});

