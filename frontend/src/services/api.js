const API_URL = "https://mini-erp-api-qh1u.onrender.com";

export async function login(email, senha) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  if (!res.ok) {
    throw new Error("Email ou senha inválidos");
  }

  return res.json();
}

export async function registrar(email, senha) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  if (!res.ok) {
    throw new Error("Erro ao cadastrar. Email pode já estar em uso.");
  }

  return res.json();
}

export async function listarProdutos() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/produtos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar produtos");
  }

  return res.json();
}

export async function listarClientes() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/clientes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar clientes");
  }

  return res.json();
}

export async function criarCliente(cliente) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/clientes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(cliente),
  });

  if (!res.ok) {
    throw new Error("Erro ao criar cliente");
  }

  return res.json();
}

export async function criarPedido(pedido) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/pedidos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(pedido),
  });

  if (!res.ok) {
    throw new Error("Erro ao criar pedido");
  }

  return res.json();
}

export async function confirmarPedido(id) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/pedidos/${id}/confirmar`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    if (res.status === 409) {
      throw new Error("Conflito de estoque — outro pedido já consumiu essa quantidade");
    }
    throw new Error("Erro ao confirmar pedido");
  }

  return res.json();
}
export async function listarPedidos() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/pedidos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar pedidos");
  }

  return res.json();
}
