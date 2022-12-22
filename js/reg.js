//获取的dom
const form = $(".user-form");

const loginIdValidator = new FieldValidator("#txtLoginId", async function (
  val
) {
  if (!val) {
    return "账号不能为空";
  }
  const resp = await API.exists(val);
  if (resp.data) return "该账号已存在";
});

const txtNicknameValidator = new FieldValidator("#txtNickname", async function (
  val
) {
  if (!val) {
    return "昵称不能为空";
  }
});

const txtLoginPwdValidator = new FieldValidator("#txtLoginPwd", async function (
  val
) {
  if (!val) {
    return "密码不能为空";
  }
});

const txtLoginPwdConfirmValidator = new FieldValidator(
  "#txtLoginPwdConfirm",
  async function (val) {
    if (!val) {
      return "请填写确认密码";
    }
    if (val !== txtLoginPwdValidator.input.value) {
      return "两次输入的密码不一致";
    }
  }
);

form.onsubmit = async function (e) {
  e.preventDefault();
  const result = await FieldValidator.validator(
    loginIdValidator,
    txtNicknameValidator,
    txtLoginPwdValidator,
    txtLoginPwdConfirmValidator
  );
  if (!result) return; //验证未通过
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  const resp = await API.reg(data);
  if (resp.code === 0) {
    alert("注册成功, 点击确认跳转到登录界面");
    location.href = "./login.html";
  }
};
