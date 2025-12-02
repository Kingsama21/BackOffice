// Login page script
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const pwd = document.getElementById('password').value;

    if (!email || !pwd) {
      alert('Por favor completa ambos campos.');
      return;
    }

    try {
      // Llamar a la API de login
      const result = await login({
        email,
        password: pwd,
      });

      // No asumir que result.user existe; preferir getUser() o comprobar seguridad
      const user = getUser();
      const name = (result && result.user && result.user.name) || (user && user.name) || '';

      if (name) {
        alert(`¡Bienvenido ${name}!`);
      } else {
        alert('¡Inicio de sesión exitoso!');
      }

      // Redirigir a Home
      window.location.replace('Home.html');
    } catch (error) {
      alert(`Error al iniciar sesión: ${error.message}`);
      console.error(error);
    }
  });
});
