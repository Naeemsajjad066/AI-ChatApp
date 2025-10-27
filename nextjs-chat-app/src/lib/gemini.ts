import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client if API key is provided
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

/**
 * Generate AI response using Google Gemini
 */
export async function generateGeminiResponse(prompt: string): Promise<string> {
  if (!genAI) {
    console.error('Gemini API key not configured');
    return `[Gemini not configured] You said: ${prompt}`;
  }

  try {
    // Use Gemini 2.0 Flash (latest available model)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text || 'No response generated';
  } catch (error: any) {
    console.error('Gemini API error details:', {
      message: error?.message,
      stack: error?.stack,
      response: error?.response?.data,
    });
    
    // Return fallback response on error
    return `You said: ${prompt}`;
  }
}
