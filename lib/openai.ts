import OpenAi from "openai";

export const openai = new OpenAi({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getEmbedding(text: string) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });

    const embedding = response.data[0].embedding;

    if (!embedding) throw Error("Error generating embedding.");

    return embedding;
  } catch (error) {
    throw Error("Error generating embedding.");
  }
}
