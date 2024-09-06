# NestJS: Estrutura e Funcionalidades

O NestJS possui várias ferramentas para ajudar a lidar com requisições e estruturar sua aplicação:

- **Pipe**: Valida os dados da requisição. 
- **Guard**: Valida se o usuário está autenticado.
- **Controller**: Roteia a requisição para uma função particular.
- **Service**: Contém a lógica de negócio.
- **Repository**: Acessa o banco de dados.
- **Módulo**: Agrupa códigos relacionados.

A execução segue uma cadeia onde um componente chama o próximo na ordem: 
Pipe --> Controller --> Service --> Controller

É muito comum o service e repository serem muito parecidos. O controller usa o service para obter ou manipular dados, mantendo a separação de responsabilidades e evitando acessar diretamente o repositório. Isso organiza o código e mantém a lógica de negócios separada da lógica de persistência 

## Exemplos de Uso
Para cada rota que você constrói, considere quais dessas ferramentas serão necessárias. Por exemplo, uma rota POST pode precisar lidar com lógica de negócio e também pode exigir validação de autenticação.

## Componentes Básicos
- Toda aplicação NestJS tem pelo menos um **módulo** e um **controller**. Também deve ter um PIPE, nem que seja um pipe global no arquivo main

- Se dentro do diretório `src` houver um arquivo `main.ts`, ele será o primeiro a ser executado ao iniciar a aplicação.

## Decorators
- O **decorator** é colocado em cima da classe para definir metadados ou configurar o comportamento dela, ajudando a indicar seu propósito ou como ela deve ser tratada pelo framework.
- Decorators como `@Get()`, `@Post()`, entre outros, são usados para configurar o funcionamento das classes e métodos.
- Existem outros decorators, como @Body e @Params, que são usados para argumentos. Eles são úteis, por exemplo, quando você faz um POST e precisa passar um corpo (body), ou quando você faz um GET e precisa especificar um parâmetro, como o ID, para buscar um item específico.

## Exemplo de Roteamento
Ao passar uma string dentro desses decorators de método, como em `@Get('/adsd')`, isso significa que o método GET será acessado na rota `/adsd`.

Exemplo:
```typescript
@Controller('/app')
export class AppController {
   @Get('/asdf')
   getRootRoute() {
      return 'hi there!';
   }
}
```

No exemplo acima, o método GET está acessível em /app/asdf

## Listagem de Controllers
- O **controller** possui um objeto que lista todos os controllers registrados 

## Instalação do NestJS 
```bash
$ npm install -g @nestjs/cli
$ nest new <nome-do-projeto>
```

## Criação do módulo 
```bash
$ nest generate module message
```

## Criação do controller 
```bash
$ nest generate controller message/messages --flat 
```
- Isso vai gerar 3 arquivos dentro de uma pasta 'message': 
   - messages.controller.spec.ts
   - messages.controller.ts
   - messages.module.ts
- O '--flat' é para não criar uma pasta extra chamado 'controllers' com os arquivos de controllers dentro

## Setando Validação Automática do Pipe 
1. Setar a validação global no main 
2. Criar uma classe que descreve as diferente propriedades que o body da requisição deve ter. Essa classe é o DATA TRANSFER OBJECT (DTO). O DTO é uma classe que define a estrutura dos dados que serão transferidos entre diefrentes camadas da aplicação, como entre o controller e o service
3. Adicionar a regra de validação na classe 
4. Aplicar essa classe no request handler 

## Etapas da validação do PIPE (está sendo usado no body de createMessage)
1. Usa class-transformer para transformar o body em uma instancia de classe DTO 
2. Use class-validator para validar a instancia 
3. Se tem um erro de validação, responde imediatamente. Se não, entrega o body ao request handler

## Princípio de inversão de controle (IoC)
**Inversão de Controle (IoC)** é um conceito da engenharia de software que sugere que, para criar um código mais reutilizável e flexível, as classes não devem criar instâncias de suas próprias dependências diretamente. Em vez disso, essas dependências devem ser injetadas de fora, por meio de mecanismos como a Injeção de Dependências (Dependency Injection, DI).
Exemplo criando instância dentro de sua dependência 
```typescript
export class MessagesService {
   messagesRepo: MessagesRepository;

   constructor() {
      this.messagesRepo = new MessagesRepository();
   }
}
```
Bom: Cria uma instância do serviço de mensagens, passando uma cópia de uma cópia já existente do repositório. Então criamos esse repositório e sempre que quiser um service, vamos passá-lo.
Só que ele depende especificamente de uma cópia do repositório de Messages
```typescript
export class MessagesService {
   messagesRepo: MessagesRepository;

   constructor(repo: MessagesRepository) {
      this.messagesRepo = repo;
   }
}
```
Melhor: o MessagesService se torna mais flexível e desacoplado, podendo trabalhar com qualquer implementação que siga a interface esperada (Repository). Isso melhora a reutilização do código, facilita a manutenção e otimiza o desempenho, dependendo de qual implementação do repositório está sendo usada

```typescript
interface Repository {
   findOne(id: string);
   findAll();
   create(content: string);
}

export class MessagesService {
   messagesRepo: Repository;

   constructor(repo: Repository) {
      this.messagesRepo = repo
   }
}
```
