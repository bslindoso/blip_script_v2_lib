import { Time } from "./Time.js";
import { Context } from "./Context.js";
import { TimeSpan } from "./TimeSpan.js";
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
 * Exporta as instâncias dos utilitários
 * @exports {Object} Utilitários do Blip
 * @property {HttpRequest} request - Instância para requisições HTTP
 * @property {TimeSpan} TimeSpan - Instância para manipulação de tempo
 * @property {Context} context - Instância para gerenciamento de contexto
 * @property {Time} time - Instância para manipulação de datas e tempos
 */
module.exports = {
  request: new HttpRequest(),
  TimeSpan,
  context: new Context(),
  time: new Time(),
};
