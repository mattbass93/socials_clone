function Footer() {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 text-xs text-gray-500">
      {/* Première ligne */}
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mb-4">
        <span>Meta</span>
        <span>À Propos</span>
        <span>Blog</span>
        <span>Emplois</span>
        <span>Aide</span>
        <span>API</span>
        <span>Confidentialité</span>
        <span>Conditions</span>
        <span>Lieu</span>
        <span>Instagram Lite</span>
        <span>Threads</span>
        <span>Importation des contacts et non-utilisateurs</span>
        <span>Meta Verified</span>
        <span>Résilier des contrats ici</span>
      </div>

      {/* Deuxième ligne */}
      <div className="flex justify-center space-x-4">
        <span>Français</span>
        <span>© Instagram par Matthis</span>
      </div>
    </div>
  );
}

export default Footer;
