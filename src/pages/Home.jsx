import { useEffect, useState } from "react";
import { fetchUsers, fetchPosts } from "../services/api";
import Story from "../components/Story";
import Post from "../components/Post";

function Home() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchUsers(10).then(setUsers);
    fetchPosts(12).then(setPosts);
  }, []);

  if (users.length === 0 || posts.length === 0) {
    return <div className="p-4">Chargement...</div>;
  }

  return (
    <div>
      {/* Stories */}
      <div className="flex space-x-4 overflow-x-auto pb-4 mb-6 border-b">
        {users.map((user, index) => (
          <Story
            key={index}
            username={user.login.username}
            avatar={user.picture.thumbnail}
          />
        ))}
      </div>

      {/* Feed avec des posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <Post key={index} user={post.user} photo={post.photo} />
        ))}
      </div>
    </div>
  );
}

export default Home;
