package br.com.sistemaagendamento.dominio;

/** Cliente com os dados comuns herdados de Usuario. */
public class Cliente extends Usuario {

    public Cliente(Long id, String nome, String telefone, String email) {
        super(id, nome, telefone, email);
    }
}
