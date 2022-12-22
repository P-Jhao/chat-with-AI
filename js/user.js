class FieldValidator {
  /**
   *
   * @param {String} inputId //提供该input的Id
   * @param {Function} validatorFn //提供一个验证的处理方法
   */
  constructor(inputId, validatorFn) {
    this.input = $(inputId);
    this.p = this.input.nextElementSibling;
    this.validatorFn = validatorFn;
    this.input.onblur = () => {
      this.validator();
    };
  }

  /**
   * 验证，有错误返回false，正常则返回true
   * @returns blur
   */
  async validator() {
    const err = await this.validatorFn(this.input.value);
    if (err) {
      this.p.innerText = err;
      return false;
    } else {
      this.p.innerText = "";
      return true;
    }
  }

  static async validator(...validators) {
    const proms = validators.map((item) => item.validator());
    const result = await Promise.all(proms);
    return result.every((item) => item);
  }
}
