import axios from "axios";
import { faker } from "@faker-js/faker";

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

export function fetchVideos(count = 10) {
    const API_KEY = "gxnJqSbrtmD57tZA48tfjmPcKXl7lQHSRHmors66MHw35Kgh1OJfSnWT";
    return axios
        .get(`https://api.pexels.com/videos/popular?per_page=${count}`, {
            headers: { Authorization: API_KEY }
        })
        .then(res => res.data.videos);
}


// simuler un feed de posts : users + photos + descriptions faker
export async function fetchPosts(count = 10) {
    try {
        // récupérer utilisateurs et photos en parallèle
        const [users, photos] = await Promise.all([
            fetchUsers(count),
            fetchPhotos(count)
        ]);

        // créer la liste de posts
        return users.map((user, i) => ({
            user: {
                username: user.login.username,
                avatar: user.picture.thumbnail,
                location: `${user.location.city}, ${user.location.country}`
            },
            photo: {
                url: photos[i % photos.length]?.urls.small,
                alt: photos[i % photos.length]?.alt_description || "Photo"
            },
            description: faker.lorem.sentence()
        }));
    } catch (err) {
        console.error("Erreur fetchPosts :", err);
        return [];
    }
}
