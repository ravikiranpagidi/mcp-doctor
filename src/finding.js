export function createFinding(rule, values) {
  return {
    ruleId: rule.id,
    title: rule.title,
    severity: values.severity ?? rule.defaultSeverity,
    category: rule.category,
    message: values.message,
    path: values.path,
    recommendation: values.recommendation,
    docsUrl: values.docsUrl
  };
}
