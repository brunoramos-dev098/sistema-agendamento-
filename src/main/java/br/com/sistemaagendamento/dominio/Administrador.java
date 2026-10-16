package br.com.sistemaagendamento.dominio;

/** Administrador com os dados comuns herdados de Usuario. */
public class Administrador extends Usuario {

    public Administrador(Long id, String nome, String telefone, String email) {
        super(id, nome, telefone, email);
    }
}
