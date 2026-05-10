import { auditLoggingRule } from "./audit-logging.js";
import { authBoundaryRule } from "./auth-boundary.js";
import { ciPresentRule } from "./ci-present.js";
import { dangerousToolsRule } from "./dangerous-tools.js";
import { envFilesRule } from "./env-files.js";
import { examplesPresentRule } from "./examples-present.js";
import { lifecycleScriptsRule } from "./lifecycle-scripts.js";
import { packageMetadataRule } from "./package-metadata.js";
import { readmeRule } from "./readme.js";
import { testsPresentRule } from "./tests-present.js";

export const rules = [
  packageMetadataRule,
  readmeRule,
  dangerousToolsRule,
  authBoundaryRule,
  auditLoggingRule,
  lifecycleScriptsRule,
  envFilesRule,
  testsPresentRule,
  examplesPresentRule,
  ciPresentRule
];
