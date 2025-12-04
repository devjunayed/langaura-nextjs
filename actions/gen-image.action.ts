"use server";

import { GenerateContentResponse, GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

export async function GenImage() {
  const ai = new GoogleGenAI({});

  const prompt =
    "Create a picture of nano banana dish in a fancy restuarant with a Gemini theme";

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: prompt,
  });


  const candidate = response.candidates?.[0]

  if(!candidate) {
    console.error("No candidate returned") 
    return;
  };

  for(const part of candidate.content?.parts!){
    if("text" in part && part.text){
        console.log(part.text)
    }else if("inlineData" in part && part.inlineData){
        const imageData = part.inlineData.data!;
        const buffer: Buffer = Buffer.from(imageData, "base64");
        const uint8= Uint8Array.from(buffer)
        fs.writeFileSync("asjfjs.png", uint8);
        console.log('image saved as asjfjs.png');
    }
  }

  
}
