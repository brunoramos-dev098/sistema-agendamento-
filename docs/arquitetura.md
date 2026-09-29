# Arquitetura inicial

A proposta inicial é uma arquitetura em camadas, simples e adequada a um projeto acadêmico em Java. A separação de responsabilidades facilita a compreensão e a manutenção do sistema.

## Camada de Apresentação

Responsável pela interação com o usuário, apresentando informações e recebendo entradas. A tecnologia de interface será definida durante o desenvolvimento.

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

Responsável pela comunicação com o banco de dados por meio de repositories. O banco de dados e a forma de persistência serão definidos posteriormente; nesta entrega há apenas a documentação do modelo previsto.

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
Apresentação
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Banco de Dados
```

O fluxo representa o encaminhamento de uma solicitação até a persistência; os resultados retornam às camadas anteriores. O modelo apoia essas interações e não representa uma etapa adicional depois do banco de dados.

Esta arquitetura poderá ser ajustada posteriormente. Nenhum framework foi escolhido. A estrutura de pacotes Java será definida quando a arquitetura estiver validada.

A representação visual está no [diagrama de arquitetura](../diagramas/diagrama-arquitetura.md). Nesta etapa, as camadas são uma proposta de organização; não há controllers, services ou repositories implementados.
