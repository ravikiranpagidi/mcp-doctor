export function printConsoleReport(result) {
  const { summary } = result;
  console.log("MCP Doctor");
  console.log(`Path: ${result.cwd}`);
  console.log(`Score: ${summary.score}/100`);
  console.log(
    `Findings: ${summary.counts.high} high, ${summary.counts.medium} medium, ${summary.counts.low} low, ${summary.counts.info} info`
  );
  console.log("");

  if (result.findings.length === 0) {
    console.log("No findings. Nice work.");
    return;
  }

  for (const finding of result.findings) {
    const location = finding.path ? ` (${finding.path})` : "";
    console.log(`[${finding.severity.toUpperCase()}] ${finding.ruleId}${location}`);
    console.log(`  ${finding.message}`);
    if (finding.recommendation) {
      console.log(`  Fix: ${finding.recommendation}`);
    }
    console.log("");
  }
}
