import { Time } from "./classes/Time.js";
import { Context } from "./classes/Context.js";
import { HttpRequest } from "./classes/HttpRequest.js";

/**
 * @fileoverview Biblioteca de utilitários para integração com a plataforma Blip
 * @module blip-utils
 * @version 1.0.0
 * @description Esta biblioteca fornece utilitários para:
 * - Realização de requisições HTTP
 * - Gerenciamento de variáveis de contexto
 * - Manipulação de datas e tempos
 */

/**
 * Exporta as instâncias dos utilitários
 * @exports {Object} Utilitários do Blip
 * @property {HttpRequest} request - Instância para requisições HTTP
 * @property {Context} context - Instância para gerenciamento de contexto
 * @property {Time} time - Instância para manipulação de datas e tempos
 */
export const request = new HttpRequest();
export const context = new Context();
export const time = new Time();
