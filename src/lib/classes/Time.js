import moment from "moment-timezone";

/**
 * Classe de erro personalizada para datas inválidas.
 * @class InvalidDateError
 */
class InvalidDateError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidDateError";
  }
}

/**
 * Classe utilitária para formatação de datas e manipulação de formatos.
 * @class TimeFormatter
 */
class TimeFormatter {
  /**
   * Formata uma data para um determinado fuso horário e formato.
   * @param {Date|string} date - A data a ser formatada.
   * @param {string} timeZone - O fuso horário de destino.
   * @param {string} format - O formato da data.
   * @returns {string} - A data formatada.
   */
  static formatDate(date, timeZone, format) {
    return moment(date).tz(timeZone).format(format);
  }

  /**
   * Retorna o formato padrão de data.
   * @returns {string} - O formato padrão.
   */
  static defaultFormat() {
    return "YYYY-MM-DDTHH:mm:ss.SSSSSSSZ";
  }

  /**
   * Substitui tokens de formato customizados por tokens compatíveis com o moment.js.
   * @param {string} format - O formato com tokens customizados.
   * @returns {string} - O formato ajustado.
   */
  static replaceFormatTokens(format) {
    return format.replace("dd", "DD");
  }
}

/**
 * Classe para manipulação de datas e horários com suporte a formatação, parsing e fuso horário.
 * @class Time
 */
export class Time {
  #defaultTimeZone;

  /**
   * Inicializa a classe com o fuso horário padrão.
   */
  constructor() {
    this.#defaultTimeZone = "America/Sao_Paulo";
    moment.tz.setDefault(this.#defaultTimeZone);
  }

  /**
   * Cria um objeto moment a partir de uma data, com ou sem formato específico.
   * @private
   * @param {string|Date} date - A data de entrada.
   * @param {string} [format] - O formato da data.
   * @param {string} [culture] - A cultura/região para parsing.
   * @returns {moment.Moment} - Objeto moment criado.
   */
  #createMomentDate(date, format, culture) {
    return format ? moment(date, format, culture) : moment(date);
  }

  /**
   * Normaliza o formato da data usando os tokens do moment.js.
   * @private
   * @param {string} [format] - O formato fornecido.
   * @returns {string} - O formato normalizado.
   */
  #normalizeFormat(format) {
    return format
      ? TimeFormatter.replaceFormatTokens(format)
      : TimeFormatter.defaultFormat();
  }

  /**
   * Faz o parsing de uma string de data para um objeto `Date`, respeitando formato, cultura e fuso horário.
   * @param {string|Date} date - A data de entrada.
   * @param {Object} [options] - Opções para parsing.
   * @param {string} [options.format] - O formato da data.
   * @param {string} [options.culture] - Cultura/região para parsing.
   * @param {string} [options.timeZone] - Fuso horário desejado.
   * @returns {Date} - A data convertida.
   * @throws {InvalidDateError} - Caso a data seja inválida.
   */
  parseDate(date, options = {}) {
    const format = options.format;
    const culture = options.culture || "en-US";
    const timeZone = options.timeZone || this.#defaultTimeZone;

    const parsedDate = this.#createMomentDate(date, format, culture);
    if (!parsedDate.isValid()) throw new InvalidDateError("Date is invalid");

    return parsedDate.tz(timeZone).toDate();
  }

  /**
   * Converte um objeto `Date` em uma string formatada, respeitando fuso horário e formato.
   * @param {Date} date - A data a ser formatada.
   * @param {Object} [options] - Opções de formatação.
   * @param {string} [options.timeZone] - Fuso horário desejado.
   * @param {string} [options.format] - Formato de saída.
   * @returns {string} - A data formatada como string.
   */
  dateToString(date, options = {}) {
    const timeZone = options.timeZone || this.#defaultTimeZone;
    const format = this.#normalizeFormat(options.format);

    const zonedDate = moment(date).tz(timeZone);
    return zonedDate.format(format);
  }

  /**
   * Aguarda por um determinado número de milissegundos.
   * @param {number} milliseconds - Tempo a esperar.
   * @returns {Promise<void>} - Promise resolvida após o tempo especificado.
   */
  sleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }
}
