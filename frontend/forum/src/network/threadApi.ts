import { ThreadType } from "../interfaces/thread";

const URL = "http://localhost:3000/"

export async function getAllThreads(): Promise<Array<ThreadType>> {
    const response = await fetch(URL + "threads", 
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

interface Post {
    title: string,
    content: string,
}

export async function newThread(post: Post){
    const response = await fetch(URL + "new",
        {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(post),
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
