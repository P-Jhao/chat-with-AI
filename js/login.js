//获取的dom
const form = $(".user-form");

const loginIdValidator = new FieldValidator("#txtLoginId", async function (
  val
) {
  if (!val) {
    return "账号不能为空";
  }
});

const txtLoginPwdValidator = new FieldValidator("#txtLoginPwd", async function (
  val
) {
  if (!val) {
    return "密码不能为空";
  }
});

form.onsubmit = async function (e) {
  e.preventDefault();
  const result = await FieldValidator.validator(
    loginIdValidator,
    txtLoginPwdValidator
  );
  if (!result) return; //验证未通过
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  const resp = await API.login(data);
  if (resp.code === 0) {
    location.href = "./index.html";
  } else {
    txtLoginPwdValidator.p.innerText = "账号或密码错误";
  }
};
