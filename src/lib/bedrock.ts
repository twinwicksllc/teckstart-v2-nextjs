import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

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
  rawResponse?: Record<string, any>;
}

/**
 * Parse receipt using Claude 3.5 Sonnet via Bedrock
 */
export async function parseReceiptWithBedrock(
  imageBase64: string,
  imageMediaType: string,
  fileName: string
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
6. Return ONLY valid JSON, no additional text

Respond with only the JSON object.`;

  try {
    const isPdf = imageMediaType === "application/pdf";
    
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
          name: fileName.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 50) || "receipt",
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
      modelId: "us.anthropic.claude-3-5-sonnet-20241022-v2:0",
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
        (c: any) => c.type === "text"
      );
      if (textContent) {
        try {
          const parsed = JSON.parse(textContent.text);
          return {
            ...parsed,
            rawResponse: parsedResponse,
          };
        } catch {
          console.error("Failed to parse Claude response as JSON:", textContent.text);
          throw new Error("AI parsing returned invalid JSON format");
        }
      }
    }

    throw new Error("No text response from AI model");
  } catch (error) {
    console.error("Bedrock parsing error:", error);
    if (error instanceof Error) {
      throw new Error(`Receipt parsing failed: ${error.message}`);
    }
    throw new Error("Receipt parsing failed");
  }
}

/**
 * Fallback to Claude 3.5 Haiku for faster/cheaper parsing if needed
 */
export async function parseReceiptWithHaiku(
  imageBase64: string,
  imageMediaType: string,
  fileName: string
): Promise<ParsedReceipt> {
  const prompt = `Extract receipt information as JSON: {merchantName, date (YYYY-MM-DD), total (number), tax (number or null), currency, category, isTaxable (boolean), lineItems (array of {description, quantity, unitPrice, amount})}. Return only valid JSON.`;

  try {
    const isPdf = imageMediaType === "application/pdf";
    
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
          name: fileName.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 50) || "receipt",
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
        (c: any) => c.type === "text"
      );
      if (textContent) {
        try {
          const parsed = JSON.parse(textContent.text);
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
