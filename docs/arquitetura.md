# Arquitetura inicial

A proposta inicial é uma arquitetura em camadas, simples e adequada a um projeto acadêmico em Java. A separação de responsabilidades facilita a compreensão e a manutenção do sistema.

## Camada de Apresentação

Responsável pela interação com o usuário, apresentando informações e recebendo entradas. A aplicação desktop utilizará JavaFX, com layouts em FXML, edição visual no Scene Builder e estilos em CSS.

## Camada de Controle

Responsável por receber ações da interface e encaminhá-las para as regras do sistema. Os controllers também devolvem os resultados para a apresentação.

## Camada de Serviço / Regras de Negócio

Responsável por:

- Verificar disponibilidade.
- Validar agendamentos.
- Evitar conflitos de horário.
- Verificar se o profissional está associado ao serviço solicitado.
- Controlar alterações e cancelamentos.

As regras iniciais estão em [requisitos](requisitos.md), especialmente RN01–RN07. A validação considera o intervalo completo do serviço, os períodos de Disponibilidade e os agendamentos que ocupam a agenda. As regras serão refinadas após a imersão.

## Camada de Persistência

Responsável pela comunicação com o MySQL por meio de repositories. O banco está definido; o mecanismo de acesso aos dados e o mapeamento das classes para as tabelas serão detalhados na implementação.

## Camada de Modelo

Responsável pelos dados e comportamentos do domínio. É formada por:

- **Usuario**: classe abstrata com os atributos comuns.
- **Cliente**, **Profissional** e **Administrador**: subclasses de Usuario.
- **Servico**: serviço oferecido pelo estabelecimento.
- **Disponibilidade**: período semanal disponível de um profissional.
- **Agendamento**: atendimento associado a um cliente, profissional e serviço.
- **StatusAgendamento**: enum previsto com `AGENDADO`, `CONFIRMADO`, `CANCELADO` e `CONCLUIDO`.

O modelo é utilizado pelas camadas da aplicação conforme suas responsabilidades. As entidades estão documentadas em [entidades](entidades.md); StatusAgendamento é um tipo enumerado do domínio, não uma entidade com identidade própria.

## Fluxo inicial

```text
Apresentação (JavaFX, FXML, Scene Builder e CSS)
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
MySQL
```

O fluxo representa o encaminhamento de uma solicitação até a persistência; os resultados retornam às camadas anteriores. O modelo apoia essas interações e não representa uma etapa adicional depois do banco de dados.

JavaFX compõe a camada de apresentação. Nenhum framework adicional para o Back-end ou para persistência foi definido. A estrutura de pacotes Java será detalhada na implementação.

A organização das camadas está representada no [diagrama de arquitetura](../diagramas/diagrama-arquitetura.md).
