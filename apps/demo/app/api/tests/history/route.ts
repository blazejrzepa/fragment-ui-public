import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import type { TestHistoryEntry, ComponentTestHistory, TestCategory } from "@/types/quality";

const DATA_DIR = path.join(process.cwd(), "data", "quality");
const HISTORY_FILE = path.join(DATA_DIR, "history.json");

interface HistoryData {
  [component: string]: {
    [category: string]: TestHistoryEntry[];
  };
}

function loadHistory(): HistoryData {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const content = fs.readFileSync(HISTORY_FILE, "utf8");
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("[History] Error loading history:", error);
  }
  return {};
}

function saveHistory(data: HistoryData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("[History] Error saving history:", error);
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const component = searchParams.get("component");
    const category = searchParams.get("category");

    const history = loadHistory();

    if (component && category) {
      // Return history for specific component + category
      const entries = history[component]?.[category] || [];
      return NextResponse.json({
        component,
        category,
        entries: entries.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ),
      } as ComponentTestHistory);
    } else if (component) {
      // Return all categories for component
      const componentHistory = history[component] || {};
      const result: ComponentTestHistory[] = Object.entries(componentHistory).map(([cat, entries]) => ({
        component,
        category: cat as TestCategory,
        entries: (entries as TestHistoryEntry[]).sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ),
      }));
      return NextResponse.json(result);
    } else {
      // Return all history
      return NextResponse.json(history);
    }
  } catch (error) {
    console.error("[History] Error:", error);
    return NextResponse.json(
      { error: "Failed to load history" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { runId, component, category, status, passRate, totalTests, passedTests, failedTests, issues, commit, branch } = body;

    if (!component || !category) {
      return NextResponse.json(
        { error: "Component and category are required" },
        { status: 400 }
      );
    }

    const history = loadHistory();

    if (!history[component]) {
      history[component] = {};
    }
    if (!history[component][category]) {
      history[component][category] = [];
    }

    const entry: TestHistoryEntry = {
      runId: runId || `run-${Date.now()}`,
      timestamp: new Date().toISOString(),
      component,
      category,
      status,
      passRate: passRate || 0,
      totalTests: totalTests || 0,
      passedTests: passedTests || 0,
      failedTests: failedTests || 0,
      issues: issues || 0,
      commit,
      branch,
    };

    history[component][category].push(entry);

    // Keep only last 50 entries per component+category
    if (history[component][category].length > 50) {
      history[component][category] = history[component][category]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 50);
    }

    saveHistory(history);

    return NextResponse.json({ success: true, entry });
  } catch (error) {
    console.error("[History] Error saving:", error);
    return NextResponse.json(
      { error: "Failed to save history" },
      { status: 500 }
    );
  }
}

