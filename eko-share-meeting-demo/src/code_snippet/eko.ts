import Eko, {
  LLMs,
  Agent,
  AgentContext,
  SimpleHttpMcpClient,
} from "@eko-ai/eko";
import { BrowserAgent, FileAgent } from "@eko-ai/eko-nodejs";
import { ComputerAgent } from "../agent/computer";
import { Tool, ToolResult } from "@eko-ai/eko/types";

const llms: LLMs = {
  default: {
    provider: "openai",
    model: "gpt-5",
    apiKey: "your-openai-api-key",
  },
};

async function main() {
  const agents: Agent[] = [
    new BrowserAgent(),
    new ComputerAgent(),
    new FileAgent(),
    new Agent({
      name: "Code",
      description: "代码执行代理，能够在安全的沙盒环境中运行和测试各种编程语言的代码片段",
      mcpClient: new SimpleHttpMcpClient("http://localhost:3088/mcp"),
      tools: [],
    }),
    new Agent({
      name: "Weather",
      description: "天气查询代理，能够提供实时的天气信息",
      tools: [get_weather_tool()],
    }),
  ];
  const eko = new Eko({ llms, agents });
  const result = await eko.run("搜索 FellouAI Eko 开源框架并点击 Star");
  console.log("result: ", result.result);
}

function get_weather_tool(): Tool {
  return {
    name: "get_weather",
    description: "weather query",
    parameters: {
      type: "object",
      properties: {
        city: {
          type: "string",
          default: "Beijing",
        },
      },
    },
    execute: async (
      args: Record<string, unknown>,
      agentContext: AgentContext
    ): Promise<ToolResult> => {
      return {
        content: [
          {
            type: "text",
            text: `Today, the weather in ${args.city} is cloudy, 25-30° (Celsius), suitable for going out for a walk.`,
          },
        ],
      };
    },
  };
}

main().then((result) => {
  console.log("Result:", result);
});
