import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

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

const outputParser = StructuredOutputParser.fromZodSchema(schema);

const prompt = new PromptTemplate({
  template:
    "Analyze the following GitHub repository README content and provide a concise summary and interesting facts.\n\nREADME Content:\n{readmeContent}\n\n{format_instructions}",
  inputVariables: ["readmeContent"],
  partialVariables: {
    format_instructions: outputParser.getFormatInstructions(),
  },
});

export const createReadmeAnalysisChain = () => {
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0, // more predictable output
  });

  return RunnableSequence.from([prompt, model, outputParser]);
};
