package br.com.sistemaagendamento.dominio;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.Objects;

/** Período semanal de um profissional, sem validação da agenda global. */
public class Disponibilidade {

    private final Long id;
    private DayOfWeek diaSemana;
    private LocalTime horaInicio;
    private LocalTime horaFim;
    private Profissional profissional;

    public Disponibilidade(Long id, DayOfWeek diaSemana, LocalTime horaInicio, LocalTime horaFim,
            Profissional profissional) {
        this.id = id;
        this.diaSemana = Objects.requireNonNull(diaSemana, "Campo obrigatório: diaSemana");
        this.horaInicio = Objects.requireNonNull(horaInicio, "Campo obrigatório: horaInicio");
        this.horaFim = Objects.requireNonNull(horaFim, "Campo obrigatório: horaFim");
        this.profissional = Objects.requireNonNull(profissional, "Campo obrigatório: profissional");
    }

    public Long getId() {
        return id;
    }

    public DayOfWeek getDiaSemana() {
        return diaSemana;
    }

    public void setDiaSemana(DayOfWeek diaSemana) {
        this.diaSemana = Objects.requireNonNull(diaSemana, "Campo obrigatório: diaSemana");
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = Objects.requireNonNull(horaInicio, "Campo obrigatório: horaInicio");
    }

    public LocalTime getHoraFim() {
        return horaFim;
    }

    public void setHoraFim(LocalTime horaFim) {
        this.horaFim = Objects.requireNonNull(horaFim, "Campo obrigatório: horaFim");
    }

    public Profissional getProfissional() {
        return profissional;
    }

    public void setProfissional(Profissional profissional) {
        this.profissional = Objects.requireNonNull(profissional, "Campo obrigatório: profissional");
    }
}
