import { useEffect, useMemo, useState } from "react";
import { fetchUsers, fetchPosts } from "../services/api";
import StoriesCarousel from "../components/StoriesCarousel";
import Post from "../components/Post";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function Home() {
  const [activeTab, setActiveTab] = useState("pourVous"); // "pourVous" | "suivi"

  // Deux ensembles d'utilisateurs
  const [pourVousUsers, setPourVousUsers] = useState([]);
  const [suiviUsers, setSuiviUsers] = useState([]);

  // Deux ensembles de posts (base, sans likedBy)
  const [pourVousPostsBase, setPourVousPostsBase] = useState([]);
  const [suiviPostsBase, setSuiviPostsBase] = useState([]);

  // Posts affichés (avec likedBy)
  const [posts, setPosts] = useState([]);

  // Pool global pour stories
  const [mediaPool, setMediaPool] = useState([]);

  const rand = (n) => Math.floor(Math.random() * n);

  useEffect(() => {
    async function loadData() {
      const fetchedUsers = await fetchUsers(36);
      const fetchedPosts = await fetchPosts(12);

      // Media pool pour stories
      const pool = fetchedPosts.map((p) => p?.media).filter(Boolean);

      // Mélange utilitaire
      const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

      // Split utilisateurs en 2 groupes
      const usersShuffled = shuffle(fetchedUsers);
      const halfUsers = Math.ceil(usersShuffled.length / 2);
      const groupUsersA = usersShuffled.slice(0, halfUsers);
      const groupUsersB = usersShuffled.slice(halfUsers);

      // Split posts en 2 groupes
      const postsShuffled = shuffle(fetchedPosts);
      const halfPosts = Math.ceil(postsShuffled.length / 2);
      const groupPostsA = postsShuffled.slice(0, halfPosts);
      const groupPostsB = postsShuffled.slice(halfPosts);

      setPourVousUsers(groupUsersA);
      setSuiviUsers(groupUsersB);
      setPourVousPostsBase(groupPostsA);
      setSuiviPostsBase(groupPostsB);
      setMediaPool(pool);
    }

    loadData();
  }, []);

  // Sélectionne l'ensemble courant (users + posts de base) selon l’onglet
  const currentUsers = useMemo(
    () => (activeTab === "pourVous" ? pourVousUsers : suiviUsers),
    [activeTab, pourVousUsers, suiviUsers]
  );

  const currentPostsBase = useMemo(
    () => (activeTab === "pourVous" ? pourVousPostsBase : suiviPostsBase),
    [activeTab, pourVousPostsBase, suiviPostsBase]
  );

  // Recalcule les posts affichés à chaque changement d’onglet/données
  useEffect(() => {
    if (!currentPostsBase.length || !currentUsers.length) return;

    // On régénère likedBy pour correspondre au groupe courant
    const postsWithLikers = currentPostsBase.map((post) => ({
      ...post,
      likedBy: currentUsers.length
        ? [currentUsers[rand(currentUsers.length)]]
        : [],
    }));

    setPosts(postsWithLikers);
  }, [currentPostsBase, currentUsers]);

  const isLoading =
    (activeTab === "pourVous" &&
      (pourVousUsers.length === 0 || pourVousPostsBase.length === 0)) ||
    (activeTab === "suivi" &&
      (suiviUsers.length === 0 || suiviPostsBase.length === 0)) ||
    posts.length === 0;

  if (isLoading) {
    return <div className="p-4 text-white">Chargement...</div>;
  }

  return (
    <div className="flex pt-10 justify-center gap-14 lg:ml-[0] xl:ml-[10%]">
      {/* Main feed */}
      <div className="max-w-[630px]">
        {/* Onglets visibles uniquement sur desktop (>= lg) */}
        <div className="hidden md:flex space-x-4 mb-3 ml-7">
          <button
            type="button"
            onClick={() => setActiveTab("pourVous")}
            className={[
              "text-white font-semibold cursor-pointer",
              activeTab === "pourVous" ? "opacity-100" : "opacity-60",
            ].join(" ")}
          >
            Pour vous
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("suivi")}
            className={[
              "text-white font-semibold cursor-pointer",
              activeTab === "suivi" ? "opacity-100" : "opacity-60",
            ].join(" ")}
          >
            Suivi(e)
          </button>
        </div>

        {/* Stories (on passe l’ensemble d’utilisateurs courant) */}
        <StoriesCarousel users={currentUsers} mediaPool={mediaPool} />

        {/* Feed de posts (change selon l’onglet) */}
        <div className="flex flex-col space-y-6 ">
          {posts.map((post, index) => (
            <Post
              key={post.id ?? index}
              user={post.user}
              media={post.media}
              description={post.description}
              users={currentUsers}
              likedBy={post.likedBy}
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
