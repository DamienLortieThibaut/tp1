// Initialisation des variables
let userData = [];
let commentData = [];
let containerUser = document.getElementById("container-user");
let containerComment = document.getElementById("container-comment");

// Récupération des utilisateurs
const fetchUser = async () => {
  try {
    const response = await fetch("http://localhost:8000/user/getAll");
    userData = await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs: ", error);
  }
};

// Récupération des commentaires
const fetchComment = async () => {
  try {
    // Avant d'envoyer une requête vers des points d'extrémité protégés
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `${token}`,
    };

    const response = await fetch(
      "http://localhost:8000/comment/searchByTechno/React",{
      method: "GET",
      headers: headers
  });
    commentData = await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires: ", error);
  }
};

// Affichage des utilisateurs
const userDisplay = async () => {
  await fetchUser();
  containerUser.innerHTML = userData
    .map(
      (user) =>
        `<div class="card">
            <h2>${user.nom} ${user.prenom}</h2>
            <p>${user.email}</p>
        </div>    
        `
    )
    .join("");
};

// Affichage des commentaires
const commentDisplay = async (sortMethod) => {
  await fetchComment();
  const dateParser = (date) => {
    let newDate = new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return newDate;
  };
  if (Array.isArray(commentData)) {
    containerComment.innerHTML = commentData
      .map(
        (comment) =>
          `<div class="card">
              <h2>${comment.nomtechno}</h2>
              <p>${dateParser(comment.date_creation_commentaire)}</p>
          </div>    
          `
      )
      .join("");
  }
};

userDisplay();
commentDisplay();
