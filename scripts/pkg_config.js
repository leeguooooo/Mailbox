const path = require("path");

function buildPkgArgs({ root, entry, target, output }) {
  // The entrypoint lives in the CLI workspace package. Using the monorepo
  // package.json makes pkg miss workspace-only runtime dependencies such as
  // the MCP SDK when pnpm creates package-local links.
  return [
    "-C",
    root,
    "exec",
    "pkg",
    entry,
    "--config",
    path.join(root, "packages", "cli", "package.json"),
    "--targets",
    target,
    "--output",
    output,
  ];
}

module.exports = { buildPkgArgs };
