export const severityRank = {
  info: 0,
  low: 1,
  medium: 2,
  high: 3
};

export function compareSeverity(left, right) {
  return severityRank[left] - severityRank[right];
}

export function countBySeverity(findings) {
  const counts = {
    high: 0,
    medium: 0,
    low: 0,
    info: 0
  };

  for (const finding of findings) {
    counts[finding.severity] += 1;
  }

  return counts;
}

export function calculateScore(findings) {
  const penalty = findings.reduce((total, finding) => {
    if (finding.severity === "high") return total + 20;
    if (finding.severity === "medium") return total + 10;
    if (finding.severity === "low") return total + 3;
    return total;
  }, 0);

  return Math.max(0, 100 - penalty);
}
