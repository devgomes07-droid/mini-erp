import { useState } from "react";
import "./EnderecoCep.css";

function formatarCep(valor) {
  const digits = valor.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function EnderecoCep({ onEnderecoCompleto }) {
  const [cep, setCep] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [endereco, setEndereco] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [erroCep, setErroCep] = useState("");

  function montarEnderecoCompleto(dadosEndereco, numeroAtual, complementoAtual) {
    if (!dadosEndereco) {
      onEnderecoCompleto("");
      return;
    }
    const partes = [
      dadosEndereco.logradouro,
      numeroAtual ? `nº ${numeroAtual}` : null,
      complementoAtual || null,
      dadosEndereco.bairro,
      `${dadosEndereco.localidade} - ${dadosEndereco.uf}`,
    ].filter(Boolean);

    onEnderecoCompleto(partes.join(", "));
  }

  async function handleCepChange(e) {
    const valorFormatado = formatarCep(e.target.value);
    setCep(valorFormatado);
    setErroCep("");

    const digits = valorFormatado.replace(/\D/g, "");

    if (digits.length !== 8) {
      setEndereco(null);
      onEnderecoCompleto("");
      return;
    }

    setBuscando(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();

      if (data.erro) {
        setErroCep("CEP não encontrado. Confira o número digitado.");
        setEndereco(null);
        onEnderecoCompleto("");
        return;
      }

      setEndereco(data);
      montarEnderecoCompleto(data, numero, complemento);
    } catch {
      setErroCep("Não foi possível validar o CEP. Verifique sua conexão.");
      setEndereco(null);
      onEnderecoCompleto("");
    } finally {
      setBuscando(false);
    }
  }

  function handleNumeroChange(e) {
    const valor = e.target.value;
    setNumero(valor);
    montarEnderecoCompleto(endereco, valor, complemento);
  }

  function handleComplementoChange(e) {
    const valor = e.target.value;
    setComplemento(valor);
    montarEnderecoCompleto(endereco, numero, valor);
  }

  return (
    <div className="endereco-cep">
      <div className="endereco-cep-linha">
        <div className="endereco-cep-field endereco-cep-field-cep">
          <label>CEP</label>
          <input
            type="text"
            value={cep}
            onChange={handleCepChange}
            placeholder="00000-000"
            maxLength={9}
          />
        </div>
        <div className="endereco-cep-field">
          <label>Número</label>
          <input
            type="text"
            value={numero}
            onChange={handleNumeroChange}
            placeholder="123"
            disabled={!endereco}
          />
        </div>
      </div>

      {buscando && <p className="endereco-cep-status">Buscando endereço...</p>}
      {erroCep && <p className="endereco-cep-erro">{erroCep}</p>}

      {endereco && !erroCep && (
        <>
          <div className="endereco-cep-preview">
            {endereco.logradouro && <span>{endereco.logradouro}</span>}
            <span>{endereco.bairro}</span>
            <span>{endereco.localidade} - {endereco.uf}</span>
          </div>

          <div className="endereco-cep-field">
            <label>Complemento (opcional)</label>
            <input
              type="text"
              value={complemento}
              onChange={handleComplementoChange}
              placeholder="Apto, bloco, referência..."
            />
          </div>
        </>
      )}
    </div>
  );
}

export default EnderecoCep;
