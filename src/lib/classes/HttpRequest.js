/**
 * Erro lançado quando um método HTTP inválido é fornecido.
 * @class InvalidMethodError
 */
class InvalidMethodError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidMethodError";
  }
}

/**
 * Erro lançado ao falhar na conversão de uma string JSON para objeto.
 * @class JsonParseError
 */
class JsonParseError extends Error {
  constructor(message) {
    super(message);
    this.name = "JsonParseError";
  }
}

/**
 * Utilitário para validação e gerenciamento de métodos HTTP.
 * @class HttpMethod
 */
class HttpMethod {
  static #methods = Object.freeze([
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
    "HEAD",
    "TRACE",
  ]);

  /**
   * Verifica se um método fornecido é válido.
   * @param {string} method - O método HTTP a ser verificado.
   * @returns {boolean} Verdadeiro se o método for válido, falso caso contrário.
   */
  static isValid(method) {
    return this.#methods.includes(method);
  }

  /**
   * Retorna o método HTTP padrão.
   * @returns {string} O método HTTP padrão ("GET").
   */
  static get default() {
    return "GET";
  }
}

/**
 * Representa as opções de uma requisição HTTP.
 * @class HttpRequestOptions
 */
class HttpRequestOptions {
  /**
   * Cria uma nova instância de opções de requisição.
   * @param {object} options - As opções da requisição.
   * @param {string} [options.method] - Método HTTP.
   * @param {object} [options.headers] - Cabeçalhos HTTP.
   * @param {*} [options.body] - Corpo da requisição.
   */
  constructor(options = {}) {
    this.method = options.method || HttpMethod.default;
    this.headers = options.headers || {};
    this.body = options.body || null;

    if (!HttpMethod.isValid(this.method)) {
      throw new InvalidMethodError(`'${this.method}' is not a valid method`);
    }
  }

  /**
   * Converte as opções da requisição para um objeto compatível com fetch.
   * @returns {object} Objeto com os parâmetros da função fetch.
   */
  toFetchInit() {
    const init = {
      method: this.method,
      headers: this.headers,
    };

    if (this.#hasBody()) {
      init.body = JSON.stringify(this.body);
    }

    return init;
  }

  /**
   * Verifica se a requisição possui um corpo a ser enviado.
   * @returns {boolean}
   */
  #hasBody() {
    return this.method !== HttpMethod.default && this.body;
  }
}

/**
 * Representa a resposta de uma requisição HTTP.
 * @class HttpResponseWrapper
 */
class HttpResponseWrapper {
  /**
   * Cria uma nova instância de resposta HTTP.
   * @param {Response} response - Objeto de resposta do fetch.
   * @param {string} rawBody - Corpo da resposta em texto bruto.
   */
  constructor(response, rawBody) {
    this.status = response.status;
    this.headers = response.headers;
    this.body = rawBody;
    this.success = this.#isSuccessful();
    this.json = this.#parseJson(rawBody);
  }

  /**
   * Verifica se a resposta foi bem-sucedida (status 2xx).
   * @returns {boolean}
   */
  #isSuccessful() {
    return this.status >= 200 && this.status < 300;
  }

  /**
   * Tenta fazer o parsing do corpo como JSON.
   * @param {string} body - Corpo da resposta.
   * @returns {object|null} Objeto JSON ou lança erro se falhar.
   */
  #parseJson(body) {
    try {
      return JSON.parse(body);
    } catch (_) {
      throw new JsonParseError(`Failed to parse response body as JSON`);
    }
  }

  /**
   * Retorna o conteúdo JSON da resposta de forma assíncrona.
   * @returns {Promise<object|null>}
   */
  async jsonAsync() {
    return this.json;
  }
}

/**
 * Classe responsável por realizar requisições HTTP
 * @class HttpRequest
 */
export class HttpRequest {
  /**
   * Realiza uma requisição HTTP e retorna uma resposta encapsulada.
   * @param {string} url - URL da requisição.
   * @param {object} [options] - Opções da requisição.
   * @returns {Promise<HttpResponseWrapper|object>} Objeto de resposta.
   */
  async fetchAsync(url, options = {}) {
    const requestOptions = new HttpRequestOptions(options);
    const init = requestOptions.toFetchInit();

    try {
      const response = await fetch(url, init);
      const rawBody = await response.text();
      return new HttpResponseWrapper(response, rawBody);
    } catch (error) {
      console.error("Request failed: ", error);
      return {
        status: 0,
        headers: {},
        body: null,
        json: null,
        success: false,
        error: error.message,
        jsonAsync: async () => null,
      };
    }
  }
}
