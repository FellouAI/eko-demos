import dotenv from "dotenv";
import { ComputerAgent } from "./agent/computer";
import { BrowserAgent, FileAgent } from "@eko-ai/eko-nodejs";
import { Eko, Agent, Log, LLMs, StreamCallbackMessage } from "@eko-ai/eko";

dotenv.config();

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
  },
};

const callback = {
  onMessage: async (message: StreamCallbackMessage) => {
    if (message.type == "workflow" && !message.streamDone) {
      return;
    }
    if (message.type == "text" && !message.streamDone) {
      return;
    }
    if (message.type == "tool_streaming") {
      return;
    }
    console.log("message: ", JSON.stringify(message, null, 2));
  },
};

async function run() {
  Log.setLevel(1);
  const agents: Agent[] = [
    new ComputerAgent(),
    new BrowserAgent(),
    new FileAgent(),
  ];
  const eko = new Eko({ llms, agents, callback });
  const result = await eko.run(
    'Search for information about Musk, summarize and send it to the "Eko Awaken Your Web Innovation Challenge" Feishu group, and record the execution date in the desktop task.md file.'
  );
  console.log("result: ", result.result);
}

run().catch((e) => {
  console.log(e);
});
