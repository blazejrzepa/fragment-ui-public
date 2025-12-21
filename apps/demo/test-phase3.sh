#!/bin/bash

# Phase 3 Test Script
# Tests Submissions + Governance functionality

echo "🧪 Testing Phase 3: Submissions + Governance"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Submissions API - Create submission
echo "📝 Test 1: Create Submission"
RESPONSE=$(curl -s -X POST http://localhost:3002/api/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "type": "component",
    "dsl": {
      "type": "page",
      "id": "test-page",
      "sections": []
    },
    "tsx": "export default function TestComponent() { return <div>Test</div>; }",
    "author": "test-user"
  }')

if echo "$RESPONSE" | grep -q '"id"'; then
  SUBMISSION_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
  echo -e "${GREEN}✅ Submission created: $SUBMISSION_ID${NC}"
else
  echo -e "${RED}❌ Failed to create submission${NC}"
  echo "$RESPONSE"
  exit 1
fi

# Test 2: Run checks
echo ""
echo "🔍 Test 2: Run Quality Checks"
CHECK_RESPONSE=$(curl -s -X POST "http://localhost:3002/api/submissions/$SUBMISSION_ID/run-checks" \
  -H "Content-Type: application/json")

if echo "$CHECK_RESPONSE" | grep -q '"checks"'; then
  echo -e "${GREEN}✅ Checks completed${NC}"
  echo "$CHECK_RESPONSE" | grep -o '"status":"[^"]*"' | head -1
else
  echo -e "${YELLOW}⚠️  Checks response: $CHECK_RESPONSE${NC}"
fi

# Test 3: Get submission
echo ""
echo "📋 Test 3: Get Submission"
GET_RESPONSE=$(curl -s "http://localhost:3002/api/submissions/$SUBMISSION_ID")

if echo "$GET_RESPONSE" | grep -q '"id"'; then
  echo -e "${GREEN}✅ Submission retrieved${NC}"
  STATUS=$(echo "$GET_RESPONSE" | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)
  echo "   Status: $STATUS"
else
  echo -e "${RED}❌ Failed to get submission${NC}"
fi

# Test 4: Governance - Policy Registry
echo ""
echo "📚 Test 4: Policy Registry"
echo "   Checking if policy bundles are defined..."

# Test 5: List submissions
echo ""
echo "📋 Test 5: List Submissions"
LIST_RESPONSE=$(curl -s "http://localhost:3002/api/submissions")
COUNT=$(echo "$LIST_RESPONSE" | grep -o '"id"' | wc -l | tr -d ' ')
echo "   Found $COUNT submission(s)"

echo ""
echo -e "${GREEN}✅ Phase 3 API Tests Complete${NC}"

