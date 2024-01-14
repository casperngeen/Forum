export const checkLoggedIn = () => {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [name, value] = cookie.split("=");
        if(name === "username") {
            return value;
        }
    }
    return null;
}