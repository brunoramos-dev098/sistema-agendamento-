package br.com.sistemaagendamento.dominio;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Objects;

/** Dados de um atendimento; regras de agendamento pertencem aos futuros Services. */
public class Agendamento {

    private final Long id;
    private LocalDate data;
    private LocalTime horario;
    private StatusAgendamento status;
    private Cliente cliente;
    private Profissional profissional;
    private Servico servico;

    public Agendamento(Long id, LocalDate data, LocalTime horario, StatusAgendamento status,
            Cliente cliente, Profissional profissional, Servico servico) {
        this.id = id;
        this.data = Objects.requireNonNull(data, "Campo obrigatório: data");
        this.horario = Objects.requireNonNull(horario, "Campo obrigatório: horario");
        this.status = Objects.requireNonNull(status, "Campo obrigatório: status");
        this.cliente = Objects.requireNonNull(cliente, "Campo obrigatório: cliente");
        this.profissional = Objects.requireNonNull(profissional, "Campo obrigatório: profissional");
        this.servico = Objects.requireNonNull(servico, "Campo obrigatório: servico");
    }

    public Long getId() {
        return id;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = Objects.requireNonNull(data, "Campo obrigatório: data");
    }

    public LocalTime getHorario() {
        return horario;
    }

    public void setHorario(LocalTime horario) {
        this.horario = Objects.requireNonNull(horario, "Campo obrigatório: horario");
    }

    public StatusAgendamento getStatus() {
        return status;
    }

    public void setStatus(StatusAgendamento status) {
        this.status = Objects.requireNonNull(status, "Campo obrigatório: status");
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = Objects.requireNonNull(cliente, "Campo obrigatório: cliente");
    }

    public Profissional getProfissional() {
        return profissional;
    }

    public void setProfissional(Profissional profissional) {
        this.profissional = Objects.requireNonNull(profissional, "Campo obrigatório: profissional");
    }

    public Servico getServico() {
        return servico;
    }

    public void setServico(Servico servico) {
        this.servico = Objects.requireNonNull(servico, "Campo obrigatório: servico");
    }
}
