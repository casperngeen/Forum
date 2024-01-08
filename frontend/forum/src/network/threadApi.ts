import { ThreadType } from "../interfaces/thread";

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

export async function getAllThreads(): Promise<Array<ThreadType>> {
    const response = await fetchData("/api/threads", { method: "GET"});
    return await response.json();
}

interface Post {
    title: string,
    content: string,
}

export async function newThread(post: Post){
    await fetchData("/api/new",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(post),
            credentials: "include"
        });
}
