import { useState, useEffect } from "react";
import { createPost, fetchPosts } from "../services/api";
import type { NewPost, Post } from "../types/Post";
import { Link } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Load posts
    const loadPosts = async () => {
      try {
        const data = await fetchPosts(); //fetchPosts alredy defined in api
        setPosts(data);
      } catch (error) {
        setError("Failed to fetch posts"); //Error message when posts refused to load
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  const handleAddPost = async (newPost: NewPost) => {
    try {
      const created = await createPost(newPost);
      setPosts((prev) => [created, ...prev]); // Add new post to thr top
    } catch (error) {}
  };

  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostBody, setNewPostBody] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddPost({ userId: 1, title: newPostTitle, body: newPostBody });
    setNewPostTitle("");
    setNewPostBody("");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <aside>
        <h2>Create a new post</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Post Title"
            onChange={(e) => setNewPostTitle(e.target.value)}
            value={newPostTitle}
            required
          />
          <textarea
            placeholder="Post Content"
            value={newPostBody}
            rows={10}
            onChange={(e) => setNewPostBody(e.target.value)}
            required
          ></textarea>
          <button type="submit">Create Post</button>
        </form>
      </aside>
      <h1 className="heading">Top Posts</h1>

      {/* Iterate over the posts array and display just title and body */}
      {posts.map((post) => (
        <div key={post.id} className="postCard">
          <h2 className="postTitle">{post.title}</h2>
          <p className="postBody">{post.body}</p>
        </div>
      ))}
    </div>
  );
};
export default Home;
