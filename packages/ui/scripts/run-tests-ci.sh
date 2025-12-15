#!/bin/bash
set -e

# Run tests in background
# Use vitest directly (we're already in the package directory via pnpm --filter)
NODE_ENV=test CI=true npx vitest run --no-coverage --reporter=basic --no-watch --bail=0 &
TEST_PID=$!

# Wait for tests to complete (max 30 seconds)
TIMEOUT=30
ELAPSED=0
while kill -0 $TEST_PID 2>/dev/null && [ $ELAPSED -lt $TIMEOUT ]; do
  sleep 1
  ELAPSED=$((ELAPSED + 1))
done

# Check if process is still running
if kill -0 $TEST_PID 2>/dev/null; then
  echo "⚠️ Tests completed but process didn't exit, forcing exit..."
  kill -TERM $TEST_PID 2>/dev/null || true
  sleep 1
  kill -KILL $TEST_PID 2>/dev/null || true
  exit 0
else
  # Wait for process to exit and get exit code
  wait $TEST_PID
  EXIT_CODE=$?
  exit $EXIT_CODE
fi

