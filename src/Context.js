/**
 * Erro lançado quando um negativo é fornecido para a expiração.
 * @class ExpirationError
 */
class NegativeExpirationError extends Error {
  constructor() {
    super("Expiration time cannot be negative. Use zero for no expiration.");
    this.name = "ExpirationError";
  }
}

/**
 * Classe que representa o nome de uma variável, garantindo que seja uma string válida.
 * @class VariableName
 */
class VariableName {
  #value;

  /**
   * Cria uma nova instância de VariableName.
   * @param {string} name - O nome da variável.
   * @throws {ReferenceError} Se o nome não for fornecido.
   * @throws {TypeError} Se o nome não for uma string.
   */
  constructor(name) {
    if (!name) throw new ReferenceError("'name' argument is required");
    if (typeof name !== "string")
      throw new TypeError("'name' name must be a string");
    this.#value = name;
  }

  /**
   * Retorna o valor do nome da variável como string.
   * @returns {string}
   */
  toString() {
    return this.#value;
  }
}

/**
 * Classe que encapsula um valor de variável e sua possível expiração.
 * @class VariableEntry
 */
class VariableEntry {
  /**
   * Cria uma nova instância de VariableEntry.
   * @param {*} value - O valor da variável.
   * @param {number} expiration - Tempo em milissegundos até a expiração (0 = sem expiração).
   */
  constructor(value, expiration = 0) {
    this.value = value;
    this.expiration = expiration > 0 ? Date.now() + expiration : null;
  }

  /**
   * Verifica se a variável está expirada.
   * @returns {boolean}
   */
  isExpired() {
    return this.expiration !== null && Date.now() > this.expiration;
  }
}

/**
 * Repositório interno para armazenamento de variáveis com controle de expiração.
 * @class VariableRepository
 */
class VariableRepository {
  #store = new Map();

  /**
   * Verifica se uma variável existe e não está expirada.
   * @param {string} name - Nome da variável.
   * @returns {boolean}
   */
  has(name) {
    const entry = this.#store.get(name);
    return entry && !entry.isExpired();
  }

  /**
   * Obtém o valor de uma variável, se não estiver expirada.
   * @param {string} name - Nome da variável.
   * @returns {*} Valor da variável ou null se inexistente/expirada.
   */
  get(name) {
    const entry = this.#store.get(name);

    if (!entry || entry.isExpired()) {
      this.#store.delete(name);
      return null;
    }

    return entry.value;
  }

  /**
   * Define ou atualiza o valor de uma variável com opção de expiração.
   * @param {string} name - Nome da variável.
   * @param {*} value - Valor da variável.
   * @param {number} expiration - Tempo em milissegundos até expirar.
   */
  set(name, value, expiration = 0) {
    const entry = new VariableEntry(value, expiration);
    this.#store.set(name, entry);
  }

  /**
   * Remove uma variável do repositório.
   * @param {string} name - Nome da variável.
   */
  delete(name) {
    this.#store.delete(name);
  }
}

/**
 * Classe pública para gerenciamento assíncrono de variáveis de contexto com suporte a expiração.
 * @class Context
 */
export class Context {
  #repository;

  /**
   * Inicializa um novo contexto com um repositório de variáveis.
   */
  constructor() {
    this.#repository = new VariableRepository();
  }

  /**
   * Obtém o valor de uma variável de forma assíncrona.
   * @param {string} name - Nome da variável.
   * @returns {Promise<*>} Valor da variável ou null se não existir ou estiver expirada.
   */
  async getVariableAsync(name) {
    const _name = new VariableName(name);
    return this.#repository.get(_name.toString());
  }

  /**
   * Define uma variável de forma assíncrona com valor e tempo de expiração.
   * @param {string} name - Nome da variável.
   * @param {*} value - Valor da variável.
   * @param {number} expiration - Tempo até expiração em milissegundos (0 = sem expiração).
   * @returns {Promise<void|{}|null>}
   */
  async setVariableAsync(name, value, expiration = 0) {
    const _name = new VariableName(name);

    if (expiration < 0) throw new NegativeExpirationError();
    if (value === undefined)
      this.#repository.set(_name.toString(), {}, expiration);

    this.#repository.set(_name.toString(), value, expiration);
  }

  /**
   * Remove uma variável do contexto de forma assíncrona.
   * @param {string} name - Nome da variável.
   * @returns {Promise<void>}
   */
  async deleteVariableAsync(name) {
    const _name = new VariableName(name);
    if (!this.#repository.has(_name.toString())) return;
    this.#repository.delete(_name.toString());
  }
}
