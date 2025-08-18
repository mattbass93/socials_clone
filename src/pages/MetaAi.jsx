import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

function MetaAi() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center text-white px-4">
      {/* Bouton retour */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-gray-400 hover:text-white text-2xl"
        aria-label="Retour"
      >
        <FiArrowLeft />
      </button>

      {/* Modale centrale */}
      <div className="bg-[#1c1c1c] rounded-2xl p-6 md:p-10 max-w-md w-full space-y-6 shadow-xl">
        {/* Logo cercle dégradé */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-blue-500"></div>
        </div>

        {/* Titre */}
        <h2 className="text-xl text-center font-semibold">
          Bienvenue dans Meta AI
        </h2>

        {/* Texte principal */}
        <p className="text-sm text-gray-300 leading-relaxed space-y-2">
          Meta AI est un service optionnel de Meta qui utilise des modèles d’IA
          pour fournir des réponses. Ne partagez pas d’informations, notamment
          sur des sujets sensibles, à propos d’autres personnes ou de vous-même,
          que vous ne voulez pas que l’IA conserve et utilise. Nous partageons
          des informations avec certains{" "}
          <span className="text-blue-500 hover:underline cursor-pointer">
            partenaires
          </span>{" "}
          pour que Meta AI puisse fournir des réponses pertinentes.
          <br />
          Les messages sont générés par l’IA. Certains d’entre eux peuvent être
          incorrects ou inappropriés.{" "}
          <span className="text-blue-500 hover:underline cursor-pointer">
            En savoir plus
          </span>
          .
        </p>

        {/* Cookies */}
        <p className="text-sm text-gray-400 leading-relaxed">
          Nous utilisons des cookies essentiels au fonctionnement et à
          l’exécution de nos services. En savoir plus sur notre{" "}
          <span className="text-blue-500 hover:underline cursor-pointer">
            Notice sur les cookies
          </span>
          .
        </p>

        {/* Consentement */}
        <p className="text-sm text-gray-400 leading-relaxed">
          En utilisant Meta AI, vous acceptez les{" "}
          <span className="text-blue-500 hover:underline cursor-pointer">
            Conditions générales de l’IA
          </span>{" "}
          de Meta. Vos interactions avec les IA seront utilisées pour améliorer{" "}
          <span className="text-blue-500 hover:underline cursor-pointer">
            l’IA par Meta
          </span>
          . En savoir plus sur notre{" "}
          <span className="text-blue-500 hover:underline cursor-pointer">
            Politique de confidentialité
          </span>{" "}
          et votre{" "}
          <span className="text-blue-500 hover:underline cursor-pointer">
            droit de vous y opposer
          </span>
          .
        </p>

        {/* Boutons */}
        <div className="space-y-2 pt-4">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition">
            Connexion
          </button>
          <button className="w-full bg-[#3a3a3a] hover:bg-[#505050] text-white py-2 rounded-lg font-medium transition">
            Continuer sans se connecter
          </button>
        </div>
      </div>
    </div>
  );
}

export default MetaAi;
