#!/usr/bin/env node

/**
 * Create patch CLI script
 */

import { createPatch } from "./patch-manager.js";
import * as fs from "fs/promises";
import * as path from "path";

const componentName = process.argv[2];
const targetFile = process.argv[3];
const upstreamFile = process.argv[4];
const fragmentFile = process.argv[5];
const description = process.argv[6] || "Custom modification";
const reason = process.argv[7] || "Fragment UI customization";

if (!componentName || !targetFile || !upstreamFile || !fragmentFile) {
  console.error("Usage: node create-patch.js <component> <target-file> <upstream-file> <fragment-file> [description] [reason]");
  process.exit(1);
}

try {
  const upstreamContent = await fs.readFile(upstreamFile, "utf-8");
  const fragmentContent = await fs.readFile(fragmentFile, "utf-8");

  const patchId = await createPatch(
    componentName,
    targetFile,
    upstreamContent,
    fragmentContent,
    description,
    reason
  );

  console.log(`✅ Patch created: ${patchId}`);
} catch (error) {
  console.error(`❌ Failed to create patch: ${error.message}`);
  process.exit(1);
}

