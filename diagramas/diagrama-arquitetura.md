# Diagrama de Arquitetura

```mermaid
flowchart TD
    A["Apresentação: JavaFX, FXML, Scene Builder e CSS"]
    B[Controller]
    C[Service / Regras de Negócio]
    D[Repository / Persistência]
    E[(MySQL)]
    M[Modelo de Domínio]

    A --> B
    B --> C
    C --> D
    D --> E
    A -. utiliza .-> M
    B -. utiliza .-> M
    C -. utiliza .-> M
    D -. utiliza .-> M
```

As setas contínuas mostram o encaminhamento de uma solicitação: a apresentação interage com o usuário, o controller recebe a ação, o service coordena as regras e o repository realiza o acesso à persistência. Os resultados retornam às camadas anteriores.

As setas pontilhadas indicam uso do modelo de domínio conforme a responsabilidade de cada camada. O modelo reúne Usuario (classe abstrata), Cliente, Profissional, Administrador, Servico, Disponibilidade, Agendamento e o enum StatusAgendamento. Ele não é uma etapa linear depois do banco.

A apresentação utilizará JavaFX, layouts FXML editados no Scene Builder e estilos CSS. Os repositories acessarão o MySQL. As responsabilidades estão detalhadas em [arquitetura](../docs/arquitetura.md), e o domínio está representado no [diagrama de classes](diagrama-classes.md).
