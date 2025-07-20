import MessagesOverlay from "../components/MessagesOverlay";
import { FaFacebookMessenger } from "react-icons/fa";

function Messages() {
  return (
    <div className="relative flex h-screen w-full bg-black text-white">
      {/* Overlay Messages à gauche (comme la recherche) */}
      <div className="absolute top-0 left-0 z-50">
        <MessagesOverlay />
      </div>

      {/* Fond de la page (à droite de la navbar + overlay) */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <FaFacebookMessenger className="text-8xl mb-4 border rounded-full p-3 border-white" />
        <h2 className="text-xl">Vos messages</h2>
        <p className="text-gray-400 mb-4 mt-1 text-sm">
          Envoyez des photos et des messages privés à un(e) ami(e) ou à un
          groupe
        </p>
        <button
          style={{ backgroundColor: "rgb(65, 80, 247)" }}
          className="hover:brightness-90 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
        >
          Envoyer un message
        </button>
      </div>
    </div>
  );
}

export default Messages;
