function isPackagedRuntime({ isPkg, argv1 } = {}) {
  if (typeof isPkg === "boolean") return isPkg;
  const entrypoint = argv1 == null ? process.argv[1] : argv1;
  // pkg exposes the real executable through execPath but leaves argv[1] at
  // the build-time /snapshot path. A packaged client must re-run the binary
  // with subcommands instead of trying to execute that virtual script.
  return typeof process.pkg !== "undefined" || String(entrypoint || "").startsWith("/snapshot/");
}

function buildMcpClientConfig({ execPath = process.execPath, argv1 = process.argv[1], isPkg } = {}) {
  return {
    command: execPath,
    args: isPackagedRuntime({ isPkg, argv1 }) ? ["mcp", "serve"] : [argv1 || "mailbox", "mcp", "serve"],
  };
}

module.exports = { buildMcpClientConfig, isPackagedRuntime };
