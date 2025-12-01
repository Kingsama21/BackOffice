/**
 * API Services
 * Archivo centralizado con todas las funciones para llamadas a la Portfolio API
 * Base URL: https://portfolio-api-three-black.vercel.app/api/v1
 */

const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";

/**
 * ==================== AUTENTICACIÓN ====================
 */

/**
 * Registrar un nuevo usuario
 * @param {Object} user - { name, email, itsonId, password }
 * @returns {Promise<Object>} Usuario creado (sin contraseña)
 */
async function register(user) {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    // Intentar parsear respuesta de forma robusta (puede que no sea JSON)
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (err) {
      data = text;
    }

    if (!res.ok) {
      const msg = (data && data.message) || (typeof data === 'string' ? data : 'Error al registrar');
      throw new Error(msg);
    }

    return data;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
}

/**
 * Iniciar sesión y guardar token
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} { token, user }
 */
async function login(credentials) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    // Parseo robusto de la respuesta
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (err) {
      data = text;
    }

    if (!res.ok) {
      const msg = (data && data.message) || (typeof data === 'string' ? data : 'Error al iniciar sesión');
      throw new Error(msg);
    }

    // Guardar token en localStorage si existe
    if (data && data.token) {
      localStorage.setItem("authToken", data.token);
    }
    if (data && data.user) {
      // Normalizar id: algunos endpoints devuelven '_id' en vez de 'id'
      if (data.user._id && !data.user.id) data.user.id = data.user._id;
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

/**
 * Obtener token guardado
 * @returns {string|null} Token JWT o null
 */
function getToken() {
  return localStorage.getItem("authToken");
}

/**
 * Obtener usuario guardado
 * @returns {Object|null} Usuario o null
 */
function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

/**
 * Cerrar sesión (limpiar localStorage)
 */
function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  localStorage.removeItem("loggedIn");
}

/**
 * Verificar si hay token válido
 * @returns {boolean}
 */
function isAuthenticated() {
  return !!getToken();
}

/**
 * ==================== PROYECTOS ====================
 */

/**
 * Obtener proyectos del usuario autenticado
 * @returns {Promise<Array>} Array de proyectos
 */
async function getProjects() {
  try {
    const token = getToken();
    if (!token) throw new Error("No autenticado");

    const res = await fetch(`${API_BASE}/projects`, {
      method: "GET",
      headers: { "auth-token": token },
    });

    const text = await res.text();
    let data;
    try { data = text ? JSON.parse(text) : null; } catch (err) { data = text; }

    if (!res.ok) {
      const msg = (data && data.message) || (typeof data === 'string' ? data : 'Error al obtener proyectos');
      throw new Error(msg);
    }

    return data;
  } catch (error) {
    console.error("Get projects error:", error);
    throw error;
  }
}

/**
 * Obtener proyecto por ID
 * @param {string} projectId
 * @returns {Promise<Object>} Proyecto
 */
async function getProjectById(projectId) {
  try {
    const token = getToken();
    if (!token) throw new Error("No autenticado");

    const res = await fetch(`${API_BASE}/projects/${projectId}`, {
      method: "GET",
      headers: { "auth-token": token },
    });

    const text = await res.text();
    let data;
    try { data = text ? JSON.parse(text) : null; } catch (err) { data = text; }

    if (!res.ok) {
      const msg = (data && data.message) || (typeof data === 'string' ? data : 'Proyecto no encontrado');
      throw new Error(msg);
    }

    return data;
  } catch (error) {
    console.error("Get project by ID error:", error);
    throw error;
  }
}

/**
 * Crear nuevo proyecto
 * @param {Object} project - { title, description, technologies, repository, images }
 * @returns {Promise<Object>} Proyecto creado
 */
async function createProject(project) {
  try {
    const token = getToken();
    if (!token) throw new Error("No autenticado");

    // El backend obtiene el userId del token, NO necesitamos enviarlo en el payload
    const res = await fetch(`${API_BASE}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify(project),
    });

    const text = await res.text();
    let data;
    try { data = text ? JSON.parse(text) : null; } catch (err) { data = text; }

    if (!res.ok) {
      const msg = (data && data.message) || (typeof data === 'string' ? data : 'Error al crear proyecto');
      throw new Error(msg);
    }

    return data;
  } catch (error) {
    console.error("Create project error:", error);
    throw error;
  }
}

/**
 * Actualizar proyecto
 * @param {string} projectId
 * @param {Object} updates - Campos a actualizar
 * @returns {Promise<Object>} Proyecto actualizado
 */
async function updateProject(projectId, updates) {
  try {
    const token = getToken();
    if (!token) throw new Error("No autenticado");

    const res = await fetch(`${API_BASE}/projects/${projectId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify(updates),
    });

    const text = await res.text();
    let data;
    try { data = text ? JSON.parse(text) : null; } catch (err) { data = text; }

    if (!res.ok) {
      const msg = (data && data.message) || (typeof data === 'string' ? data : 'Error al actualizar proyecto');
      throw new Error(msg);
    }

    return data;
  } catch (error) {
    console.error("Update project error:", error);
    throw error;
  }
}

/**
 * Eliminar proyecto
 * @param {string} projectId
 * @returns {Promise<Object>} Confirmación
 */
async function deleteProject(projectId) {
  try {
    const token = getToken();
    if (!token) throw new Error("No autenticado");

    const res = await fetch(`${API_BASE}/projects/${projectId}`, {
      method: "DELETE",
      headers: { "auth-token": token },
    });

    const text = await res.text();
    let data;
    try { data = text ? JSON.parse(text) : null; } catch (err) { data = text; }

    if (!res.ok) {
      const msg = (data && data.message) || (typeof data === 'string' ? data : 'Error al eliminar proyecto');
      throw new Error(msg);
    }

    return data;
  } catch (error) {
    console.error("Delete project error:", error);
    throw error;
  }
}

/**
 * Obtener proyectos públicos de un usuario por itsonId
 * @param {string} itsonId
 * @returns {Promise<Array>} Array de proyectos públicos
 */
async function getPublicProjects(itsonId) {
  try {
    const res = await fetch(`${API_BASE}/publicProjects/${itsonId}`);

    const text = await res.text();
    let data;
    try { data = text ? JSON.parse(text) : null; } catch (err) { data = text; }

    if (!res.ok) {
      const msg = (data && data.message) || (typeof data === 'string' ? data : 'Error al obtener proyectos públicos');
      throw new Error(msg);
    }

    return data;
  } catch (error) {
    console.error("Get public projects error:", error);
    throw error;
  }
}
