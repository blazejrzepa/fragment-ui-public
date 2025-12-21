import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { component, category } = body;

    // Stub: In real implementation, this would trigger a test run
    // For now, just return accepted
    console.log(`Rerun requested for component: ${component}, category: ${category}`);

    return NextResponse.json(
      {
        message: "Test run queued",
        runId: `run-${Date.now()}`,
        estimatedTime: "2-5 minutes",
      },
      { status: 202 }
    );
  } catch (error) {
    console.error("Error queuing rerun:", error);
    return NextResponse.json(
      { error: "Failed to queue test run" },
      { status: 500 }
    );
  }
}

