import { useState } from "react";
import { createPost } from "../services/api";
import type { NewPost } from "../types/Post";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    try {
        const newPost: NewPost = {
            title,
            body,
            userId: 1
        }

        await createPost(newPost)
      

      alert("Your post is live");
      setTitle("");
      setBody("");
    } catch (error) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="container">
      <h2>Create New Post</h2>
      
      {error && <p style={{color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Post Title" onChange={(e) => setTitle(e.target.value)} value={title} required />
        <textarea
          placeholder="Post Content"
          value={body}
          rows={10}
          onChange={(e) => setBody(e.target.value)}
          required
        ></textarea>
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};
export default CreatePost