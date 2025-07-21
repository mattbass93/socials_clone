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
        const [users, photos, videos] = await Promise.all([
            fetchUsers(count),
            fetchPhotos(count),
            fetchVideos(count),
        ]);

        const media = [
            ...photos.map((photo) => ({
                type: "image",
                url: photo.urls.small,
                alt: photo.alt_description || "Image",
            })),
            ...videos.map((video) => ({
                type: "video",
                url: video.video_files.find((f) => f.quality === "sd")?.link || video.video_files[0]?.link,
                thumbnail: video.image,
            })),
        ];

        // mélanger le tableau media
        const shuffled = media.sort(() => Math.random() - 0.5).slice(0, count);

        return shuffled.map((media, i) => ({
            user: {
                username: users[i % users.length].login.username,
                avatar: users[i % users.length].picture.thumbnail,
                location: `${users[i % users.length].location.city}, ${users[i % users.length].location.country}`,
            },
            media,
            description: media.type === "image" ? faker.lorem.sentence() : "",
        }));
    } catch (err) {
        console.error("Erreur dans fetchPosts :", err);
        return [];
    }
}