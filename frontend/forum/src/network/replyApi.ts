import { ReplyType } from "../interfaces/reply";

export default async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    if (response.ok) {
        return response;
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        throw Error(errorMessage);
    }
}

export async function getAllReplies(threadID: number): Promise<Array<ReplyType>> {
    const response = await fetchData(`/api/${threadID}`, { method: "GET" });
    return response.json();
}

export async function newReply({threadID, reply}: {threadID: number, reply: string}){
    await fetchData(`/api/${threadID}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({reply: reply}),
            credentials: "include"
        });
}
