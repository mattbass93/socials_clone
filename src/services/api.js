import axios from "axios";

// récupérer des utilisateurs fictifs
export function fetchUsers(count = 10) {
    return axios
        .get(`https://randomuser.me/api/?results=${count}`)
        .then(res => res.data.results)
        .catch(err => {
            console.error("Erreur API randomuser :", err);
            return [];
        });
}

// récupérer des photos aléatoires via Unsplash
export function fetchPhotos(count = 10) {
    const ACCESS_KEY = "WkXYtnm_A1dJG4PerFEj7yLINg7JhGriiegHilGv25A"; // remplace par ta clé
    return axios
        .get(`https://api.unsplash.com/photos/random?count=${count}&client_id=${ACCESS_KEY}`)
        .then(res => res.data)
        .catch(err => {
            console.error("Erreur API Unsplash :", err);
            return [];
        });
}

// simuler un feed de posts : users + photos combinés
export async function fetchPosts(count = 10) {
    try {
        const [users, photos] = await Promise.all([
            fetchUsers(count),
            fetchPhotos(count)
        ]);

        // fusionne : chaque user poste une photo
        return users.map((user, i) => ({
            user: {
                username: user.login.username,
                avatar: user.picture.thumbnail,
                location: `${user.location.city}, ${user.location.country}`
            },
            photo: {
                url: photos[i % photos.length]?.urls.small,
                alt: photos[i % photos.length]?.alt_description
            }
        }));
    } catch (err) {
        console.error("Erreur fetchPosts :", err);
        return [];
    }
}
