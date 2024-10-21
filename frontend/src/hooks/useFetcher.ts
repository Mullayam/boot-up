
export const useFetcher = (path:string,options:RequestInit) => fetch(`http://localhost:7134${path}`,options)
