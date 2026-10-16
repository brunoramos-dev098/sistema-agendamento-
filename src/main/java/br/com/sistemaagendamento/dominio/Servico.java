package br.com.sistemaagendamento.dominio;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Set;

/** Serviço oferecido pelo estabelecimento; duração expressa em minutos. */
public class Servico {

    private final Long id;
    private String nome;
    private String descricao;
    private BigDecimal preco;
    private Integer duracao;

    private final Set<Profissional> profissionais = new LinkedHashSet<>();

    public Servico(Long id, String nome, String descricao, BigDecimal preco, Integer duracao) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.duracao = duracao;
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getPreco() {
        return preco;
    }

    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }

    public Integer getDuracao() {
        return duracao;
    }

    public void setDuracao(Integer duracao) {
        this.duracao = duracao;
    }

    public Set<Profissional> getProfissionais() {
        return Collections.unmodifiableSet(profissionais);
    }

    /** Vincula os dois lados da associação, sem repetir a mesma instância. */
    public void adicionarProfissional(Profissional profissional) {
        Objects.requireNonNull(profissional, "Campo obrigatório: profissional");
        if (profissionais.add(profissional)) {
            profissional.adicionarServico(this);
        }
    }

    /** Desfaz o vínculo nos dois lados sem alterar agendamentos existentes. */
    public void removerProfissional(Profissional profissional) {
        Objects.requireNonNull(profissional, "Campo obrigatório: profissional");
        if (profissionais.remove(profissional)) {
            profissional.removerServico(this);
        }
    }
}
