// Fonction pour remplir la liste déroulante avec les technologies depuis la base de données
const fillTechnologiesDropdown = async () => {
    // On appelle le serveur
  const response = await fetch("http://localhost:8000/technology/getAll");
  const technologies = await response.json();

    // Récupération de l'input drop down
  const technologieDropdown = document.getElementById("technologie");
  
    // On itère sur chaque techno dans la bdd en mettant le label d'option et l'id pour la bdd
    technologies.forEach((techno) => {
    const option = document.createElement("option");
    option.value = techno.id;
    option.textContent = techno.nomtechno;
    technologieDropdown.appendChild(option);
  });
};

// On refait exactement pareil que pour les technologies
const fillUsersDropdown = async () => {
  const response = await fetch("http://localhost:8000/user/getAll");
  const utilisateurs = await response.json();

  const utilisateurDropdown = document.getElementById("utilisateur");
  utilisateurs.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = `${user.nom} ${user.prenom}`;
    utilisateurDropdown.appendChild(option);
  });
};

// Appeler les fonctions pour remplir les listes déroulantes au chargement de la page
fillTechnologiesDropdown();
fillUsersDropdown();

// Écouter l'événement de soumission du formulaire
document
  .getElementById("commentForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

      // Récupération des valeurs des inputs
    const message = document.getElementById("message").value;
    const technologie = document.getElementById("technologie").value;
    const utilisateur = document.getElementById("utilisateur").value;

    try {
      // On récupère le token du localstorage pour les droits
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      };
      const response = await fetch("http://localhost:8000/comment/add", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          message,
          idtechnologie: technologie,
          idutilisateur: utilisateur,
        }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire :", error);
    }
  });
