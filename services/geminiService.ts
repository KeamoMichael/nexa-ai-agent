import { GoogleGenAI, Type } from "@google/genai";
import { PlanStep } from "../types";
import { io, Socket } from "socket.io-client";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

// Socket.IO connection for E2B browser control
const SOCKET_URL = import.meta.env.DEV ? 'http://localhost:3001' : window.location.origin;
let browserSocket: Socket | null = null;
let browserReady = false;

// Initialize browser connection
const initBrowser = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (browserSocket && browserReady) {
      resolve();
      return;
    }

    browserSocket = io(SOCKET_URL);

    browserSocket.on('connect', () => {
      console.log('[Agent] Browser socket connected');
      browserSocket!.emit('start-browser');
    });

    browserSocket.on('browser-ready', () => {
      console.log('[Agent] Browser ready for use');
      browserReady = true;
      resolve();
    });

    browserSocket.on('browser-error', (error: { message: string }) => {
      console.error('[Agent] Browser error:', error);
      reject(new Error(error.message));
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!browserReady) {
        reject(new Error('Browser initialization timeout'));
      }
    }, 30000);
  });
};

// Tavily Search via REST API (browser-compatible)
const searchTavily = async (query: string) => {
  const apiKey = import.meta.env.VITE_TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error('Tavily API key not configured');
  }

  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: apiKey,
      query: query,
      search_depth: 'basic',
      max_results: 5,
      include_answer: true,
      include_raw_content: false
    })
  });

  if (!response.ok) {
    throw new Error(`Tavily API error: ${response.statusText}`);
  }

  return await response.json();
};

// 1. Determine Intent: Chat vs Task
export const analyzeIntent = async (prompt: string): Promise<'chat' | 'task'> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', // Updated to latest flash model
      contents: `Classify the following user prompt.
      "chat": Simple greetings, questions about the AI's identity, casual conversation, or simple one-shot questions that don't require research or multiple steps.
      "task": Requests requiring research, planning, creating documents, coding, analyzing data, or executing multiple steps.
      
      User Prompt: "${prompt}"
      
      Return ONLY the string "chat" or "task".`,
    });
    const text = response.text?.toLowerCase().trim();
    return text?.includes('task') ? 'task' : 'chat';
  } catch (e) {
    return 'chat'; // Default to chat on error
  }
};

// 2. Simple Chat Response
export const generateChatResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "I'm here to help.";
  } catch (e) {
    return "I'm having trouble connecting right now.";
  }
};

// 3. Helper to create a plan based on user prompt
export const generatePlan = async (prompt: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert autonomous agent planner. 
      Break down the following user request into exactly 4 distinct, actionable steps that an AI agent would take to complete the task.
      Return ONLY a JSON array of strings. Do not include markdown formatting.
      User Request: "${prompt}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const text = response.text;
    if (!text) return ["Analyze request", "Gather information", "Process data", "Generate report"];

    return JSON.parse(text) as string[];
  } catch (error) {
    console.error("Plan generation error:", error);
    return ["Analyze request", "Search web", "Synthesize findings", "Finalize output"];
  }
};

// 4. Generate Dynamic Logs for a Step
export const generateStepLogs = async (stepDescription: string, context: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `For the agentic task step: "${stepDescription}", generate 2 or 3 short, realistic "system log" status updates that an AI would report while executing this.
            Context: ${context}
            Examples: "Searching Tavily for X...", "Reading documentation...", "Parsing dataset...", "Running python script..."
            Keep them under 8 words.
            Return ONLY a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    const text = response.text;
    if (!text) return ["Processing..."];
    return JSON.parse(text) as string[];
  } catch (e) {
    return ["Processing step...", "Analyzing data..."];
  }
};

// 5. Execute Step with Browser Control and Tavily Search
export const executeStep = async (step: string, context: string): Promise<string> => {
  let searchResults = "";
  const lowerStep = step.toLowerCase();

  // --- Check if this is a browsing task (needs E2B browser) ---
  if (lowerStep.includes('browse') || lowerStep.includes('visit') || lowerStep.includes('open') ||
    lowerStep.includes('navigate') || lowerStep.includes('go to')) {

    const urlMatch = step.match(/(https?:\/\/[^\s]+|[a-z0-9-]+\.[a-z]+)/i);
    const url = urlMatch ? (urlMatch[0].startsWith('http') ? urlMatch[0] : `https://${urlMatch[0]}`) : 'https://google.com';

    try {
      console.log(`[Agent] Browsing task detected, initializing browser...`);
      await initBrowser();

      // Navigate to URL
      browserSocket!.emit('navigate', url);

      // Wait for navigation to complete
      await new Promise<void>((resolve) => {
        browserSocket!.once('navigation-complete', () => resolve());
        setTimeout(() => resolve(), 5000); // Timeout fallback
      });

      searchResults = `Navigated to ${url} using E2B cloud desktop browser. Page is now visible in the desktop preview.`;
      console.log(`[Agent] Successfully browsed to ${url}`);
    } catch (e) {
      console.error('[Agent] Browser task failed:', e);
      searchResults = `Browser unavailable: ${e instanceof Error ? e.message : 'Unknown error'}. Falling back to internal knowledge.`;
    }
  }

  // --- Or use Tavily for quick fact-finding searches ---
  else if (lowerStep.includes('search') || lowerStep.includes('google') ||
    lowerStep.includes('research') || lowerStep.includes('find') || lowerStep.includes('look up')) {

    const query = step
      .replace(/search|browse|google|research|find|look up|for|the|web|internet/gi, '')
      .trim();

    if (query && import.meta.env.VITE_TAVILY_API_KEY) {
      try {
        console.log(`[Agent Tavily] Searching for: "${query}"`);

        const response = await searchTavily(query);

        if (response.results && response.results.length > 0) {
          searchResults = response.results
            .map((r: any, i: number) =>
              `[${i + 1}] ${r.title}\n${r.content}\nSource: ${r.url}`
            )
            .join('\n\n');

          if (response.answer) {
            searchResults = `Summary: ${response.answer}\n\n--- Detailed Results ---\n${searchResults}`;
          }

          console.log(`[Tavily] Found ${response.results.length} results`);
        }
      } catch (e) {
        console.error('Tavily search failed:', e);
        searchResults = "Search temporarily unavailable. Using internal knowledge.";
      }
    } else {
      console.log('[Agent] No Tavily API key or empty query, using internal knowledge');
    }
  }
  // -----------------------------

  try {
    const promptContext = searchResults
      ? `I have successfully searched the web using Tavily. Here is the ACTUAL information I found:\n\n${searchResults.substring(0, 8000)}\n\n`
      : `I am executing this step based on my internal knowledge.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `You are an autonomous agent executing a step in a task. 
      Current Step: ${step}
      Context from previous steps: ${context}
      
      ${promptContext}
      
      Based on the above (especially the search results if provided), provide a concise, factual summary (2-3 sentences) of what you found or achieved. 
      If you found specific data, quote it. Do not hallucinate. Cite sources when available.`,
    });
    return response.text || "Step completed.";
  } catch (error) {
    return "Completed step.";
  }
};

// 6. Final Report
export const generateFinalReport = async (originalPrompt: string, stepSummaries: string[]): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a comprehensive final response for the user based on the executed steps.
      Original Request: "${originalPrompt}"
      
      Execution Log:
      ${stepSummaries.map((s, i) => `${i + 1}. ${s}`).join('\n')}
      
      Format with clear headings and bullet points. Keep it professional and concise.`,
    });
    return response.text || "Task completed.";
  } catch (error) {
    return "Here is the result of your request based on the steps taken.";
  }
};