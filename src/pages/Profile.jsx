import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

function Profile() {
  const { id } = useParams(); // récupère l'ID depuis l'URL
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  // simuler la récupération d'un utilisateur
  useEffect(() => {
    axios
      .get("https://randomuser.me/api/")
      .then((res) => setUser(res.data.results[0]))
      .catch((err) => console.error(err));
  }, [id]);

  // simuler la récupération des posts du profil
  useEffect(() => {
    axios
      .get(
        "https://api.unsplash.com/photos/random?count=9&client_id=TON_ACCESS_KEY"
      )
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!user) return <div className="p-4">Chargement du profil...</div>;

  return (
    <div className="p-6">
      <Link to="/" className="text-blue-600">
        &larr; Retour au feed
      </Link>

      <div className="flex items-center mt-4 mb-8">
        <img
          src={user.picture.large}
          alt="Avatar"
          className="rounded-full w-24 h-24 mr-6"
        />
        <div>
          <h2 className="text-2xl font-bold">{user.login.username}</h2>
          <p className="text-gray-600">
            {user.location.city}, {user.location.country}
          </p>
        </div>
      </div>

      <h3 className="text-xl mb-4 font-semibold">Posts</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <img
            key={post.id}
            src={post.urls.small}
            alt={post.alt_description}
            className="rounded-lg hover:scale-105 transition"
          />
        ))}
      </div>
    </div>
  );
}

export default Profile;
