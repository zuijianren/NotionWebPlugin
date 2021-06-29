(function () {
  let box;
  let content_origin;
  let dir;
  let btn_dom;
  let btn;
  // 用于监听页面变化的dom元素
  let notion_frame;

  const dir_watch_options = {
    childList: true, // 子节点的变动（新增、删除或者更改）
    // attributes: true, // 属性的变动
    characterData: true, // 节点内容或节点文本的变动
    subtree: true, // 是否将观察器应用于该节点的所有后代节点
  };

  const page_watch_options = {
    childList: true, // 子节点的变动（新增、删除或者更改）
    // attributes: true, // 属性的变动
    characterData: true, // 节点内容或节点文本的变动
  };

  function init_page() {
    notion_frame = document.querySelector(".notion-frame");
    box = document.querySelector("#notion-app");
    box.style.width = "80vw";
    box.style.overflow = "auto";
  }

  function init_dir() {
    // 目录
    content_origin = document.querySelector(
      ".notion-selectable.notion-table_of_contents-block"
    );

    // 复制的目录dom
    dir = document.createElement("div");
    if (content_origin == null) {
      dir.innerHTML = "本页面暂无目录";
    } else {
      dir.innerHTML = content_origin.innerHTML;
    }
    // 设置样式
    dir.classList.add = "zuijianren-content";
    dir.style.width = "20vw";
    dir.style.height = "80vh";
    dir.style.position = "fixed";
    dir.style.overflow = "auto";
    dir.style.padding = " 50px 10px";
    dir.style.top = "10vh";
    dir.style.right = "0";
    document.body.appendChild(dir);
  }

  function init_btn() {
    // 悬浮按钮
    const btn_template = `
        <div id="zuijianren-content-btn"
          style="
            border: 2px solid whitesmoke;
            border-radius: 20%;
            position: absolute;
            top: 20px;
            right: 20px;
            height: 20px;
            width: 2rem;
            text-align: center;
            color: rgba(105, 102, 102, 0.493);
            cursor: pointer;
            transition: all 0.5s ease-in-out;
          "
        >&gt;&gt;</div>
      `;
    btn_dom = document.createElement("div");
    btn_dom.innerHTML = btn_template;
    document.body.appendChild(btn_dom);

    btn = btn_dom.querySelector("div");

    btn.addEventListener("click", () => {
      if (btn.innerHTML == "&gt;&gt;") {
        dir.style.display = "none";
        btn.innerHTML = "&lt;&lt;";
        box.style.width = "95vw";
      } else {
        dir.style.display = "block";
        btn.innerHTML = "&gt;&gt;";
        box.style.width = "80vw";
      }
    });
  }

  // 初始化
  function init() {
    // 简单的调整页面
    init_page();
    // 初始化目录
    init_dir();
    // 初始化按钮
    init_btn();
  }

  function watch() {
    var MutationObserver =
      window.MutationObserver ||
      window.webkitMutationObserver ||
      window.MozMutationObserver;
    // 监听目录
    dir_mutationObserver = new MutationObserver((mutations) => {
      // console.log("dir change");
      dir.innerHTML = content_origin.innerHTML;
    });

    if (content_origin == null) {
      dir.innerHTML = "本页面暂无目录";
    } else {
      dir_mutationObserver.observe(content_origin, dir_watch_options);
    }

    page_mutationObserver = new MutationObserver((mutations) => {
      // console.log("page change");
      // 延时两秒后尝试获取新页面的目录
      setTimeout(() => {
        content_origin = notion_frame.querySelector(
          ".notion-selectable.notion-table_of_contents-block"
        );
        // 停止上一个监听
        dir_mutationObserver.disconnect();
        if (content_origin != null) {
          // 开启当前的监听
          dir_mutationObserver.observe(content_origin, dir_watch_options);
          dir.innerHTML = content_origin.innerHTML;
        } else {
          dir.innerHTML = "本页面暂无目录";
        }
      }, 2000);
    });
    page_mutationObserver.observe(notion_frame, page_watch_options);
  }

  setTimeout(() => {
    // 初始化
    init();
    // 监听目录dom的变化，一旦发生变化，则刷新侧边栏的dom
    watch();
  }, 2000);
})();
