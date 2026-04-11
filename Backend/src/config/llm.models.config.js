const DEFAULT_MODELS = [
  "openai/gpt-oss-120b",
  "llama-3.1-8b-instant",
  "llama-3.3-70b-versatile",
  "openai/gpt-oss-20b"
];

const DEFAULT_RETRY_PER_MODEL = 1;

function parseModelsFromEnv() {
  const raw = process.env.GROQ_FALLBACK_MODELS;
  if (!raw) {
    return DEFAULT_MODELS;
  }

  const models = raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return models.length > 0 ? models : DEFAULT_MODELS;
}

function parseRetryCountFromEnv() {
  const raw = process.env.GROQ_RETRY_PER_MODEL;
  if (!raw) {
    return DEFAULT_RETRY_PER_MODEL;
  }

  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 3) {
    return DEFAULT_RETRY_PER_MODEL;
  }

  return parsed;
}

const llmFallbackConfig = {
  models: parseModelsFromEnv(),
  retryPerModel: parseRetryCountFromEnv(),
};

module.exports = { llmFallbackConfig };