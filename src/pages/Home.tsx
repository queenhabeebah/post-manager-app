import { useState, useEffect } from "react";
import { createPost, fetchPosts, updatePost } from "../services/api";
import type { NewPost, Post } from "../types/Post";

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

  // Add newly created post to the UI
  const handleAddPost = async (newPost: NewPost) => {
    try {
      const created = await createPost(newPost);
      setPosts((prev) => [created, ...prev]); // Add new post to thr top
    } catch (error) {}
  };

  // Submit created post
  // Add a state for showing/hiding the create form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostBody, setNewPostBody] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddPost({ userId: 1, title: newPostTitle, body: newPostBody });
    alert("Post created successfully");
    setNewPostTitle("");
    setNewPostBody("");
  };

  // Edit a post
  const [editPostId, setEditPostId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  const startEditing = (post: Post) => {
    setEditPostId(post.id);
    setEditTitle(post.title);
    setEditBody(post.body);
  };
  // Update the UI
  const handleSaveEdit = async (id: number) => {
    try {
      const updated: Post = { id, userId: 1, title: editTitle, body: editBody };
      const editedPost = await updatePost(id, updated);
      setPosts((prev) =>
        prev.map((post) => (post.id === id ? editedPost : post))
      );
      // Reset edit state
      setEditPostId(null);
      setEditTitle("");
      setEditBody("");
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div className="container">

      {/* Add toggle button for show/hide CreateForm */}
      <button onClick={() => setShowCreateForm((prev) => !prev)}>
        {showCreateForm ? "Close Form" : "Create a New Post"}
      </button>


        {/* Conditional Form for creating a new post */}
{showCreateForm && (
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

)}

{/* Post list */}
      {posts.map((post) => (
        <div key={post.id} className="postCard">

          {/* Inline Edit Form for editing a post */}
          {editPostId === post.id ? (
            <>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                />

              <textarea
                rows={10}
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                />
              <button onClick={() => handleSaveEdit(post.id)}>Save</button>
              <button onClick={() => setEditPostId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <h2 className="postTitle">{post.title}</h2>
              <p className="postBody">{post.body}</p>
              <button onClick={() => startEditing(post)}>Edit</button>
            </>
          )}
        </div>
      ))}
      

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
