import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Mistral } from "@mistralai/mistralai";
import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `Você é a Nexora AI, um assistente minimalista, altamente inteligente e imersivo.
Mantenha suas respostas concisas, claras e focadas. Você tem uma inteligência refinada e silenciosa.
Responda sempre em português.

[MEMÓRIA E CONTEXTO]
Você deve agir como se tivesse uma memória de longo prazo contínua. 
Preste muita atenção e sempre lembre do nome do usuário e de preferências pessoais ou informações importantes (profissão, hobbies, gostos) que ele mencionar ao longo da conversa. Incorpore esses detalhes de maneira sutil e natural em suas respostas futuras para demonstrar que você o conhece.

[GERAÇÃO DE IMAGENS]
Se o usuário pedir para gerar, criar, desenhar ou pintar uma imagem, você DEVE responder incluindo a seguinte tag na sua resposta:
[GERAR_IMAGEM: <descrição detalhada em inglês da imagem>]
A descrição deve ser muito detalhada, em inglês, otimizada para um gerador de imagens IA.`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      
      const formattedHistory = history.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }));

      const messages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...formattedHistory,
        { role: "user", content: message }
      ];

      let reply: string = "";

      const mistralKey = process.env.MISTRAL_API_KEY;
      if (!mistralKey) {
        return res.status(500).json({ error: "MISTRAL_API_KEY environment variable is required" });
      }
      
      const mistral = new Mistral({ apiKey: mistralKey });
      const mistralResponse = await mistral.chat.complete({
        model: "mistral-large-latest",
        messages: messages as any,
      });
      
      const content = mistralResponse.choices?.[0]?.message?.content || "";
      if (typeof content !== 'string') {
         reply = JSON.stringify(content);
      } else {
         reply = content;
      }

      const imageMatch = reply.match(/\[GERAR_IMAGEM:\s*(.*?)\]/i);
      if (imageMatch) {
        const imagePrompt = imageMatch[1];
        const geminiKey = process.env.GEMINI_API_KEY;
        if (!geminiKey) {
           reply = reply.replace(imageMatch[0], "\n\n*(Erro: GEMINI_API_KEY não configurada para gerar imagens)*\n\n");
        } else {
           const ai = new GoogleGenAI({ apiKey: geminiKey });
           try {
             const imageRes = await ai.models.generateImages({
               model: "imagen-3.0-generate-002",
               prompt: imagePrompt,
               config: {
                 numberOfImages: 1,
                 outputMimeType: "image/jpeg",
                 aspectRatio: "1:1"
               }
             });
             const base64Image = imageRes.generatedImages[0].image.imageBytes;
             const imageUrl = `data:image/jpeg;base64,${base64Image}`;
             reply = reply.replace(imageMatch[0], `\n\n![Imagem gerada](${imageUrl})\n\n`);
           } catch (e: any) {
             console.error("Gemini Image error:", e);
             reply = reply.replace(imageMatch[0], `\n\n*(Erro ao gerar imagem: ${e.message})*\n\n`);
           }
        }
      }

      res.json({ text: reply });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Failed to generate response" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
