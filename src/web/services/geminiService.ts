
import { GoogleGenAI, Type } from "@google/genai";
import { GameState } from "../types";
import { CROPS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getFarmAdvice = async (gameState: GameState) => {
  const plotSummary = gameState.plots.map(p => p.status).join(', ');
  const cropsInfo = Object.values(CROPS).map(c => `${c.name} (Mua: ${c.buyPrice}, Bán: ${c.sellPrice})`).join(', ');

  const prompt = `
    Bạn là một chuyên gia nông nghiệp trong trò chơi Pixel Farm.
    Trạng thái hiện tại của người chơi:
    - Tiền: ${gameState.money} vàng
    - Ô đất: ${gameState.plots.length} ô (Trạng thái: ${plotSummary})
    - Danh sách cây: ${cropsInfo}

    Hãy đưa ra 2-3 lời khuyên ngắn gọn (tối đa 2 câu mỗi lời khuyên) bằng tiếng Việt để người chơi làm giàu nhanh nhất. 
    Khuyên họ nên trồng gì hoặc mua thêm đất khi nào.
    Hãy tỏ ra thân thiện như một người hàng xóm.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Hãy tiếp tục chăm chỉ làm việc nhé! Đất đai sẽ không phụ lòng người đâu.";
  }
};
