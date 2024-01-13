import { ThreadType } from "../types/thread";

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

export async function getSingleThread(threadID: number): Promise<ThreadType> {
    const response = await fetch(`${URL}threads/${threadID}`, 
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

export async function editThread({threadID, newContent}: {threadID: number, newContent: string}) {
    const response = await fetch(URL + `${threadID}`,
    {
        method: "PUT",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({content: newContent}),
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

export async function deleteThread({threadID}: {threadID: number}) {
    const response = await fetch(URL + `${threadID}`,
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
