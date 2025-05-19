# Blip Script V2 Library

Uma biblioteca JavaScript para facilitar a criação e teste de script que são executados pela builder na plataforma Blip.

## 🚀 Instalação de dependências

```bash
npm install
```

## 🚀 Como Usar

1. Instale as dependências:

```bash
npm install
```

2. Para desenvolvimento:

```bash
npm run dev
```

3. Para build:

```bash
npm run build
```

4. Para build e execução:

```bash
npm run start
```

## 🛠️ Tecnologias

- Node.js
- Babel
- Moment Timezone

## 📦 Estrutura do Projeto

```
.
├── src/           # Código fonte
│   ├── lib/       # Bibliotecas e utilitários
│   └── run.js     # Ponto de entrada
├── dist/          # Código compilado
└── package.json   # Dependências e scripts
```

## Novas Funcionalidades do ExecuteScriptV2

Esta atualização introduz uma nova ação, `ExecuteScriptV2`, que permite a execução de JavaScript com o ClearScript V8. Diferente da ação `ExecuteScriptAction` existente, a nova implementação oferece suporte a definições ECMAScript mais recentes e menos restrições.

## Funcionalidades Principais

* **Execução de JavaScript Aprimorada:** Permite o uso de sintaxe e funcionalidades mais modernas do JavaScript.
    
* **Requisições HTTP:** Possibilidade de executar requisições HTTP diretamente do JavaScript através da API `request.fetchAsync`.
    
* **Manipulação de Retornos:** A nova ação lida com retornos de usuários e os analisa para armazenar em variáveis, suportando Promises.


### Configurações de Captura de Exceção

* `CaptureExceptions`: Define se o script deve capturar exceções.
    
* `ExceptionVariable`: Define a variável para armazenar a mensagem de exceção.
    

## Funcionalidades e Limitações

### Manipulação de Tempo

A nova implementação suporta funções de manipulação de tempo mais recentes, mas possui algumas limitações.

* A timezone local do script não é definida com base na timezone configurada do bot.
    
* As funções `Date.prototype.toDateString`, `Date.prototype.toTimeString` e `Date.prototype.toString` foram modificadas para usar a timezone do bot quando disponível.
    
* Outras funções e o construtor `Date` nativo podem não usar a timezone do bot se o formato da data não a incluir.
    
* Um helper `time.parseDate` é fornecido para contornar essa limitação.
    
* Objetos `Date` retornados pelo script são armazenados no contexto com o formato `yyyy-MM-dd'T'HH:mm:ss.fffffffk`.
    

#### Helpers de Data e Hora

* A timezone do bot é configurada com a chave `builder:#localTimeZone` na configuração do fluxo e a ação deve ter a configuração `LocalTimeZoneEnabled` como `true`.
    
* `time.parseDate(string date, object? options)`: Função para analisar uma string de data e retornar um objeto `DateTime`. As opções incluem `format`, `culture` e `timeZone`.
    
* `time.dateToString(Date date, object? options)`: Função para converter um objeto `Date` em string, usando a timezone do bot ou `America/Sao_Paulo` por padrão. As opções incluem `format` e `timeZone`.
    
* `time.sleep(int milliseconds)`: Função para pausar a execução do script por um tempo determinado. Use com cautela, pois pode tornar a execução do bot mais lenta.
    

### Contexto

Funções adicionadas para interagir com as variáveis de contexto.

* `context.setVariableAsync(string name, object value, TimeSpan? expiration)`: Função assíncrona para definir uma variável no contexto.
    
* `context.getVariableAsync(string name)`: Função assíncrona para obter uma variável do contexto. Retorna uma string vazia se a variável não existir.
    
* `context.deleteVariableAsync(string name)`: Função assíncrona para excluir uma variável do contexto.
    

### Requisições HTTP

Nova API `fetch` para realizar requisições HTTP dentro do script.

* `request.fetchAsync(string url, object? options)`: Função assíncrona para fazer requisições HTTP. As opções incluem `method`, `headers` e `body`.
    
* A função retorna um objeto com `status`, `headers`, `body` e `success`. Também possui o método `jsonAsync()` para analisar o corpo como JSON.
    

Qualquer dúvida ou necessidade de ajustes, pode me falar!

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autores

Bruno Lindoso
Matheus Bibiano
