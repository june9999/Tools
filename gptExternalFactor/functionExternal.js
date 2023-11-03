import OpenAI from "openai";
const openai = new OpenAI();

// In production, this could be your backend API or an external API
function getExternalFactor(Externalfactors,factor, reason,sources) {
    
    const factorInfo = {
        "factor": factor,
        "reason": reason,
        "sources": sources,
    };
    return JSON.stringify(factorInfo);
}

async function runConversation() {
    // Step 1: send the conversation and available functions to GPT
    const messages = [{"role": "user", "content": "give some key external factors influencing restaurants' sales?"}];
    const functions = [
        {
            "name": "write_external",
            "description": "write it into database",
            "parameters": {
                "type": "object",
                "properties": {
                  "Externalfactors":{
                    "items":{"factor": {
                      "type": "string",
                      "description": "keywords about key factor, such as weather, covid",
                  },
                  "reason": {
                    "type": "string",
                    "description": "one sentence explain why it is a important factors",
                },
                "sources": {
                  "items": {
                    "type": "string",
                    "description": "URLs where to find more related information",
                },
              },
                  }}
                    
                },
                "required": ["Externalfactors","factor","reason","sources"],
            },
        }
    ];

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        functions: functions,
        function_call: {"name": "write_external"},  // auto is default, but we'll be explicit
    });
    const responseMessage = response.choices[0].message;
    // Step 2: check if GPT wanted to call a function

    console.log(responseMessage.function_call)
    console.log(response.choices[0].message)
    if (responseMessage.function_call) {
        // Step 3: call the function
        // Note: the JSON response may not always be valid; be sure to handle errors
        const availableFunctions = {
          write_external: getExternalFactor,
        };  // only one function in this example, but you can have multiple
        const functionName = responseMessage.function_call.name;
        const functionToCall = availableFunctions[functionName];
        const functionArgs = JSON.parse(responseMessage.function_call.arguments);
        const functionResponse = functionToCall(
          functionArgs.Externalfactors,
            functionArgs.factor,
            functionArgs.reason,
            functionArgs.sources,
        );
        console.log(functionResponse)


}}

runConversation();