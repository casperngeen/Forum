import { ReplyType } from "../interfaces/reply";

const URL = "http://localhost:3000/"

export async function getAllReplies(threadID: number): Promise<Array<ReplyType>> {
    const response = await fetch(`${URL}${threadID}`, 
        { 
            method: "GET",
            mode: "cors"
        });
    if (response.ok) {
        return await response.json();
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        throw Error(errorMessage);
    }
}

export async function newReply({threadID, reply}: {threadID: number, reply: string}){
    const response = await fetch(`${URL}${threadID}`,
        {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({reply: reply}),
            credentials: "include"
        });
    
    if (response.ok) {
        return response;
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        throw Error(errorMessage);
    }
}
