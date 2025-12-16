import { streamText, convertToCoreMessages, UIMessage } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages: convertToCoreMessages(messages),

    tools: {
      weather: {
        description: 'Get the weather in a location (fahrenheit)',
        parameters: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }: { location: string }) => {
          const temperature = Math.round(
            Math.random() * (90 - 32) + 32
          );

          return {
            location,
            temperature,
          };
        },
      },

      convertFahrenheitToCelsius: {
        description: 'Convert a temperature in fahrenheit to celsius',
        parameters: z.object({
          temperature: z
            .number()
            .describe('The temperature in fahrenheit to convert'),
        }),
        execute: async ({ temperature }: { temperature: number }) => {
          const celsius = Math.round((temperature - 32) * (5 / 9));

          return {
            celsius,
          };
        },
      },
    },
  });

  return result.toDataStreamResponse();
}
