// Define Types
export interface Post{
    id: number; 
    userId: number
    title: string
    body: string
}

export interface NewPost{
    title: string
    body: string
    userId: number
}