import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data", "quality");
const STATUS_FILE = path.join(DATA_DIR, "status.json");

interface TestStatus {
  component: string;
  category: string;
  status: "idle" | "running" | "completed" | "error";
  progress?: string;
  startedAt?: string;
  completedAt?: string;
}

interface StatusData {
  runId?: string;
  overallStatus: "idle" | "running" | "completed" | "error";
  startedAt?: string;
  completedAt?: string;
  tests: Record<string, TestStatus>; // key: "component:category"
}

function loadStatus(): StatusData {
  try {
    if (fs.existsSync(STATUS_FILE)) {
      const content = fs.readFileSync(STATUS_FILE, "utf8");
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("[Status] Error loading status:", error);
  }
  return {
    overallStatus: "idle",
    tests: {},
  };
}

function saveStatus(data: StatusData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STATUS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("[Status] Error saving status:", error);
  }
}

export async function GET() {
  try {
    const status = loadStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error("[Status] Error:", error);
    return NextResponse.json(
      { error: "Failed to load status" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, runId, component, category, status, progress } = body;

    const statusData = loadStatus();

    if (action === "start") {
      // Start a new test run
      statusData.runId = runId || `run-${Date.now()}`;
      statusData.overallStatus = "running";
      statusData.startedAt = new Date().toISOString();
      statusData.completedAt = undefined;
      statusData.tests = {};
      saveStatus(statusData);
      return NextResponse.json({ success: true, status: statusData });
    }

    if (action === "update") {
      // Update status for a specific component+category
      if (component && category) {
        const key = `${component}:${category}`;
        statusData.tests[key] = {
          component,
          category,
          status: status || "running",
          progress,
          startedAt: statusData.tests[key]?.startedAt || new Date().toISOString(),
          completedAt: status === "completed" || status === "error" ? new Date().toISOString() : undefined,
        };
        saveStatus(statusData);
        return NextResponse.json({ success: true, test: statusData.tests[key] });
      }
    }

    if (action === "complete") {
      // Mark entire run as completed
      statusData.overallStatus = "completed";
      statusData.completedAt = new Date().toISOString();
      saveStatus(statusData);
      return NextResponse.json({ success: true, status: statusData });
    }

    if (action === "error") {
      // Mark entire run as error
      statusData.overallStatus = "error";
      statusData.completedAt = new Date().toISOString();
      saveStatus(statusData);
      return NextResponse.json({ success: true, status: statusData });
    }

    if (action === "end") {
      // Mark entire run as completed or error
      if (runId && statusData.runId === runId) {
        statusData.overallStatus = status || "completed";
        statusData.completedAt = new Date().toISOString();
        saveStatus(statusData);
        return NextResponse.json({ success: true, status: statusData });
      }
    }

    if (action === "reset") {
      // Reset all status
      statusData.overallStatus = "idle";
      statusData.tests = {};
      statusData.startedAt = undefined;
      statusData.completedAt = undefined;
      saveStatus(statusData);
      return NextResponse.json({ success: true, status: statusData });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("[Status] Error saving:", error);
    return NextResponse.json(
      { error: "Failed to save status" },
      { status: 500 }
    );
  }
}

