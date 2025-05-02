import { Time } from "./Time.js";
import { HttpRequest } from "./HttpRequest.js";

/**
 * @fileoverview Biblioteca de utilitários para integração com a plataforma Blip
 * @module blip-utils
 * @version 2.0.0
 * @description Esta biblioteca fornece utilitários para:
 * - Realização de requisições HTTP
 * - Gerenciamento de variáveis de contexto
 * - Manipulação de datas e tempos
 */

/**
 * Classe para manipulação de intervalos de tempo
 * @class TimeSpan
 */
class TimeSpan {
  /**
   * Converte minutos para milissegundos
   * @param {number} minutes - Minutos a serem convertidos
   * @returns {number} Milissegundos equivalentes
   */
  fromMinutes(minutes) {
    return minutes * 60 * 1000;
  }

  /**
   * Retorna o valor em milissegundos
   * @param {number} milliseconds - Valor em milissegundos
   * @returns {number} O mesmo valor em milissegundos
   */
  fromMilliseconds(milliseconds) {
    return milliseconds;
  }
}

/**
 * Classe para gerenciamento de variáveis de contexto
 * @class Context
 */
class Context {
  constructor() {
    this.variablesContent = {};
  }

  /**
   * Define uma variável no contexto
   * @param {string} name - Nome da variável
   * @param {any} value - Valor da variável
   * @param {number} [expiration=null] - Tempo de expiração em milissegundos
   */
  async setVariableAsync(name, value, expiration = null) {
    this.variablesContent[name] = value;
  }

  /**
   * Remove uma variável do contexto
   * @param {string} name - Nome da variável a ser removida
   */
  async deleteVariableAsync(name) {
    delete this.variablesContent[name];
  }

  /**
   * Obtém o valor de uma variável do contexto
   * @param {string} name - Nome da variável
   * @returns {Promise<any>} Valor da variável
   */
  async getVariableAsync(name) {
    return this.variablesContent[name];
  }
}

/**
 * Exporta as instâncias dos utilitários
 * @exports {Object} Utilitários do Blip
 * @property {HttpRequest} request - Instância para requisições HTTP
 * @property {TimeSpan} TimeSpan - Instância para manipulação de tempo
 * @property {Context} context - Instância para gerenciamento de contexto
 * @property {Time} time - Instância para manipulação de datas e tempos
 */
module.exports = {
  request: new HttpRequest(),
  TimeSpan: new TimeSpan(),
  context: new Context(),
  time: new Time(),
};
