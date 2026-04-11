const { Groq } = require("groq-sdk");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");




const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


const interviewQuestionSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 100 indicating how well the candidate's resume matches the job description"
    ),
  interviewQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "The technical question that could be asked in the interview"
          ),
        intention: z
          .string()
          .describe("The intention behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take while answering this question"
          ),
      })
    )
    .describe(
      "List of technical questions that could be asked in the interview"
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "The behavioral question that could be asked in the interview"
          ),
        intention: z
          .string()
          .describe("The intention behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take while answering this question"
          ),
      })
    )
    .describe(
      "List of behavioral questions that could be asked in the interview"
    ),
  skillGaps: z
    .array(
      z
        .object({
          skill: z
            .string()
            .describe(
              "The skill that the candidate is lacking based on the resume and job description analysis"
            ),
          severity: z
            .enum(["low", "medium", "high"])
            .describe(
              "The severity of the skill gap, i.e., how important it is for the candidate to work on this skill before the interview"
            ),
        })
        .describe(
          "List of skill gaps that the candidate has based on the resume and job description analysis"
        )
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe(
            "The day number in the preparation plan, starting from 1"
          ),
        focus: z
          .string()
          .describe(
            "The main focus of the preparation for that day, e.g., data structures, system design, behavioral questions, etc."
          ),
        tasks: z
          .array(z.string())
          .describe(
            "The list of tasks that the candidate should do on that day to prepare for the interview"
          ),
      })
    )
    .describe(
      "A day-wise preparation plan for the candidate based on the analysis of the resume and job description"
    ),
    title: z.string().describe("The title of the job position for which interview report is generated")
});


async function generateInterviewReport(resume, selfDescription, jobDescription) {
  const schema = zodToJsonSchema(interviewQuestionSchema);

const prompt = `You are analyzing a job candidate. Here is their information:

RESUME:
${resume}

SELF DESCRIPTION:
${selfDescription}

JOB DESCRIPTION:
${jobDescription}

You MUST respond with a single JSON object. No markdown. No explanation. No code fences. Root level only.

The JSON must follow this EXACT structure — every field must match the types shown:

{
  "matchScore": 72,
  "interviewQuestions": [
    {
      "question": "Explain how you would design a REST API.",
      "intention": "Tests system design thinking.",
      "answer": "Cover REST principles, endpoints, status codes, versioning."
    }
  ],
  "behavioralQuestions": [
    {
      "question": "Tell me about a time you handled a tight deadline.",
      "intention": "Assesses time management and pressure handling.",
      "answer": "Use the STAR method: Situation, Task, Action, Result."
    }
  ],
  "skillGaps": [
    {
      "skill": "Docker",
      "severity": "medium"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "Data Structures",
      "tasks": [
        "Solve 3 array problems on LeetCode",
        "Review hash maps and sets"
      ]
    }
  ]
}

Rules:
- matchScore must be a NUMBER between 0 and 100
- interviewQuestions, behavioralQuestions: each item MUST be an object with "question", "intention", "answer" string fields
- skillGaps: each item MUST be an object with "skill" (string) and "severity" (one of: "low", "medium", "high")
- preparationPlan: each item MUST be an object with "day" (number), "focus" (string), "tasks" (array of strings)
- Do NOT put strings directly in arrays — always use objects as shown above
- severity must be exactly one of: "low", "medium", "high" — nothing else

Now generate the report for the candidate above.`;

  const requestPayload = {
    model: "qwen/qwen3-32b",
    messages: [
      {
        role: "system",
        content:
          "You are an expert technical interviewer. Respond with raw JSON only. No markdown, no code fences, no extra text.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    reasoning_effort: "none",
  };

  let response;
  try {
    response = await groq.chat.completions.create({
      ...requestPayload,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "interview_question_report",
          schema,
        },
      },
    });
  } catch (err) {
    const unsupportedSchemaFormat =
      err?.message && err.message.includes("does not support response format `json_schema`");

    if (!unsupportedSchemaFormat) {
      throw err;
    }

    response = await groq.chat.completions.create({
      ...requestPayload,
      response_format: {
        type: "json_object",
      },
    });
  }

  const raw = response.choices[0].message.content || "{}";

  console.log("Raw model response:", raw);

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse JSON response:", err.message);
    return null;
  }

  const topLevelKeys = Object.keys(parsed);
  if (
    topLevelKeys.length === 1 &&
    !interviewQuestionSchema.shape[topLevelKeys[0]]
  ) {
    console.log(`Unwrapping nested key: "${topLevelKeys[0]}"`);
    parsed = parsed[topLevelKeys[0]];
  }

  const result = interviewQuestionSchema.safeParse(parsed);

  if (!result.success) {
    console.error("Schema validation failed:", result.error);
    return null;
  }

  return result.data;
}

module.exports = { generateInterviewReport }