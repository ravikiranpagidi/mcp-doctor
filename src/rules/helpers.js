export const sourceExtensions = [".js", ".mjs", ".cjs", ".ts", ".tsx", ".py", ".go", ".rs"];

export function hasFile(context, predicate) {
  return context.files.some(predicate);
}

export function hasAnyPath(context, paths) {
  return paths.some((candidate) => context.files.some((file) => file.path === candidate));
}

export function findReadme(context) {
  return context.files.find((file) => /^readme(\.[a-z0-9]+)?$/i.test(file.name));
}

export async function projectHasText(context, pattern, options = {}) {
  const matches = await context.grep(pattern, options);
  return matches.length > 0;
}

export function createRule(definition) {
  return definition;
}
