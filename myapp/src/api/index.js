const BASE_URL = 'http://localhost:3002';

function getToken() {
  return localStorage.getItem('token');
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  };
}

// AUTH
export async function loginApi(email, password) {
  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || `Xato: ${res.status}`);
  return data;
}

// USERS (admin)
export async function getUsersApi() {
  const res = await fetch(`${BASE_URL}/api/users`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Xato: ${res.status}`);
  return Array.isArray(data) ? data : data.users || data.data || [];
}

// TODOS
export async function getTodosApi() {
  const res = await fetch(`${BASE_URL}/api/todos`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Xato: ${res.status}`);
  return Array.isArray(data) ? data : data.todos || data.data || [];
}

// CREATE TODO — hamma o'ziga yarata oladi, assignedTo shart emas
export async function createTodoApi(title, description) {
  const res = await fetch(`${BASE_URL}/api/todos`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      title,
      description: description || '',
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Qo'shib bo'lmadi");
  return data;
}

// DELETE TODO
export async function deleteTodoApi(id) {
  const res = await fetch(`${BASE_URL}/api/todos/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "O'chirib bo'lmadi");
  }
}
