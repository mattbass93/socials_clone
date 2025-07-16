import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="mb-6 text-gray-600">Oups ! Cette page n'existe pas.</p>
      <Link
        to="/"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}

export default NotFound;
