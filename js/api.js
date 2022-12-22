const API = (function () {
  const BASE_URL = "https://study.duyiedu.com";

  //封装一个get函数
  function get(path) {
    const headers = {};
    const token = localStorage.getItem("token");
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, { headers });
  }

  //封装一个post函数
  function post(path, bodyObj) {
    const headers = {
      "Content-Type": "application/json",
    };
    const token = localStorage.getItem("token");
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, {
      method: "POST",
      headers,
      body: JSON.stringify(bodyObj),
    });
  }

  //注册
  async function reg(userInfo) {
    const resp = await post("/api/user/reg", userInfo);
    return await resp.json();
  }

  //登录
  async function login(loginInfo) {
    const resp = await post("/api/user/login", loginInfo);
    const result = await resp.json();
    if (result.code === 0) {
      //登录成功后保存令牌
      const token = resp.headers.get("authorization");
      localStorage.setItem("token", token);
    }
    return result;
  }

  //验证账号
  async function exists(loginId) {
    const resp = await get("/api/user/exists?loginId=" + loginId);
    return await resp.json();
  }

  //获取当前登录的用户信息
  async function profile() {
    const resp = await get("/api/user/profile");
    return await resp.json();
  }

  //发送消息
  async function sendMsg(content) {
    const resp = await post("/api/chat", {
      content,
    });
    return await resp.json();
  }

  //获取聊天记录
  async function getHistory() {
    const resp = await get("/api/chat/history");
    return await resp.json();
  }

  //退出登录
  function loginOut() {
    localStorage.removeItem("token");
  }

  return {
    reg,
    login,
    exists,
    profile,
    sendMsg,
    getHistory,
    loginOut,
  };
})();
