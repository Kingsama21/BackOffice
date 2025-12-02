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
        <div class="project-card">
          ${project.images && project.images[0] ? `
            <div class="project-image">
              <img src="${project.images[0]}" alt="${(project.title||'')} preview">
            </div>
          ` : ''}
          <div class="project-content">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            ${project.technologies && project.technologies.length > 0 ? `<div class="project-technologies">${project.technologies.map(t=>`<span class="tech-badge">${t}</span>`).join('')}</div>` : ''}
            ${project.repository ? `<p style="margin-top:0.5rem;"><a href="${project.repository}" target="_blank" style="color: #2b6cb0; text-decoration: none;">Ver repositorio</a></p>` : ''}
            <div style="display: flex; gap: 0.5rem; margin-top:0.75rem;">
              <button onclick="editProject('${project._id}')" class="btn" style="padding: 0.5rem 1rem; font-size: 0.9rem;">✏️ Editar</button>
              <button onclick="deleteProjectConfirm('${project.__id || project._id}', '${project.title}')" class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.9rem;">🗑️ Eliminar</button>
            </div>
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
      // reset image preview state
      clearImagePreview();
      document.getElementById('projectForm').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Image inputs and preview handling
  const imageUrlInput = document.getElementById('projectImageUrl');
  const imageFileInput = document.getElementById('projectImageFile');
  const imagePreviewContainer = document.getElementById('imagePreviewContainer');
  const imagePreviewEl = document.getElementById('imagePreview');
  const changeImageBtn = document.getElementById('changeImageBtn');

  // selected image data stored globally on window for simplicity
  window.__selectedImageData = null;

  function showImagePreview(src) {
    if (!imagePreviewContainer || !imagePreviewEl) return;
    imagePreviewEl.innerHTML = `<img src="${src}" alt="preview" style="max-width:100%;border-radius:6px;"/>`;
    imagePreviewContainer.style.display = 'block';
    // keep selected data
    window.__selectedImageData = src;
  }

  function clearImagePreview() {
    if (!imagePreviewContainer || !imagePreviewEl) return;
    imagePreviewEl.innerHTML = '';
    imagePreviewContainer.style.display = 'none';
    window.__selectedImageData = null;
    if (changeImageBtn) changeImageBtn.style.display = 'none';
    if (imageUrlInput) imageUrlInput.value = '';
    if (imageFileInput) imageFileInput.value = '';
  }

  if (imageUrlInput) {
    imageUrlInput.addEventListener('input', function () {
      const v = (this.value || '').trim();
      if (!v) {
        // if there is no url and no file selected, clear
        if (!window.__selectedImageData) clearImagePreview();
        return;
      }
      showImagePreview(v);
    });
  }

  if (imageFileInput) {
    imageFileInput.addEventListener('change', function () {
      const file = this.files && this.files[0];
      if (!file) return;
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        alert('El archivo es demasiado grande. Máximo 2MB.');
        this.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = function (ev) {
        const dataUrl = ev.target.result;
        showImagePreview(dataUrl);
      };
      reader.readAsDataURL(file);
    });
  }

  if (changeImageBtn) {
    changeImageBtn.addEventListener('click', function () {
      // allow user to pick a new image
      clearImagePreview();
      // show inputs already visible; focus file input
      if (imageFileInput) imageFileInput.focus();
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

      // include image if was selected (dataURL or remote URL)
      if (window.__selectedImageData) {
        projectData.images = [window.__selectedImageData];
      }

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

      // prefill image preview if exists
      if (project.images && project.images.length > 0 && project.images[0]) {
        showImagePreview(project.images[0]);
        // when editing, set selectedImageData to current image so it remains unless changed
        window.__selectedImageData = project.images[0];
        // show change button so user can replace
        const changeBtn = document.getElementById('changeImageBtn');
        if (changeBtn) changeBtn.style.display = 'inline-block';
      } else {
        clearImagePreview();
      }

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
