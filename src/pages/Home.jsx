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
    return <div className="p-4 text-white">Chargement...</div>;
  }

  return (
    <div className="flex p-4 justify-center gap-8">
      {/* Main feed */}
      <div className=" max-w-[700px]">
        {/* Stories */}
        <StoriesCarousel users={users} />

        {/* Feed de posts */}
        <div className="flex flex-col space-y-6">
          {posts.map((post, index) => (
            <Post
              key={index}
              user={post.user}
              media={post.media}
              description={post.description}
            />
          ))}
        </div>

        <Footer />
      </div>

      {/* Sidebar */}
      <Sidebar />
    </div>
  );
}

export default Home;
