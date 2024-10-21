
export const useFetcher = (path:string,options:RequestInit) => fetch(`https://boot-up.onrender.com${path}`,options)
