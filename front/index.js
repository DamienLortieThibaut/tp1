// Initialisation des variables
let userData = [];
let commentData = [];
let containerUser = document.getElementById("container-user");
let containerComment = document.getElementById("container-comment");

// Récupération des utilisateurs
const fetchUser = async () => {
  try {
    const response = await fetch("http://localhost:8000/utilisateurs");
    userData = await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs: ", error);
  }
};

// Récupération des commentaires
const fetchComment = async () => {
  try {
    const response = await fetch(
      "http://localhost:8000/commentaire/techno/React"
    );
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
const commentDisplay = async () => {
  await fetchComment();
  const dateParser = (date) => {
    let newDate = new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return newDate;
  };
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
};


userDisplay();
commentDisplay();