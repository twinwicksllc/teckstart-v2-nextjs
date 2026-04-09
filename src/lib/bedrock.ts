import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

// MODEL UPDATE v5 - 2026-01-29 - Fixed JSON parsing (strip markdown fences) + Haiku fallback model
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
});

export interface ParsedReceipt {
  merchantName?: string;
  date?: string;
  total?: number;
  tax?: number;
  currency?: string;
  category?: string;
  isTaxable?: boolean;
  lineItems?: Array<{
    description: string;
    quantity?: number;
    unitPrice?: number;
    amount: number;
  }>;
  rawResponse?: Record<string, unknown>;
}

/**
 * Strip markdown code fences from Claude responses.
 * Newer Claude models sometimes wrap JSON in ```json ... ``` blocks.
 */
function extractJsonFromResponse(text: string): string {
  // Remove ```json ... ``` or ``` ... ``` wrappers
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    return fenceMatch[1].trim();
  }
  // Return trimmed text as-is if no fences found
  return text.trim();
}

/**
 * Parse receipt using Claude Sonnet 4.5 via Bedrock (primary)
 */
export async function parseReceiptWithBedrock(
  imageBase64: string,
  imageMediaType: string
): Promise<ParsedReceipt> {
  const prompt = `You are an expert receipt parser for freelance expense tracking and tax filing (US Schedule C).

Analyze the provided receipt image and extract the following information in JSON format:

{
  "merchantName": "The business/vendor name",
  "date": "Receipt date in YYYY-MM-DD format",
  "total": "Total amount as a number (e.g., 99.99)",
  "tax": "Tax amount as a number, null if not present",
  "currency": "Currency code (USD, EUR, etc.) or null",
  "category": "Expense category - one of: [Advertising, Office Supplies, Meals, Travel, Equipment, Software, Professional Services, Internet, Phone, Utilities, Insurance, Rent, Other]",
  "isTaxable": "Boolean - is this expense tax deductible under US IRS Schedule C rules?",
  "lineItems": [
    {
      "description": "Item description",
      "quantity": "Quantity if present, null otherwise",
      "unitPrice": "Unit price if present, null otherwise",
      "amount": "Line item total as number"
    }
  ]
}

Important rules:
1. Be strict about accuracy - only extract values you can clearly see
2. For "isTaxable", use IRS Schedule C deductibility rules for freelancers/self-employed
3. If you cannot determine a field, omit it rather than guessing
4. For currency, infer from symbols ($ = USD, € = EUR, £ = GBP, etc.)
5. Preserve line item details when present; omit if not visible
6. Return ONLY valid JSON with no markdown formatting, no code fences, no additional text

Respond with only the raw JSON object, no \`\`\` wrapping.`;

  try {
    const isPdf = imageMediaType === "application/pdf";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content: any[] = [
      {
        type: "text" as const,
        text: prompt,
      },
    ];

    if (isPdf) {
      content.unshift({
        type: "document" as const,
        source: {
          type: "base64" as const,
          media_type: "application/pdf" as const,
          data: imageBase64,
        },
      });
    } else {
      content.unshift({
        type: "image" as const,
        source: {
          type: "base64" as const,
          media_type: imageMediaType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
          data: imageBase64,
        },
      });
    }

    const message = {
      role: "user" as const,
      content,
    };

    const command = new InvokeModelCommand({
      modelId: "us.anthropic.claude-sonnet-4-5-20250929-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1024,
        messages: [message],
      }),
    });

    const response = await bedrockClient.send(command);
    const responseText = new TextDecoder().decode(response.body);
    const parsedResponse = JSON.parse(responseText);

    if (parsedResponse.content && parsedResponse.content.length > 0) {
      const textContent = parsedResponse.content.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (c: any) => c.type === "text"
      );
      if (textContent) {
        try {
          const cleanedText = extractJsonFromResponse(textContent.text);
          const parsed = JSON.parse(cleanedText);
          return {
            ...parsed,
            rawResponse: parsedResponse,
          };
        } catch {
          console.error("Failed to parse Claude Sonnet response as JSON:", textContent.text);
          throw new Error("AI parsing returned invalid JSON format");
        }
      }
    }

    throw new Error("No text response from AI model");
  } catch (error) {
    console.error("Bedrock Sonnet parsing error:", error);
    if (error instanceof Error) {
      throw new Error(`Receipt parsing failed: ${error.message}`);
    }
    throw new Error("Receipt parsing failed");
  }
}

/**
 * Fallback using Claude 3.5 Haiku (claude-3-5-haiku-20241022) - lightweight and reliable
 */
export async function parseReceiptWithHaiku(
  imageBase64: string,
  imageMediaType: string
): Promise<ParsedReceipt> {
  const prompt = `Extract receipt information as JSON with these fields: merchantName, date (YYYY-MM-DD), total (number), tax (number or null), currency, category (one of: Advertising, Office Supplies, Meals, Travel, Equipment, Software, Professional Services, Internet, Phone, Utilities, Insurance, Rent, Other), isTaxable (boolean), lineItems (array of {description, quantity, unitPrice, amount}).

Return only a raw JSON object with no markdown, no code fences, no additional text.`;

  try {
    const isPdf = imageMediaType === "application/pdf";
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content: any[] = [
      {
        type: "text" as const,
        text: prompt,
      },
    ];

    if (isPdf) {
      content.unshift({
        type: "document" as const,
        source: {
          type: "base64" as const,
          media_type: "application/pdf" as const,
          data: imageBase64,
        },
      });
    } else {
      content.unshift({
        type: "image" as const,
        source: {
          type: "base64" as const,
          media_type: imageMediaType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
          data: imageBase64,
        },
      });
    }

    const message = {
      role: "user" as const,
      content,
    };

    const command = new InvokeModelCommand({
      // Falling back to Claude 3.5 Haiku - stable, no marketplace subscription needed
      modelId: "us.anthropic.claude-3-5-haiku-20241022-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 512,
        messages: [message],
      }),
    });

    const response = await bedrockClient.send(command);
    const responseText = new TextDecoder().decode(response.body);
    const parsedResponse = JSON.parse(responseText);

    if (parsedResponse.content && parsedResponse.content.length > 0) {
      const textContent = parsedResponse.content.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (c: any) => c.type === "text"
      );
      if (textContent) {
        try {
          const cleanedText = extractJsonFromResponse(textContent.text);
          const parsed = JSON.parse(cleanedText);
          return {
            ...parsed,
            rawResponse: parsedResponse,
          };
        } catch {
          throw new Error("AI parsing returned invalid JSON format");
        }
      }
    }

    throw new Error("No text response from AI model");
  } catch (error) {
    console.error("Bedrock Haiku parsing error:", error);
    throw error;
  }
}