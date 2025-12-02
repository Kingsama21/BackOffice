// Home page script
document.addEventListener('DOMContentLoaded', function () {
  // Proteger acceso y cargar proyectos
  async function initHome() {
    // Proteger acceso: si no hay token, redirigir a Login
    if (!isAuthenticated()) {
      console.log('No autenticado. Redirigiendo a Login...');
      setTimeout(() => {
        window.location.href = 'Login.html';
      }, 500);
      return;
    }

    // Obtener usuario y saludar
    const user = getUser();
    if (user && user.name) {
      const el = document.getElementById('userGreeting');
      if (el) el.textContent = `Hola, ${user.name}`;
    } else {
      const el = document.getElementById('userGreeting');
      if (el) el.textContent = 'Hola, usuario autenticado';
    }

    // Cargar proyectos
    await loadProjects();
  }

  /**
   * Cargar y mostrar proyectos del usuario
   */
  async function loadProjects() {
    try {
      const projects = await getProjects();
      const container = document.getElementById('projectsList');

      if (!projects || projects.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #9ca3af;">No tienes ningun proyecto. Crea uno para empezar.</p>';
        return;
      }

      container.innerHTML = projects.map(project => `
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 1rem;">
          <h3 style="margin: 0 0 0.5rem; color: #111827;">${project.title}</h3>
          <p style="margin: 0 0 0.5rem; color: #6b7280;">${project.description}</p>
          ${project.technologies && project.technologies.length > 0 ? `<p style="margin: 0 0 0.5rem; font-size: 0.9rem; color: #9ca3af;"><strong>Tecnologías:</strong> ${project.technologies.join(', ')}</p>` : ''}
          ${project.repository ? `<p style="margin: 0 0 0.5rem; font-size: 0.9rem;"><a href="${project.repository}" target="_blank" style="color: #2b6cb0; text-decoration: none;">Ver repositorio</a></p>` : ''}
          <div style="display: flex; gap: 0.5rem;">
            <button onclick="editProject('${project._id}')" class="btn" style="padding: 0.5rem 1rem; font-size: 0.9rem;">✏️ Editar</button>
            <button onclick="deleteProjectConfirm('${project._id}', '${project.title}')" class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.9rem;">🗑️ Eliminar</button>
          </div>
        </div>
      `).join('');
    } catch (error) {
      console.error(error);
      const el = document.getElementById('projectsList');
      if (el) el.innerHTML = `<p style="color: red;">Error al cargar proyectos: ${error.message}</p>`;
    }
  }

  // Mostrar formulario para nuevo proyecto
  const newBtn = document.getElementById('newProjectBtn');
  if (newBtn) {
    newBtn.addEventListener('click', function () {
      document.getElementById('projectFormContainer').style.display = 'block';
      document.getElementById('formTitle').textContent = 'Agregar Nuevo Proyecto';
      document.getElementById('projectForm').reset();
      document.getElementById('projectId').value = '';
      document.getElementById('projectForm').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Cancelar formulario
  const cancelBtn = document.getElementById('cancelBtn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function () {
      document.getElementById('projectFormContainer').style.display = 'none';
      document.getElementById('projectForm').reset();
    });
  }

  // Guardar proyecto (crear o actualizar)
  const form = document.getElementById('projectForm');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const title = document.getElementById('projectTitle').value.trim();
      const description = document.getElementById('projectDesc').value.trim();
      const technologies = document.getElementById('projectTech').value
        .split(',')
        .map(t => t.trim())
        .filter(t => t);
      const repository = document.getElementById('projectRepo').value.trim();
      const projectId = document.getElementById('projectId').value;

      const projectData = {
        title,
        description,
        technologies,
        repository: repository || undefined,
        images: [],
      };

      try {
        if (projectId) {
          // Actualizar proyecto existente
          await updateProject(projectId, projectData);
          alert('Proyecto actualizado exitosamente');
        } else {
          // Crear nuevo proyecto
          await createProject(projectData);
          alert('Proyecto creado exitosamente');
        }

        // Limpiar y recargar
        document.getElementById('projectFormContainer').style.display = 'none';
        document.getElementById('projectForm').reset();
        await loadProjects();
      } catch (error) {
        alert(`Error: ${error.message}`);
        console.error(error);
      }
    });
  }

  // Editar proyecto (función global usada por botones dinàmicos)
  window.editProject = async function (projectId) {
    try {
      const project = await getProjectById(projectId);

      // Llenar formulario con datos del proyecto
      document.getElementById('projectTitle').value = project.title;
      document.getElementById('projectDesc').value = project.description;
      document.getElementById('projectTech').value = (project.technologies || []).join(', ');
      document.getElementById('projectRepo').value = project.repository || '';
      document.getElementById('projectId').value = projectId;

      // Mostrar formulario
      document.getElementById('formTitle').textContent = 'Editar Proyecto';
      document.getElementById('projectFormContainer').style.display = 'block';
      document.getElementById('projectForm').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      alert(`Error al cargar proyecto: ${error.message}`);
      console.error(error);
    }
  };

  // Confirmar y eliminar proyecto
  window.deleteProjectConfirm = async function (projectId, title) {
    if (!confirm(`¿Estás seguro de que deseas eliminar "${title}"?`)) {
      return;
    }

    try {
      await deleteProject(projectId);
      alert('Proyecto eliminado exitosamente');
      await loadProjects();
    } catch (error) {
      alert(`Error al eliminar: ${error.message}`);
      console.error(error);
    }
  };

  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      logout();
      window.location.replace('Login.html');
    });
  }

  // Inicializar cuando cargue la página
  initHome();
});
