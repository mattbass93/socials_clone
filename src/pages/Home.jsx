import { useEffect, useState } from "react";
import { fetchUsers, fetchPosts } from "../services/api";
import StoriesCarousel from "../components/StoriesCarousel";
import Post from "../components/Post";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function Home() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchUsers(36).then(setUsers);
    fetchPosts(12).then(setPosts);
  }, []);

  if (users.length === 0 || posts.length === 0) {
    return <div className="p-4">Chargement...</div>;
  }

  return (
    <div className="flex p-4 space-x-8">
      {/* Main feed */}
      <div className="flex-1">
        {/* Stories */}
        <StoriesCarousel users={users} />

        {/* Feed */}
        <div className="flex flex-col space-y-6">
          {posts.map((post, index) => (
            <Post
              key={index}
              user={post.user}
              photo={post.photo}
              description={post.description}
            />
          ))}
        </div>
        <Footer />
      </div>

      {/* Sidebar à droite */}
      <Sidebar />
    </div>
  );
}

export default Home;
