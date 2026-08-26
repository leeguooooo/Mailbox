import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const { buildMcpClientConfig } = require("../src/mcp_config.js");
const { buildPkgArgs } = require("../../../scripts/pkg_config.js");
const { parseMcpResponses } = require("../../../scripts/mcp_smoke_test.js");

describe("prebuilt MCP packaging", () => {
  it("re-executes the packaged binary without a build-only snapshot entrypoint", () => {
    expect(
      buildMcpClientConfig({
        execPath: "/opt/mailbox/bin/mailbox",
        argv1: "/snapshot/Mailbox/packages/cli/bin/mailbox.js",
      }),
    ).toEqual({
      command: "/opt/mailbox/bin/mailbox",
      args: ["mcp", "serve"],
    });
  });

  it("keeps the Node plus script entrypoint for source execution", () => {
    expect(
      buildMcpClientConfig({
        execPath: "/usr/local/bin/node",
        argv1: "/workspace/packages/cli/bin/mailbox.js",
        isPkg: false,
      }),
    ).toEqual({
      command: "/usr/local/bin/node",
      args: ["/workspace/packages/cli/bin/mailbox.js", "mcp", "serve"],
    });
  });

  it("uses the CLI package manifest when invoking pkg", () => {
    const root = "/tmp/mailbox-source";
    const entry = `${root}/packages/cli/bin/mailbox.js`;
    const output = `${root}/dist/mailbox`;

    expect(buildPkgArgs({ root, entry, target: "node18-macos-arm64", output })).toEqual([
      "-C",
      root,
      "exec",
      "pkg",
      entry,
      "--config",
      `${root}/packages/cli/package.json`,
      "--targets",
      "node18-macos-arm64",
      "--output",
      output,
    ]);
  });

  it("requires initialize and tools/list responses from a release smoke test", () => {
    const responses = parseMcpResponses([
      JSON.stringify({ jsonrpc: "2.0", id: 1, result: { serverInfo: { name: "mailbox" } } }),
      JSON.stringify({ jsonrpc: "2.0", id: 2, result: { tools: [{ name: "email_list" }] } }),
    ].join("\n"));

    expect(responses.find((response) => response.id === 1)?.result?.serverInfo?.name).toBe("mailbox");
    expect(responses.find((response) => response.id === 2)?.result?.tools).toHaveLength(1);
  });
});
