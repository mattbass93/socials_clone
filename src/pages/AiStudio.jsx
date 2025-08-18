import { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const categories = [
  "IA populaires",
  "Connexion",
  "Utilitaire",
  "Culture pop",
  "Mystique",
  "Animés",
  "Jeux vidéo",
  "Créés récemment",
];

function AiStudio() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("https://randomuser.me/api/?results=24")
      .then((res) => setUsers(res.data.results))
      .catch(console.error);
  }, []);

  const getUsersByIndex = (start) => users.slice(start, start + 3);

  return (
    <div className="fixed inset-0 bg-white text-black z-50 flex overflow-y-auto">
      {/* Sidebar */}
      <aside className="w-60 min-h-screen border-r border-gray-200 px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-gray-600 hover:text-black mb-6"
        >
          <FiArrowLeft className="mr-2" />
          Retour
        </button>

        <h2 className="text-xl font-bold mb-6">AI Studio</h2>

        <nav className="space-y-3 text-sm text-gray-700">
          <div className="text-xs uppercase text-gray-400 mb-2">
            Vos personnages d’IA
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
            + Créer une IA
          </button>

          <div className="mt-6 text-xs text-gray-400">Historique</div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li className="hover:text-black cursor-pointer">Meta AI</li>
            <li className="hover:text-black cursor-pointer">Matthis</li>
          </ul>
        </nav>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 px-8 py-6">
        <h1 className="text-2xl font-bold mb-2">Découvrez les IA</h1>
        <p className="text-sm text-gray-500 mb-6">
          Trouvez et interagissez avec celles créées par d’autres personnes.
        </p>

        <input
          type="text"
          placeholder="Recherchez des IA, des Créateurs ou des sujets"
          className="w-full border border-gray-300 px-4 py-2 rounded mb-6"
        />

        {/* Filtres */}
        <div className="flex gap-2 mb-10 flex-wrap">
          {["🎯 Populaires", "🔗 Connexion", "🎬 Culture pop", "👥 Amis"].map(
            (filter, i) => (
              <button
                key={i}
                className="px-4 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
              >
                {filter}
              </button>
            )
          )}
        </div>

        {/* Sections IA */}
        {categories.map((cat, i) => (
          <section key={cat} className="mb-12">
            <h2 className="text-lg font-semibold mb-4">{cat}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {getUsersByIndex(i * 3).map((user, j) => (
                <div
                  key={j}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow transition"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <img
                      src={user.picture.thumbnail}
                      alt={user.name.first}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium">
                        {user.name.first} {user.name.last}
                      </p>
                      <p className="text-xs text-gray-500">
                        @{user.login.username}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {user.location.city}, {user.location.country}
                  </p>
                </div>
              ))}
            </div>

            <button className="text-sm text-blue-600 mt-4 hover:underline">
              Voir plus
            </button>
          </section>
        ))}
      </main>
    </div>
  );
}

export default AiStudio;
