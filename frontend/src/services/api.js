const API_URL = "https://mini-erp-api-qh1u.onrender.com";

async function extrairErro(res, mensagemPadrao) {
  const erro = await res.json().catch(() => null);
  throw new Error(erro?.message || mensagemPadrao);
}

export async function login(email, senha) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  if (!res.ok) {
    await extrairErro(res, "Email ou senha inválidos");
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
    await extrairErro(res, "Erro ao cadastrar. Email pode já estar em uso.");
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
    await extrairErro(res, "Erro ao buscar produtos");
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
    await extrairErro(res, "Erro ao buscar clientes");
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
    await extrairErro(res, "Erro ao criar cliente");
  }

  return res.json();
}

export async function atualizarCliente(id, cliente) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/clientes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(cliente),
  });

  if (!res.ok) {
    await extrairErro(res, "Erro ao atualizar cliente");
  }

  return res.json();
}

export async function deletarCliente(id) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/clientes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    await extrairErro(res, "Erro ao excluir cliente");
  }
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
    await extrairErro(res, "Erro ao criar pedido");
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
    await extrairErro(res, "Erro ao confirmar pedido");
  }

  return res.json();
}

export async function cancelarPedido(id) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/pedidos/${id}/cancelar`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    await extrairErro(res, "Erro ao cancelar pedido");
  }
}

export async function listarPedidos() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/pedidos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    await extrairErro(res, "Erro ao buscar pedidos");
  }

  return res.json();
}

export async function buscarFaturamento(inicio, fim) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/relatorios/faturamento?inicio=${inicio}&fim=${fim}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    await extrairErro(res, "Erro ao buscar relatório de faturamento");
  }

  return res.json();
}

export async function criarProduto(produto) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/produtos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(produto),
  });

  if (!res.ok) {
    await extrairErro(res, "Erro ao criar produto");
  }

  return res.json();
}
export async function excluirConta() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/auth/me`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    await extrairErro(res, "Não foi possível excluir a conta");
  }
}