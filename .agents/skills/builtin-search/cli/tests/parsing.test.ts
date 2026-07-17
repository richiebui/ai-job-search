import { describe, test, expect } from "bun:test";
import { parseJobCards, parseJobDetail, relativeTimeToDays, matchesFilters } from "../src/helpers";

// Minimal card markup mirroring builtin.com's real structure: a `job-card-<id>`
// wrapper containing a company link, a title link with data-alias, and icon+span
// pairs for posted-time, work-mode, location, salary, and seniority.
function card(id: string, title: string, opts: {
  company?: string; location?: string; workMode?: string; date?: string;
} = {}): string {
  const company = opts.company ?? "Acme";
  const location = opts.location ?? "Remote";
  const workMode = opts.workMode ?? "Remote";
  const date = opts.date ?? "2 Days Ago";
  return `<div id="job-card-${id}" data-id="job-card" class="job-bounded-responsive"><div id="main" class="row">
    <div class="left-side-tile-item-2"><a href="/company/acme" data-id="company-title"><span>${company}</span></a></div>
    <div class="left-side-tile-item-3"><h2><a href="/job/${title.toLowerCase().replace(/\s+/g, "-")}/${id}" data-id="job-card-title" data-alias="/job/${title.toLowerCase().replace(/\s+/g, "-")}/${id}">${title}</a></h2></div>
    <span><i class="fa-regular fa-clock"></i>${date}</span>
    <div><i class="fa-regular fa-house-building"></i></div><span class="font-barlow text-gray-04">${workMode}</span>
    <div><i class="fa-regular fa-location-dot"></i></div><div><span class="font-barlow text-gray-04">${location}</span></div>
    <div><i class="fa-regular fa-sack-dollar"></i></div><span class="font-barlow text-gray-04">100K-150K Annually</span>
    <div><i class="fa-regular fa-trophy"></i></div><span class="font-barlow text-gray-04">Senior level</span>
  </div></div>`;
}

describe("parseJobCards", () => {
  test("parses id, title, company, location, work mode, salary, seniority, date", () => {
    const [c] = parseJobCards(card("111", "Data Engineer", { company: "Acme Corp", location: "New York, NY, USA" }));
    expect(c.id).toBe("111");
    expect(c.title).toBe("Data Engineer");
    expect(c.company).toBe("Acme Corp");
    expect(c.location).toBe("New York, NY, USA");
    expect(c.workMode).toBe("Remote");
    expect(c.salary).toBe("100K-150K Annually");
    expect(c.seniority).toBe("Senior level");
    expect(c.date).toBe("2 Days Ago");
    expect(c.url).toBe("https://builtin.com/job/data-engineer/111");
  });

  test("multiple cards parse independently — one malformed card doesn't break the rest", () => {
    const good1 = card("222", "Software Engineer");
    const broken = `<div id="job-card-333" data-id="job-card"><div id="main" class="row">no title link here</div></div>`;
    const good2 = card("444", "Product Manager");
    const cards = parseJobCards(good1 + broken + good2);
    expect(cards.map((c) => c.id)).toEqual(["222", "444"]);
  });

  test("returns empty array for a page with no job cards", () => {
    expect(parseJobCards("<html><body>No jobs</body></html>")).toEqual([]);
  });
});

describe("parseJobDetail", () => {
  const detailHtml = `
    <h1 class="fw-extrabold fs-xl mb-sm"><span class="mb-0">Principal Data Engineer</span></h1>
    <a href="/company/acme" target="_blank"><h2 class="text-pretty-blue m-0">Acme Corp</h2></a>
    <span class="font-barlow fs-md fw-regular">Posted 40 Minutes Ago</span>
    <i class="fa-regular fa-location-dot"></i></div><div class="font-barlow text-gray-03 position-relative"><span>San Jose, CA, USA</span></div>
    <i class="fa-regular fa-house-building"></i></div><span class="font-barlow text-gray-03">Hybrid</span>
    <i class="fa-regular fa-sack-dollar"></i></div><span class="font-barlow text-gray-03">196K-245K Annually</span>
    <i class="fa-regular fa-trophy"></i></div><span class="font-barlow text-gray-03">Senior level</span>
    <div class="font-barlow fw-medium mb-md">Cloud &#x2022; Data &#x2022; Engineering</div>
    <div id="job-post-body-999" class="html-parsed-content"><p>About the role.</p><ul><li>Build pipelines</li></ul></div>
    <button @click="toggleJobExpanded" type="button">Read Full Description</button>
  `;

  test("parses title, company, location, work mode, salary, seniority, categories, date", () => {
    const job = parseJobDetail(detailHtml, "999", "https://builtin.com/job/principal-data-engineer/999");
    expect(job.title).toBe("Principal Data Engineer");
    expect(job.company).toBe("Acme Corp");
    expect(job.location).toBe("San Jose, CA, USA");
    expect(job.workMode).toBe("Hybrid");
    expect(job.salary).toBe("196K-245K Annually");
    expect(job.seniority).toBe("Senior level");
    expect(job.categories).toBe("Cloud • Data • Engineering");
    expect(job.date).toBe("40 Minutes Ago");
  });

  test("extracts description text with tags stripped", () => {
    const job = parseJobDetail(detailHtml, "999", "https://builtin.com/job/principal-data-engineer/999");
    expect(job.description).toContain("About the role.");
    expect(job.description).toContain("Build pipelines");
    expect(job.description).not.toMatch(/<[^>]+>/);
  });

  test("applyUrl falls back to the canonical job URL", () => {
    const job = parseJobDetail(detailHtml, "999", "https://builtin.com/job/principal-data-engineer/999");
    expect(job.applyUrl).toBe("https://builtin.com/job/principal-data-engineer/999");
  });
});

describe("relativeTimeToDays", () => {
  test("minutes/hours ago -> 0 days", () => {
    expect(relativeTimeToDays("39 Minutes Ago")).toBe(0);
    expect(relativeTimeToDays("3 Hours Ago")).toBe(0);
  });
  test("days ago -> that many days", () => {
    expect(relativeTimeToDays("5 Days Ago")).toBe(5);
  });
  test("weeks/months/years ago convert to approximate days", () => {
    expect(relativeTimeToDays("2 Weeks Ago")).toBe(14);
    expect(relativeTimeToDays("1 Month Ago")).toBe(30);
    expect(relativeTimeToDays("1 Year Ago")).toBe(365);
  });
  test("yesterday and just posted", () => {
    expect(relativeTimeToDays("Yesterday")).toBe(1);
    expect(relativeTimeToDays("Just Posted")).toBe(0);
  });
  test("unparseable or null text returns null (never excludes)", () => {
    expect(relativeTimeToDays(null)).toBeNull();
    expect(relativeTimeToDays("sometime")).toBeNull();
  });
});

describe("matchesFilters", () => {
  const base = {
    id: "1", title: "Senior Data Engineer", company: "Acme", companyUrl: null,
    location: "Remote", date: "3 Days Ago", url: "https://builtin.com/job/x/1",
    workMode: "Remote", salary: null, seniority: null,
  };

  test("query matches title case-insensitively", () => {
    expect(matchesFilters(base, { query: "data engineer" })).toBe(true);
    expect(matchesFilters(base, { query: "recruiter" })).toBe(false);
  });

  test("location filters as a substring", () => {
    expect(matchesFilters(base, { location: "remote" })).toBe(true);
    expect(matchesFilters({ ...base, location: "New York, NY" }, { location: "remote" })).toBe(false);
  });

  test("jobage excludes postings older than N days but keeps unparseable dates", () => {
    expect(matchesFilters(base, { jobage: 7 })).toBe(true);
    expect(matchesFilters(base, { jobage: 1 })).toBe(false);
    expect(matchesFilters({ ...base, date: null }, { jobage: 1 })).toBe(true);
  });
});
