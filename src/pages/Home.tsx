import { useState, useEffect } from "react";
import {
  createPost,
  deletePost,
  fetchPosts,
  updatePost,
} from "../services/api";
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

  // Submit created post
  // Add a state for showing/hiding the create form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostBody, setNewPostBody] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddPost({ userId: 1, title: newPostTitle, body: newPostBody });
    setNewPostTitle("");
    setNewPostBody("");
    alert("Post created successfully");
  };
  
  // Add newly created post to the UI
  const handleAddPost = async (newPost: NewPost) => {
    try {
      const created = await createPost(newPost);
      //Add unique id and to not rely on placeholder's fake id
      created.id = Date.now() 
      setPosts((prev) => [created, ...prev]); // Add new post to thr top
    } catch (error) {}
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

  // Delete post logic
  const handleDelete = async (id: number) => {
    if(!window.confirm('Delete this post?')) return
    try {
      await deletePost(id);
      setPosts((prev)  => prev.filter((post) => post.id !== id))
      alert(
        'Post deleted'
      )
    } catch (error) {
      console.error("Failed to delete post");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      {/* Add toggle button for show/hide CreateForm */}
      <button
        className="toggleButton"
        onClick={() => setShowCreateForm((prev) => !prev)}
      >
        {showCreateForm ? "Close Form" : "Create a New Post"}
      </button>

      {/* Error creating post */}
      {error && <p style={{ color: "red" }}>{error}</p>}

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
      <h1 className="heading">Top Posts</h1>
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
              <button onClick={() => handleSaveEdit(post.id)} style={{backgroundColor: "navy", color: "whitesmoke"}}>Save</button>
              <button onClick={() => setEditPostId(null)} style={{backgroundColor: "darkred", color: "whitesmoke"}}>Cancel</button>
            </>
          ) : (
            <>
              <h2 className="postTitle">{post.title}</h2>
              <p className="postBody">{post.body}</p>
              <button
                style={{backgroundColor: "#504646ff", color: "whitesmoke"}}
                onClick={() => startEditing(post)}
              >
                Edit
              </button>
              <button
                style={{ backgroundColor: "#db0707ff", color: "white" }}
                onClick={() => handleDelete(post.id)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};
export default Home;
