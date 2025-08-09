
import * as robotjs from "robotjs";
import { createCanvas, loadImage } from "canvas";
import screenshotDesktop from "screenshot-desktop";

// Initialize robotjs
robotjs.setMouseDelay(10);
robotjs.setKeyboardDelay(10);

const keyMappings = {
  windows: {
    // Letters and numbers remain unchanged
    'a': 'a', 'b': 'b', 'c': 'c', 'd': 'd', 'e': 'e', 'f': 'f', 'g': 'g', 'h': 'h',
    'i': 'i', 'j': 'j', 'k': 'k', 'l': 'l', 'm': 'm', 'n': 'n', 'o': 'o', 'p': 'p',
    'q': 'q', 'r': 'r', 's': 's', 't': 't', 'u': 'u', 'v': 'v', 'w': 'w', 'x': 'x',
    'y': 'y', 'z': 'z',
    '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7',
    '8': '8', '9': '9',

    // Function keys
    'enter': 'enter',
    'esc': 'escape',
    'backspace': 'backspace',
    'tab': 'tab',
    'space': 'space',
    'delete': 'delete',

    // Modifier keys
    'ctrl': 'control',
    'alt': 'alt',
    'shift': 'shift',
    'win': 'cmd', // Windows key is cmd in robotjs

    // Arrow keys
    'up': 'up',
    'down': 'down',
    'left': 'left',
    'right': 'right',

    // F keys
    'f1': 'f1', 'f2': 'f2', 'f3': 'f3', 'f4': 'f4', 'f5': 'f5', 'f6': 'f6',
    'f7': 'f7', 'f8': 'f8', 'f9': 'f9', 'f10': 'f10', 'f11': 'f11', 'f12': 'f12'
  },

  mac: {
    // Letters and numbers remain unchanged
    'a': 'a', 'b': 'b', 'c': 'c', 'd': 'd', 'e': 'e', 'f': 'f', 'g': 'g', 'h': 'h',
    'i': 'i', 'j': 'j', 'k': 'k', 'l': 'l', 'm': 'm', 'n': 'n', 'o': 'o', 'p': 'p',
    'q': 'q', 'r': 'r', 's': 's', 't': 't', 'u': 'u', 'v': 'v', 'w': 'w', 'x': 'x',
    'y': 'y', 'z': 'z',
    '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7',
    '8': '8', '9': '9',

    // Function keys
    'enter': 'enter',
    'esc': 'escape',
    'backspace': 'backspace',
    'tab': 'tab',
    'space': 'space',
    'delete': 'delete',

    // Modifier keys
    'command': 'command',
    'option': 'alt',
    'shift': 'shift',
    'control': 'control',

    // Arrow keys
    'up': 'up',
    'down': 'down',
    'left': 'left',
    'right': 'right',

    // F keys
    'f1': 'f1', 'f2': 'f2', 'f3': 'f3', 'f4': 'f4', 'f5': 'f5', 'f6': 'f6',
    'f7': 'f7', 'f8': 'f8', 'f9': 'f9', 'f10': 'f10', 'f11': 'f11', 'f12': 'f12'
  }
};

// Use robotjs directly, no need to wait in Node.js environment
const robot = robotjs;
async function compressImageToWidth(imageBuffer: any, targetWidth = 1080) {
  try {
    const img = await loadImage(imageBuffer);

    // Calculate proportionally scaled height
    const ratio = targetWidth / img.width;
    const targetHeight = Math.round(img.height * ratio);

    // Create canvas and draw scaled image
    const canvas = createCanvas(targetWidth, targetHeight);
    const ctx = canvas.getContext("2d");

    // High quality scaling
    ctx.imageSmoothingEnabled = true;
    (ctx as any).imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    // Output JPEG with 80% quality to balance size and quality
    return canvas.toBuffer("image/jpeg", { quality: 0.8 });
  } catch (error) {
    console.error("compressImageToWidth fail:", error);
    return imageBuffer; // Return original image on error
  }
}

// Check accessibility permission
async function checkAccessibilityPermission(): Promise<boolean> {
  return true;
}

function pressKeys(key: string) {
  const mapping = (process.platform === 'darwin' ? keyMappings.mac : keyMappings.windows) as Record<string, string>;

  // Split keys
  const keyArray = key.split('+');

  if (keyArray.length === 1) {
    // Single key
    key = keyArray[0].toLowerCase();
    const mappedKey = mapping[key];
    if (mappedKey) {
      console.info("keyTap", mappedKey);
      robot.keyTap(mappedKey);
    } else {
      throw new Error(`Unsupported key: ${key}`);
    }
  } else {
    // Key combination
    const modifiers: string[] = [];
    let mainKey = null;

    // Parse modifier keys and main key
    keyArray.forEach((key: string, index: number) => {
      const lowerKey = key.toLowerCase();
      const mappedKey = mapping[lowerKey];

      if (!mappedKey) {
        throw new Error(`Unsupported key: ${lowerKey}`);
      }

      // Last key as main key, others as modifier keys
      if (index === keyArray.length - 1) {
        mainKey = mappedKey;
      } else {
        // Modifier key mapping
        if (process.platform === 'darwin') {
          if (lowerKey === 'command') modifiers.push('command');
          else if (lowerKey === 'option') modifiers.push('alt');
          else if (lowerKey === 'shift') modifiers.push('shift');
          else if (lowerKey === 'control') modifiers.push('control');
        } else {
          if (lowerKey === 'ctrl') modifiers.push('control');
          else if (lowerKey === 'alt') modifiers.push('alt');
          else if (lowerKey === 'shift') modifiers.push('shift');
          else if (lowerKey === 'win') modifiers.push('cmd');
        }
      }
    });

    if (mainKey && modifiers.length > 0) {
      console.info("keyTap", mainKey, modifiers);
      robot.keyTap(mainKey, modifiers);
    } else if (mainKey) {
      console.info("keyTap", mainKey);
      robot.keyTap(mainKey);
    }
  }
}

// Get display list
export async function getDisplayScreen(): Promise<any[]> {
  try {
    // In Node.js environment, we assume only one screen
    // For multi-screen support, use other libraries like node-screen-info
    return [{ 
      bounds: { 
        x: 0, 
        y: 0, 
        width: robot.getScreenSize().width, 
        height: robot.getScreenSize().height 
      } 
    }];
  } catch (error) {
    console.error("Failed to get display info:", error);
    return [];
  }
}

// Check permissions
export async function checkPermissions(): Promise<boolean> {
  const hasPermission = await checkAccessibilityPermission();
  return hasPermission;
}

// Screenshot function
export async function screenshot(displayScreen?: number): Promise<{
  imageBase64: string;
  imageType: "image/jpeg" | "image/png";
  imageWidth: number;
  imageHeight: number;
  screenWidth: number;
  screenHeight: number;
  screenX: number;
  screenY: number;
}> {
  try {
    const displays = await getDisplayScreen();
    console.log("displays", displays);

    // Get target display
    const targetDisplay =
      displayScreen !== undefined ? displays[displayScreen] : displays[0];

    if (!targetDisplay) {
      throw new Error(`Screen not found: ${displayScreen}`);
    }

    // Screenshot with retry mechanism
    const maxAttempts = 10;
    let imageBuffer;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        // Only pass screen parameter when multiple displays
        const screenshotOptions =
          displays.length > 1
            ? { screen: displayScreen, format: "jpeg" }
            : { format: "jpeg" };

        imageBuffer = await screenshotDesktop(screenshotOptions as any);
        console.log(`Screenshot successful, attempt ${attempt}/${maxAttempts}`);
        break; // Break loop after success
      } catch (error) {
        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
      }
    }

    // Compress image to 1080px width, height calculated proportionally
    const compressedImage = await compressImageToWidth(imageBuffer, 1080);

    const screenHeight = targetDisplay.bounds.height;
    const screenWidth = targetDisplay.bounds.width;

    return {
      imageBase64: compressedImage.toString("base64"),
      imageType: "image/jpeg",
      imageWidth: 1080,
      imageHeight: (1080 * screenHeight) / screenWidth,
      screenWidth,
      screenHeight,
      screenX: targetDisplay.bounds.x,
      screenY: targetDisplay.bounds.y,
    };
  } catch (error) {
    console.error("screenshot fail:", error);
    throw error;
  }
}

// Mouse movement
export async function move_to(x: number, y: number): Promise<void> {
  try {
    await checkAccessibilityPermission();
    robot.moveMouse(x, y);
    await new Promise((resolve) => setTimeout(resolve, 50));
  } catch (error) {
    console.error("Mouse movement failed:", error);
    throw error;
  }
}

// Mouse click
export async function click(
  button: "left" | "right" | "middle",
  x: number,
  y: number,
  num_clicks: number
): Promise<void> {
  try {
    console.info("mouseClick", button, x, y, num_clicks);
    await checkAccessibilityPermission();
    robot.moveMouse(x, y);
    await new Promise((resolve) => setTimeout(resolve, 100));
    for (let i = 0; i < num_clicks; i++) {
      robot.mouseClick(button);
      await new Promise((resolve) => setTimeout(resolve, 50));
      robot.mouseClick(button);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  } catch (error) {
    console.error("Mouse click failed:", error);
    throw error;
  }
}

// Scroll
export async function scroll(amount: number): Promise<void> {
  try {
    await checkAccessibilityPermission();
    console.info("scroll", amount);
    const direction = amount > 0 ? 'down' : 'up';
    robot.scrollMouse(0, direction == "down" ? -Math.abs(amount) : Math.abs(amount));
  } catch (error) {
    console.error("Mouse scroll failed:", error);
    throw error;
  }
}

// Type text
export async function typing(text: string): Promise<void> {
  try {
    await checkAccessibilityPermission();
    console.info("typing", text);
    robot.typeString(text);
  } catch (error) {
    console.error("Keyboard input failed:", error);
    throw error;
  }
}

// Press key
export async function press(key: string): Promise<void> {
  try {
    await checkAccessibilityPermission();
    console.info("press", key);
    pressKeys(key);
  } catch (error) {
    console.error("Key press failed:", error);
    throw error;
  }
}

// Wait
export async function wait(duration: number): Promise<void> {
  try {
    await new Promise((resolve) => setTimeout(resolve, duration));
  } catch (error) {
    console.error("Wait failed:", error);
    throw error;
  }
}

// Mouse down
export async function mouse_down(button: "left" | "right" | "middle"): Promise<void> {
  try {
    await checkAccessibilityPermission();
    console.info("mouse_down", button);
    robot.mouseToggle("down", button);
    robot.mouseToggle("down", button);
  } catch (error) {
    console.error("Mouse down failed:", error);
    throw error;
  }
}

// Mouse up
export async function mouse_up(button: "left" | "right" | "middle"): Promise<void> {
  try {
    await checkAccessibilityPermission();
    console.info("mouse_up", button);
    robot.mouseToggle("up", button);
    robot.mouseToggle("up", button);
  } catch (error) {
    console.error("Mouse up failed:", error);
    throw error;
  }
}

// Drag
export async function drag_to(x: number, y: number): Promise<void> {
  try {
    await checkAccessibilityPermission();
    robot.mouseToggle("down");
    robot.mouseToggle("down");
    await new Promise((resolve) => setTimeout(resolve, 50));
    robot.dragMouse(x, y);
    await new Promise((resolve) => setTimeout(resolve, 50));
    robot.mouseToggle("up");
    robot.mouseToggle("up");
  } catch (error) {
    console.error("Drag failed:", error);
    throw error;
  }
}

// Hotkey
export async function hotkey(key: string): Promise<void> {
  try {
    await checkAccessibilityPermission();
    console.info("hotkey", key);
    pressKeys(key);
  } catch (error) {
    console.error("Hotkey operation failed:", error);
    throw error;
  }
}

// Export collection of all tool functions
export const computerUse = {
  getDisplayScreen,
  checkPermissions,
  screenshot,
  move_to,
  click,
  scroll,
  typing,
  press,
  wait,
  mouse_down,
  mouse_up,
  drag_to,
  hotkey,
};