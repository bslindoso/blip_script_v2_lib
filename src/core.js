import { Time } from "./Time.js";
import { Context } from "./Context.js";
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
