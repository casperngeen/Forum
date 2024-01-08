// a general function for fetch APIs, the first param is the path to the resource to fetch data from, 

import { User } from "../interfaces/user";

//      the second (optional) param INIT specifies properties of the request object
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

/*
export async function getLoggedInUser(): Promise<User> {
    const response = await fetchData("/api/users", { method: "GET" });
    return response.json(); 
}
*/

interface Credentials {
    username: string,
    password: string,
}

// to edit
export async function register(credentials: Credentials) {
    await fetchData("/api/register",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });
}

export async function login(credentials: Credentials): Promise<User> {
    const response = await fetchData("/api/login",
        {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });
    return await response.json();
}

export async function refresh(): Promise<Response> {
    return await fetchData("/api/refresh",
        {
            method: "POST",
            credentials: "include"
        });
}

export async function logout(): Promise<Response> {
    return await fetchData("/api/logout", { 
        method: "DELETE", 
        credentials: 'include' 
    }); // credentials: include tells the browser to include the JWT cookie
}  
