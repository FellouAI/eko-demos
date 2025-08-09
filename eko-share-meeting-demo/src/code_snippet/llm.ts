import { LLMs, RetryLanguageModel } from "@eko-ai/eko";

const openrouterApiKey = process.env.OPENROUTER_API_KEY;
const openrouterBaseURL = process.env.OPENROUTER_BASE_URL;

const llms: LLMs = {
  default: {
    provider: "openrouter",
    model: "anthropic/claude-sonnet-4",
    apiKey: openrouterApiKey || "",
    config: {
      baseURL: openrouterBaseURL,
    },
    fetch: (url, options) => {
      const body = JSON.parse(options?.body as string);
      body.user = "test@fellou.ai";
      body.metadata = {
        taskId: "xxx",
      };
      return fetch(url, {
        ...options,
        body: JSON.stringify(body),
      });
    },
  },
};

const names = ["default"];

async function main() {
  const client = new RetryLanguageModel(llms, names);

  const result = await client.call({
    maxTokens: 1024,
    temperature: 0.7,
    messages: [{ role: "user", content: [{ type: "text", text: "Hello" }] }],
  });

  console.log(JSON.stringify(result, null, 2));
}

main().then((result) => {
  console.log("Result:", result);
});
