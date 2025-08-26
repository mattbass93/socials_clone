import { useEffect, useState } from "react";
import { fetchUsers, fetchPosts } from "../services/api";
import StoriesCarousel from "../components/StoriesCarousel";
import Post from "../components/Post";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function Home() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [mediaPool, setMediaPool] = useState([]);
  // <- pool global pour les stories aléatoires

  useEffect(() => {
    async function loadData() {
      const fetchedUsers = await fetchUsers(36);
      const fetchedPosts = await fetchPosts(12);

      // Pool de médias (images/vidéos) pour générer des stories aléatoires (sans avatar)
      // On prend p.media quand il existe (URL image/vidéo)
      const pool = fetchedPosts.map((p) => p?.media).filter(Boolean);

      // Associer un liker random pour l’exemple
      const rand = (n) => Math.floor(Math.random() * n);
      const postsWithLikers = fetchedPosts.map((post) => ({
        ...post,
        likedBy: fetchedUsers.length
          ? [fetchedUsers[rand(fetchedUsers.length)]]
          : [],
      }));

      setUsers(fetchedUsers);
      setPosts(postsWithLikers);
      setMediaPool(pool);
    }

    loadData();
  }, []);

  if (users.length === 0 || posts.length === 0) {
    return <div className="p-4 text-white">Chargement...</div>;
  }

  return (
    <div className="flex pt-10 justify-center gap-14 lg:ml-[0] xl:ml-[10%]">
      {/* Main feed */}
      <div className="max-w-[630px]">
        {/* Stories (on passe le pool) */}
        <StoriesCarousel users={users} mediaPool={mediaPool} />

        {/* Feed de posts */}
        <div className="flex flex-col space-y-6 ">
          {posts.map((post, index) => (
            <Post
              key={index}
              user={post.user}
              media={post.media}
              description={post.description}
              users={users}
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
