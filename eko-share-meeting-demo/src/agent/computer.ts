import { AgentContext, BaseComputerAgent } from "@eko-ai/eko";
import { computerUse } from "./computerUse";

export class ComputerAgent extends BaseComputerAgent {
  protected async screenshot(agentContext: AgentContext): Promise<{
    imageBase64: string;
    imageType: "image/jpeg" | "image/png";
    imageWidth: number;
    imageHeight: number;
    screenWidth: number;
    screenHeight: number;
    screenX: number;
    screenY: number;
  }> {
    // Check if the screen has been selected
    const existingScreen = agentContext.variables.get("displayScreen");
    if (existingScreen !== undefined) {
      const screenshotRes = await computerUse.screenshot(
        existingScreen
      );
      agentContext.variables.set("lastScreenshot", screenshotRes);
      return screenshotRes;
    }
    const screens = await computerUse.getDisplayScreen();
    if (screens.length > 0) {
      agentContext.variables.set("displayScreen", 0);
      const screenshotRes = await computerUse.screenshot(0);
      agentContext.variables.set("lastScreenshot", screenshotRes);
      return screenshotRes;
    }
    const screenshotRes = await computerUse.screenshot();
    agentContext.variables.set("lastScreenshot", screenshotRes);
    return screenshotRes;
  }
  protected async typing(
    agentContext: AgentContext,
    text: string
  ): Promise<void> {
    return await computerUse.typing(text);
  }
  protected async click(
    agentContext: AgentContext,
    x: number,
    y: number,
    num_clicks: number,
    button_type: "left" | "right" | "middle"
  ): Promise<void> {
    const lastScreenshot = agentContext.variables.get("lastScreenshot");
    if (!lastScreenshot) {
      throw new Error("No screenshot data available for coordinate conversion");
    }
    // Convert image coordinates to screen coordinates
    const screenX = Math.round(
      (x / lastScreenshot.imageWidth) * lastScreenshot.screenWidth
    );
    const screenY = Math.round(
      (y / lastScreenshot.imageHeight) * lastScreenshot.screenHeight
    );
    return await computerUse.click(
      button_type,
      screenX,
      screenY,
      num_clicks
    );
  }

  protected async scroll(
    agentContext: AgentContext,
    amount: number
  ): Promise<void> {
    const lastScreenshot = agentContext.variables.get("lastScreenshot");
    if (!lastScreenshot) {
      throw new Error("No screenshot data available for coordinate conversion");
    }
    const screenHeight = lastScreenshot.screenHeight;
    return await computerUse.scroll(
      (screenHeight / 10) * amount
    );
  }

  protected async move_to(
    agentContext: AgentContext,
    x: number,
    y: number
  ): Promise<void> {
    const lastScreenshot = agentContext.variables.get("lastScreenshot");
    if (!lastScreenshot) {
      throw new Error("No screenshot data available for coordinate conversion");
    }

    // Convert image coordinates to screen coordinates
    const screenX = Math.round(
      (x / lastScreenshot.imageWidth) * lastScreenshot.screenWidth
    );
    const screenY = Math.round(
      (y / lastScreenshot.imageHeight) * lastScreenshot.screenHeight
    );

    return await computerUse.move_to(screenX, screenY);
  }
  protected async press(
    agentContext: AgentContext,
    key: string
  ): Promise<void> {
    return await computerUse.press(key);
  }
  protected async hotkey(
    agentContext: AgentContext,
    key: string
  ): Promise<void> {
    console.log("hotkey", key);
    return await computerUse.hotkey(key);
  }
  protected async drag_and_drop(
    agentContext: AgentContext,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): Promise<void> {
    await computerUse.move_to(x1, y1);
    await computerUse.drag_to(x2, y2);
  }
}
