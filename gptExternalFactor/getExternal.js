import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
  const completion = await openai.completions.create({
    model: 'gpt-3.5-turbo-instruct',
    prompt: "please give some key external factors that influencing restaurants' sales. Here are some requirement: return it in Json object 2. it should follow the interface {factor: string; reason:string} 3. example: const externalfactos=[{factos:weather,reason: it could impact ...}]"
  });
  
  console.log(completion.choices);
}   

main();

