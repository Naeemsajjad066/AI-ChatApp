import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.github.ai/inference";
const modelName = "gpt-4o";

/**
 * Generate AI response using GitHub Models (GPT-4)
 */
export async function generateGitHubModelsResponse(prompt: string): Promise<string> {
  if (!token) {
    console.error('GitHub token not configured');
    return `[GitHub Models not configured] You said: ${prompt}`;
  }

  try {
    const client = ModelClient(
      endpoint,
      new AzureKeyCredential(token),
    );

    const response = await client.path("/chat/completions").post({
      body: {
        messages: [
          { role: "system", content: "You are a helpful AI assistant." },
          { role: "user", content: prompt }
        ],
        temperature: 1,
        top_p: 1,
        max_tokens: 1000,
        model: modelName
      }
    });

    if (isUnexpected(response)) {
      console.error('GitHub Models API error:', response.body.error);
      return `You said: ${prompt}`;
    }

    const content = response.body.choices?.[0]?.message?.content;
    return content || 'No response generated';
  } catch (error: any) {
    console.error('GitHub Models API error details:', {
      message: error?.message,
      stack: error?.stack,
    });
    
    // Return fallback response on error
    return `You said: ${prompt}`;
  }
}
