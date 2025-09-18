import axios from "axios";
import type { Post, NewPost  } from "../types/Post";

// Store the base URL in a variable
const BASE_URL = "https://jsonplaceholder.typicode.com/posts";

// Fetch all required posts from the BASE_URL
export async function fetchPosts(limit: number = 10) : Promise<Post[]> {
    const res = await axios.get<Post[]>(`${BASE_URL}?_limit=${limit}`)
    return res.data
}

// Create a post and add it to the available posts
export async function createPost(newPost: NewPost) : Promise<Post> {
    const res = await axios.post<Post>(BASE_URL, newPost)
    return res.data
}

// Edit a post and update the posts
export async function updatePost(id: number, updated: Post) : Promise<Post> {
    const res = await axios.put<Post>(`${BASE_URL}/${id}`, updated)
return res.data
}

// Delete a post and remove from other posts
export async function deletePost(id: number) : Promise<void>{
    await axios.delete(`${BASE_URL}/${id}`)
}