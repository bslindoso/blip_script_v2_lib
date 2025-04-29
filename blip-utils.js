const moment = require('moment-timezone');

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
 * Classe responsável por realizar requisições HTTP
 * @class HttpRequest
 */
class HttpRequest {
  /**
   * Realiza uma requisição HTTP assíncrona
   * @param {string} url - URL da requisição
   * @param {Object} [options=null] - Opções da requisição
   * @param {string} [options.method='GET'] - Método HTTP
   * @param {Object} [options.headers={}] - Cabeçalhos da requisição
   * @param {Object} [options.body=null] - Corpo da requisição
   * @returns {Promise<Object>} Resposta da requisição
   */
  async fetchAsync(url, options = null) {
    const config = {
      method: 'GET',
      headers: {},
      body: null,
      ...options
    };

    const { method, headers, body } = config;

    const requestOptions = {
      method,
      headers
    };

    if (method !== 'GET' && body) {
      requestOptions.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, requestOptions);
      const clonedResponse = response.clone();
      const responseText = await response.text();

      let responseJson = null;
      try {
        responseJson = JSON.parse(responseText);
      } catch (e) {
        // Texto não é um JSON válido
      }

      return {
        status: clonedResponse.status,
        headers,
        body: responseText,
        json: responseJson,
        success: (clonedResponse.status >= 200 && clonedResponse.status < 300),
        jsonAsync: async () => responseJson || JSON.parse(responseText)
      };
    } catch (error) {
      console.error('Falha na requisição:', error);
      return {
        status: 0,
        headers: {},
        body: null,
        json: null,
        success: false,
        error: error.message,
        jsonAsync: async () => null
      };
    }
  }
}

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
 * Classe para manipulação de datas e tempos
 * @class Time
 */
class Time {
  /**
   * Construtor da classe Time
   * @param {string} [defaultTimeZone='America/Sao_Paulo'] - Timezone padrão
   */
  constructor(defaultTimeZone = 'America/Sao_Paulo') {
    this.defaultTimeZone = defaultTimeZone;
    moment.tz.setDefault(defaultTimeZone);
  }

  /**
   * Analisa uma string de data para um objeto Date
   * @param {string} date - String de data a ser analisada
   * @param {Object} [options={}] - Opções de análise
   * @param {string} [options.format] - Formato da data
   * @param {string} [options.culture='en-US'] - Cultura para inferência do formato
   * @param {string} [options.timeZone] - Timezone a ser usado
   * @returns {Date} Objeto Date
   */
  parseDate(date, options = {}) {
    const { format, culture = 'en-US', timeZone = this.defaultTimeZone } = options;

    let momentDate;

    if (format) {
      momentDate = moment(date, format, culture);
    } else {
      // Tenta inferir o formato
      momentDate = moment(date);
    }

    if (!momentDate.isValid()) {
      throw new Error('Data inválida');
    }

    // Aplica o timezone se especificado
    if (timeZone) {
      momentDate = momentDate.tz(timeZone);
    }

    // Retorna um objeto Date nativo
    const jsDate = momentDate.toDate();

    // Modifica os métodos do prototype para usar o timezone do bot
    const originalToDateString = jsDate.toDateString;
    const originalToTimeString = jsDate.toTimeString;
    const originalToString = jsDate.toString;

    jsDate.toDateString = function () {
      return moment(this).tz(timeZone).format('ddd MMM DD YYYY');
    };

    jsDate.toTimeString = function () {
      return moment(this).tz(timeZone).format('HH:mm:ss GMTZZ');
    };

    jsDate.toString = function () {
      return moment(this).tz(timeZone).format('ddd MMM DD YYYY HH:mm:ss GMTZZ');
    };

    return jsDate;
  }

  /**
   * Converte um objeto Date para string
   * @param {Date} date - Objeto Date a ser convertido
   * @param {Object} [options={}] - Opções de formatação
   * @param {string} [options.format] - Formato da data
   * @param {string} [options.timeZone] - Timezone a ser usado
   * @returns {string} Data formatada como string
   */
  dateToString(date, options = {}) {
    let { format, timeZone = this.defaultTimeZone } = options;

    let momentDate = moment(date);

    // Aplica o timezone se especificado
    if (timeZone) {
      momentDate = momentDate.tz(timeZone);
    }

    if (!format) {
      // Formato padrão: yyyy-MM-dd'T'HH:mm:ss.fffffffK
      return momentDate.format('YYYY-MM-DDTHH:mm:ss.SSSSSSSZ');
    }

    if (format.includes('dd')) {
      format = format.replace('dd', 'DD');
    }

    return momentDate.format(format);
  }

  /**
   * Pausa a execução do script por um determinado tempo
   * @param {number} milliseconds - Tempo em milissegundos
   * @returns {Promise<void>}
   */
  sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
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
  time: new Time()
};