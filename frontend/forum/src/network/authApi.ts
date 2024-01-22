// a general function for fetch APIs, the first param is the path to the resource to fetch data from, 

import UserType from "../types/user";

const URL = "http://localhost:3000/"

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

export async function register(credentials: Credentials) {
    const response = await fetch(URL + "register",
        {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });
    if (response.ok) {
        return response;
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        throw Error(errorMessage);
    }
}

export async function login(credentials: Credentials): Promise<UserType> {
    const response = await fetch(URL + "login",
        {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });
    if (response.ok) {
        try {
            return await response.json();
        } catch (error) {
            console.log(error);
            throw Error;
        }
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        throw Error(errorMessage);
    }
}

export async function refresh(): Promise<Response> {
    const response = await fetch(URL + "refresh",
        {
            method: "POST",
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

export async function logout(): Promise<Response> {
    const response = await fetch(URL + "logout", { 
        method: "DELETE",
        mode: "cors", 
        credentials: 'include' 
    }); // credentials: include tells the browser to include the JWT cookie

    if (response.ok) {
        return response;
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        throw Error(errorMessage);
    }
}  
