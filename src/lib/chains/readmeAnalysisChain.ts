import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

// Define the schema
const schema = z.object({
  summary: z
    .string()
    .min(1)
    .max(500)
    .describe("A concise summary of the repository"),
  cool_facts: z
    .array(z.string().min(1).max(200))
    .min(1)
    .max(4)
    .describe("Array of 1-4 interesting technical facts about the repository"),
});

// Create the prompt template
const prompt = PromptTemplate.fromTemplate(`
Analyze the following GitHub repository README content and provide a concise summary and interesting facts.
Be informative but brief.

README Content:
{readmeContent}
`);

export const createReadmeAnalysisChain = () => {
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0,
  });

  return prompt.pipe(model.withStructuredOutput(schema));
};
