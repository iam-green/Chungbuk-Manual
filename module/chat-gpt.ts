import OpenAI from "openai";

export class ChatGPT {
  private static readonly openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  static async run(
    model: OpenAI.Chat.ChatModel,
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
  ) {
    const completion = await this.openai.chat.completions.create({
      messages,
      model,
    });
    return completion.choices[0].message.content;
  }

  static async tour(keyword: string[], tour: string[]) {
    return this.run("gpt-4o-mini", [
      {
        role: "user",
        content: `${keyword.join(
          ", "
        )}을 키워드로 하는 충청북도의 관광지 중 하나를 추천해서 이름만 말해줘 (입니다와 . 빼줘)`,
      },
      ...tour?.flatMap((v) => [
        { role: "system", content: v },
        {
          role: "user",
          content: `${keyword.join(
            ", "
          )}을 키워드로 하는 충청북도의 다른 관광지를 추천해서 이름만 말해줘 (입니다와 . 빼줘)`,
        },
      ]),
    ] as unknown as OpenAI.Chat.Completions.ChatCompletionMessageParam[]);
  }

  static async chat(tour: string, chat: string) {
    return this.run("gpt-4o-mini", [
      {
        role: "user",
        content: `충청북도의 ${tour} 관광지에 대해서 '${chat}'에 대한 답변을 50글자 이내로 해줘`,
      },
    ]);
  }
}
