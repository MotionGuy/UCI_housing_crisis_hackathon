import { NextResponse } from "next/server";
import { sampleJobs } from "@/lib/sample-data";

// GET /api/jobs?skills=EHR,scheduling&minSalary=80000
// TODO: replace sample data with real job sources, and use an LLM to match
// skills more loosely than exact string overlap.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const skills = (searchParams.get("skills") ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const minSalary = Number(searchParams.get("minSalary") ?? 0);

  const jobs = sampleJobs
    .map((job) => ({
      ...job,
      matchedSkills: job.skills.filter((s) => skills.includes(s.toLowerCase())),
    }))
    .filter((job) => job.annualSalary >= minSalary && job.matchedSkills.length > 0)
    .sort((a, b) => b.annualSalary - a.annualSalary);

  return NextResponse.json({ jobs });
}
