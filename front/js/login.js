document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    // Récupération des données
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    // On interroge le serveur
    fetch("http://localhost:8000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Vérifiez si la réponse contient un token
        if (data.token) {
          // Stockez le token dans le localStorage
          localStorage.setItem("token", data.token);
          // Redirection de l'utilisateur
          window.location.href = "index.html";
        } else {
          alert("Vérifiez vos identifiants, ils sont incorrects !");
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la connexion :", error);
      });
  });
