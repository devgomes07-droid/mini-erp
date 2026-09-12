package com.gabriel.mini_erp.exception;

public class RegraNegocioViolada extends RuntimeException {
    public RegraNegocioViolada(String mensagem) {
        super(mensagem);
    }
}
