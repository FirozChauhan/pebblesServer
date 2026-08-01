export const getPrompt = (resumeText: string, targetRole: string): string => {
  return `
You are an expert ATS-optimized resume parser and career coach.

INPUT:
- Extracted PDF text: ${resumeText}
- Target job role: ${targetRole}

TASK:
Analyze the extracted resume text and rewrite/optimize it specifically for the given job role. Make it ATS-friendly by using relevant keywords, action verbs, and quantifiable achievements from the original text. Do NOT invent skills or experiences — only optimize what's in the original text.

OUTPUT FORMAT:
Return a valid JSON object with this EXACT structure:

{
  "name": "string",
  "title": "string (optimized title aligned to target role, e.g. 'Frontend Developer' if that's the target)",
  "contact": {
    "phone": "string",
    "email": "string",
    "linkedin": "string",
    "github": "string (optional, only if present in original resume)",
    "portfolio": "string (optional, only if present in original resume)"
  },
  "summary": "string (2-4 sentences, rewritten to match target role and JD keywords, based only on real experience)",
  "skills": {
    "Programming & Querying": ["skill1", "skill2"],
    "Data Visualization Tools": ["skill1", "skill2"],
    "Analytical Abilities": ["skill1", "skill2"]
  },
  "experience": [
    {
      "role": "string",
      "company": "string",
      "location": "string (Remote/Onsite/City, only if known)",
      "start_date": "string",
      "end_date": "string",
      "tools_used": ["tool1", "tool2"],
      "bullets": ["rewritten bullet 1", "rewritten bullet 2"]
    }
  ],
  "projects": [
    {
      "name": "string",
      "tech_stack": ["tech1", "tech2"],
      "start_date": "string",
      "end_date": "string",
      "bullets": ["rewritten bullet 1", "rewritten bullet 2"]
    }
  ],
  "awards_certifications": [
    {
      "title": "string",
      "issuer_or_context": "string",
      "year": "string",
      "description": "string"
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "graduation_year": "string",
      "score": "string (CGPA/percentage, only if present)"
    }
  ],
  "ats_keywords_matched": ["keyword1", "keyword2"],
  "gap_analysis": ["skill/requirement from JD not found in resume, listed for candidate awareness only"]
}

GUIDELINES:
- Use strong action verbs (developed, analyzed, optimized, engineered, designed).
- Keep all metrics and numbers intact (they boost ATS score).
- Rewrite bullets to emphasize impact and results, not just duties. Use STAR method (Situation, Task, Action, Result) implicitly.
- Match skills and keywords to the target job role.
- For gap_analysis, list skills from the job description that are missing in the resume.
- Return ONLY valid JSON. Do NOT include markdown, code blocks, explanations, or any other text. Start with { and end with }.
`;
};
