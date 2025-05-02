/**
 * Classe para manipulação de intervalos de tempo
 * @class TimeSpan
 */
export class TimeSpan {
  /**
   * Converte minutos para milissegundos
   * @param {number} minutes - Minutos a serem convertidos
   * @returns {number} Milissegundos equivalentes
   */
  static fromMinutes(minutes) {
    return minutes * 60 * 1000;
  }

  /**
   * Retorna o valor em milissegundos
   * @param {number} milliseconds - Valor em milissegundos
   * @returns {number} O mesmo valor em milissegundos
   */
  static fromMilliseconds(milliseconds) {
    return milliseconds;
  }
}
