# Documentação inicial

## Introdução

O Sistema de Gerenciamento e Agendamento de Serviços para Pequenos Estabelecimentos é um projeto acadêmico da disciplina de Programação Orientada a Objetos. É desenvolvido em TypeScript para aplicar conceitos de POO à organização de atendimentos em barbearias, salões de beleza, manicures, clínicas de estética e outros pequenos prestadores de serviço.

## Problema identificado

Muitos pequenos estabelecimentos realizam agendamentos por WhatsApp, agendas físicas ou registros manuais. Informações dispersas dificultam a consulta de horários disponíveis, favorecem esquecimentos e conflitos de horário e dificultam a organização da agenda dos profissionais. Também podem prejudicar o registro do histórico de atendimentos e o acompanhamento de cancelamentos e alterações de horário.

## Justificativa

Centralizar clientes, profissionais, serviços e agendamentos pode melhorar a organização do estabelecimento, facilitar a consulta da agenda e reduzir falhas de comunicação. O projeto também permite exercitar a modelagem de entidades, o encapsulamento e as relações entre objetos em um contexto real.

## Objetivo geral

Desenvolver uma aplicação orientada a objetos para centralizar e organizar clientes, profissionais, serviços, disponibilidade e agendamentos.

## Objetivos específicos

- Cadastrar clientes, profissionais e serviços.
- Associar serviços aos profissionais.
- Registrar disponibilidade dos profissionais e consultar horários disponíveis.
- Realizar e acompanhar agendamentos.
- Impedir conflitos de horário.
- Permitir a alteração e o cancelamento de agendamentos.
- Acompanhar o status dos agendamentos.
- Armazenar histórico de atendimentos.

## Usuários do sistema

### Cliente

Pessoa que solicita ou agendará serviços e acompanha seus agendamentos.

### Profissional

Pessoa responsável por realizar o serviço e acompanhar sua agenda de atendimentos.

### Administrador

Pessoa responsável pela gestão do estabelecimento e das informações do sistema, incluindo profissionais e serviços.

## Escopo da primeira entrega

A entrega de **30/09/2026** contempla documentação, organização do repositório, arquitetura inicial, entidades, relações, estrutura de dados, requisitos e diagramas iniciais. Não inclui a aplicação completa, funcionalidades implementadas ou um banco de dados real.

Esta documentação poderá evoluir conforme a imersão na comunidade e o levantamento de requisitos forem realizados. Os perfis acima representam papéis iniciais; permissões e formas de acesso serão detalhadas posteriormente com a equipe.

## Aplicação de POO

A proposta inicial adota **Usuario como classe abstrata**, concentrando os atributos comuns herdados por Cliente, Profissional e Administrador. Isso explicita abstração e herança no modelo. O encapsulamento protege os dados e comportamentos dos objetos, com responsabilidades separadas entre as camadas.

As associações representam os vínculos do domínio: cada Agendamento referencia Cliente, Profissional e Servico; Profissional possui períodos de Disponibilidade e se associa a serviços independentemente de agendamentos.

## Tecnologias e evolução

React, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query e React Hook Form + Zod na web. Node.js 24, NestJS e Prisma ORM 7 com PostgreSQL no servidor. A primeira entrega acadêmica permanece no histórico Git. Consulte [migração](migracao.md) para situação verificável e limites atuais. Nenhuma entrevista ou validação de campo foi realizada por esta migração.

[Arquitetura](arquitetura.md), [requisitos](requisitos.md), [entidades](entidades.md), [relações](relacoes.md), [dados](dados.md) e [imersão](imersao.md).
