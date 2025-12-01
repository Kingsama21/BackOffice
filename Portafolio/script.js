const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";

/**
 * Obtener proyectos públicos de un usuario
 * @param {string} itsonId - ID de Itson (6 dígitos)
 * @returns {Promise<Array>} Array de proyectos
 */
async function getPublicProjects(itsonId) {
  try {
    const res = await fetch(`${API_BASE}/publicProjects/${itsonId}`);
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (err) {
      data = text;
    }

    if (!res.ok) {
      const msg =
        (data && data.message) ||
        (typeof data === "string" ? data : "Error al obtener proyectos");
      throw new Error(msg);
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching public projects:", error);
    throw error;
  }
}

/**
 * Validar que el Itson ID sea válido (6 dígitos)
 */
function isValidItsonId(itsonId) {
  return /^\d{6}$/.test(itsonId);
}

/**
 * Mostrar mensaje de búsqueda
 */
function showMessage(message, type) {
  const msgElement = document.getElementById("searchMessage");
  msgElement.textContent = message;
  msgElement.className = `search-message ${type}`;
}

/**
 * Renderizar proyectos en la página
 */
function renderProjects(projects) {
  const container = document.getElementById("projectsContainer");

  if (!projects || projects.length === 0) {
    container.innerHTML =
      '<p class="no-projects">No se encontraron proyectos para este usuario</p>';
    return;
  }

  container.innerHTML = projects
    .map(
      (project) => `
    <div class="project-card">
      <div class="project-image">
        ${
          project.images && project.images[0]
            ? `<img src="${project.images[0]}" alt="${project.title}">`
            : '<span>📁</span>'
        }
      </div>
      <div class="project-content">
        <h3>${escapeHtml(project.title || "Sin título")}</h3>
        <p>${escapeHtml(project.description || "Sin descripción")}</p>
        
        ${
          project.technologies && project.technologies.length > 0
            ? `
          <div class="project-technologies">
            ${project.technologies
              .map((tech) => `<span class="tech-badge">${escapeHtml(tech)}</span>`)
              .join("")}
          </div>
        `
            : ""
        }
        
        <div class="project-links">
          ${
            project.repository
              ? `<a href="${project.repository}" target="_blank" rel="noopener noreferrer" class="btn-link btn-repo">🔗 Repositorio</a>`
              : ""
          }
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

/**
 * Escapar caracteres HTML para evitar XSS
 */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Manejar la búsqueda de proyectos
 */
document.getElementById("searchForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const itsonId = document.getElementById("itsonId").value.trim();

  if (!isValidItsonId(itsonId)) {
    showMessage("Ingresa un Itson ID válido (6 dígitos)", "error");
    return;
  }

  try {
    showMessage("Buscando proyectos...", "loading");

    const projects = await getPublicProjects(itsonId);

    if (!projects || projects.length === 0) {
      showMessage(
        "No se encontraron proyectos para este usuario",
        "error"
      );
      renderProjects([]);
    } else {
      showMessage(
        `Se encontraron ${projects.length} proyecto(s)`,
        "success"
      );
      renderProjects(projects);
    }
  } catch (error) {
    console.error("Error:", error);
    showMessage(`Error: ${error.message}`, "error");
    renderProjects([]);
  }
});
