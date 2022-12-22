(async function () {
  const resp = await API.profile();
  if (resp.code !== 0) {
    location.href = "./login.html";
    return;
  }
  const userData = resp.data;
  //获取的dom
  const nickName = $("#nickname");
  const loginId = $("#loginId");
  const close = $(".close");
  const chatContainer = $(".chat-container");
  const txtMsg = $("#txtMsg");
  const msgContainer = $(".msg-container");

  nickName.innerText = userData.nickname;
  loginId.innerText = userData.loginId;

  //所有的事件都在这里添加
  function bindEvent() {
    //注册注销事件
    close.addEventListener("click", function () {
      API.loginOut();
      location.href = "./login.html";
    });
    //聊天框内容发送事件
    msgContainer.addEventListener("submit", async function (e) {
      e.preventDefault();
      const txtContent = txtMsg.value;
      //判断是否为无效提交
      if (!txtContent) return;
      //将聊天框输入的内容发送填写到页面中
      const curTxt = {
        from: 1,
        content: txtContent,
        createdAt: Date.now(),
      };
      addChat(curTxt);
      //每次发送完清空输入框并自动滚动到最后
      txtMsg.value = "";
      scrollBottom();
      //向服务器发送输入框内容,并获取到返回内容
      const resp = await API.sendMsg(txtContent);

      const aiTxt = {
        from: null,
        content: resp.data.content,
        createdAt: resp.data.createdAt,
      };
      addChat(aiTxt);
      //每次机器人回复消息自动滚动到最后
      scrollBottom();
    });
  }
  bindEvent();

  /**
   * 给页面填充聊天记录
   * @param {Object} obj
   */
  function addChat(obj) {
    const div = $$$("div");
    div.classList.add("chat-item");
    if (obj.from) div.classList.add("me");

    const img = $$$("img");
    img.classList.add("chat-avatar");
    img.src = obj.from ? "./asset/avatar.png" : "./asset/robot-avatar.jpg";

    const content = $$$("div");
    content.classList.add("chat-content");
    content.innerText = obj.content;

    const data = $$$("div");
    data.classList.add("chat-date");
    data.innerText = formatData(obj.createdAt);

    div.appendChild(img);
    div.appendChild(content);
    div.appendChild(data);
    chatContainer.appendChild(div);
  }

  /**
   * 传入时间戳，返回一个正常格式的时间
   */
  function formatData(timetamp) {
    const date = new Date(timetamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, 0);
    const day = date.getDate().toString().padStart(2, 0);
    const hour = date.getHours().toString().padStart(2, 0);
    const min = date.getMinutes().toString().padStart(2, 0);
    const sec = date.getSeconds().toString().padStart(2, 0);

    return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
  }

  //在这里循环加载历史记录
  async function loadHistory() {
    const resp = await API.getHistory();
    for (const item of resp.data) {
      addChat(item);
    }
    //让滚动条滚动到底部
    scrollBottom();
  }
  await loadHistory();
  scrollBottom();
  //滚动到末尾函数
  function scrollBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

})();
