import { describe, test, expect } from "bun:test";
import { runCLI, parseJSON } from "./helpers";

// Live smoke tests — hit the real builtin.com listing page. Keep volume low:
// one search call, one detail call, one bad-input call.
describe("builtin-cli live smoke test", () => {
  test("search returns real results with non-null id/title/url", async () => {
    const result = await runCLI(["search", "-q", "engineer", "--limit", "5", "--format", "json"]);
    const parsed = parseJSON<{ meta: { count: number }; results: any[] }>(result);
    expect(parsed.results.length).toBeGreaterThan(0);
    for (const r of parsed.results) {
      expect(r.id).toBeTruthy();
      expect(r.title).toBeTruthy();
      expect(r.url).toMatch(/^https:\/\/builtin\.com\/job\//);
    }
  }, 30000);

  test("a bogus flag or missing id exits 1 with a JSON error on stderr", async () => {
    const result = await runCLI(["detail"]);
    expect(result.exitCode).toBe(1);
    const err = JSON.parse(result.stderr);
    expect(err.code).toBe("NO_ID");
  });

  test("--page with a non-numeric value exits 1 with BAD_ARG", async () => {
    const result = await runCLI(["search", "--page", "notanumber"]);
    expect(result.exitCode).toBe(1);
    const err = JSON.parse(result.stderr);
    expect(err.code).toBe("BAD_ARG");
  });
});
