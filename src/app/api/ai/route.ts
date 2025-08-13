import { openrouter } from "@/ai/open-router";
import { tools } from "@/ai/tools";
import { streamText } from "ai";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { messages } = await request.json()

  const result = streamText({
    model: openrouter.chat('openai/gpt-4o-2024-11-20'),
    tools,
    messages,
    maxSteps: 5,
    toolChoice: 'required',
    system: `
      Sempre responda em markdown sem aspas no início ou fim da mensagem.
    `,
  })

  return result.toDataStreamResponse()
}

// Gerando resposta em texto: 
// export async function GET(request: NextRequest) {
//   const result = await generateText({
//     model: openai('gpt-4o'),
//     prompt: 'Traduza "Hello World" para português!',
//     system: 'Você é uma AI especializada em tradução, sempre retorne da maneira sucinta possível.'
//   })

//   return NextResponse.json({ message: result.text })
// }

// Gerando dados estruturados: 
// export async function GET(request: NextRequest) {
//   const result = await generateObject({
//     model: openrouter.chat('openai/gpt-4o-2024-11-20'),
//     schema: z.object({
//       pt: z.string().describe("Tradução para português"),
//       fr: z.string().describe("Tradução para francês"),
//       es: z.string().describe("Tradução para espanhol"),
//     }),
//     prompt: 'Traduza "Hello World" para diferentes idiomas!',
//     system: 'Você é uma AI especializada em tradução, sempre retorne da maneira sucinta possível.'
//   })

//   return NextResponse.json({ message: result.object })
// }

// Generate with Tool Calling
// export async function GET(request: NextRequest) {
//   const result = await generateText({
//     model: openrouter.chat('openai/gpt-4o-2024-11-20'),
//     tools: {
//       profileAndUrls: tool({
//         description: 'Essa ferramenta serve para buscar do perfil de um usuário do GitHub ou acessar URLs da API para outras informações de um usuário como lista de organizações, repositórios, eventos, seguidores, seguindo, etc...',
//         parameters: z.object({
//           username: z.string().describe('Username do usuário no GitHub'),
//         }),
//         execute: async ({ username }) => {
//           const response = await fetch(`https://api.github.com/users/${username}`)
//           const data = await response.json()

//           return JSON.stringify(data)
//         }
//       }),

//       fetchHTTP: tool({
//         description: "Essa ferramenta serve para realizar uma requisição HTTP em uma URL especificada e acessar sua resposta",
//         parameters: z.object({
//           url: z.string().describe('URL a ser requisitada'),
//         }),
//         execute: async ({ url }) => {
//           const response = await fetch(url)
//           const data = await response.text()

//           return data
//         }
//       })
//     },
//     prompt: 'Me dê uma lista de usuários que o usuário diego3g segue no GitHub?',
//     maxSteps: 5,

//     onStepFinish({ toolResults }) {
//       console.log(toolResults)
//     }
//   })

//   return NextResponse.json({ message: result.text, parts: result.toolResults })
// }