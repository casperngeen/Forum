import { ReplyType } from "../types/reply";

const URL = "http://localhost:3000/"

export async function getAllReplies(threadID: number): Promise<Array<ReplyType>> {
    const response = await fetch(`${URL}${threadID}`, 
        { 
            method: "GET"
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

export async function editReply({threadID, replyID, newReply}: {threadID: number, replyID: number, newReply: string}){
    const response = await fetch(`${URL}${threadID}/${replyID}`,
        {
            method: "PUT",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({reply: newReply}),
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

export async function deleteReply({threadID, replyID}: {threadID: number, replyID: number}){
    const response = await fetch(`${URL}${threadID}/${replyID}`,
        {
            method: "DELETE",
            mode: "cors",
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

