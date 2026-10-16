package br.com.sistemaagendamento.dominio;

import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Set;

/** Profissional e os serviços que está apto a realizar. */
public class Profissional extends Usuario {

    private String especialidade;
    private final Set<Servico> servicos = new LinkedHashSet<>();

    public Profissional(Long id, String nome, String telefone, String email, String especialidade) {
        super(id, nome, telefone, email);
        this.especialidade = especialidade;
    }

    public String getEspecialidade() {
        return especialidade;
    }

    public void setEspecialidade(String especialidade) {
        this.especialidade = especialidade;
    }

    public Set<Servico> getServicos() {
        return Collections.unmodifiableSet(servicos);
    }

    /** Vincula os dois lados da associação, sem repetir a mesma instância. */
    public void adicionarServico(Servico servico) {
        Objects.requireNonNull(servico, "Campo obrigatório: servico");
        if (servicos.add(servico)) {
            servico.adicionarProfissional(this);
        }
    }

    /** Desfaz o vínculo nos dois lados sem alterar agendamentos existentes. */
    public void removerServico(Servico servico) {
        Objects.requireNonNull(servico, "Campo obrigatório: servico");
        if (servicos.remove(servico)) {
            servico.removerProfissional(this);
        }
    }
}
