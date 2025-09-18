import { useState, useEffect } from "react";
import {
  fetchPosts
} from "../services/api";
import type { Post } from "../types/Post";

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  
  return (
    <div className="container">
        {/* Link to CreatePost Page */}
        <button>Create Post</button>
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
