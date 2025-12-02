// Register page script
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('registerForm');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    let itsonid = document.getElementById('itsonid').value.trim();
    const pwd = document.getElementById('password').value;

    if (!name || !email || !itsonid || !pwd) {
      alert('Por favor completa todos los campos.');
      return;
    }

    // La API exige itsonId de 6 dígitos numéricos.
    if (!/^[0-9]+$/.test(itsonid)) {
      alert('El Itson ID debe contener solo dígitos numéricos.');
      return;
    }

    if (itsonid.length !== 6) {
      // Ofrecer truncar a los últimos 6 dígitos
      const last6 = itsonid.slice(-6);
      const useLast6 = confirm(`La API requiere un Itson ID de 6 dígitos. Tu ID tiene ${itsonid.length} dígitos.\n¿Deseas usar los últimos 6 dígitos (${last6}) para registrarte?`);
      if (useLast6) {
        itsonid = last6;
      } else {
        alert('Por favor provee un Itson ID de 6 dígitos para continuar.');
        return;
      }
    }

    // La API requiere contraseña mínima 6 caracteres; avisar si la contraseña es corta.
    if (pwd.length < 6) {
      const proceed = confirm('La API puede requerir una contraseña mínima de 6 caracteres.\nTu contraseña es menor; ¿deseas intentar registrar de todas formas?');
      if (!proceed) return;
    }

    try {
      // Intentar registrar en la API
      const result = await register({
        name,
        email,
        itsonId: itsonid,
        password: pwd,
      });

      // Si registro exitoso, intentar auto-login para mejorar la experiencia
      try {
        await login({ email, password: pwd });
        // Redirigir a Home
        window.location.replace('Home.html');
      } catch (loginErr) {
        // Si el auto-login falla, redirigir a Login y mostrar mensaje
        alert(`Registro completado. Inicia sesión para continuar.\n(Detalle: ${loginErr.message})`);
        window.location.replace('Login.html');
      }
    } catch (error) {
      // Mostrar mensaje de error tal como viene del backend
      alert(`Error al registrar: ${error.message}`);
      console.error(error);
    }
  });
});
