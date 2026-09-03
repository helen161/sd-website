// title.js - 將公司名稱與選單直接插入到 site-header-placeholder
(function(){
  function insertHeaderHtml(html){
    var placeholder = document.getElementById('site-header-placeholder');
    if(!placeholder) return;
    placeholder.innerHTML = html;
    window.__sd_header_loaded = true;
    var ev = new CustomEvent('headerLoaded');
    window.dispatchEvent(ev);
    // 若 initUI 已存在則呼叫一次以初始化互動
    if(typeof window.initUI === 'function'){
      try{ window.initUI(); }catch(e){ console.warn(e); }
    }
  }

  const headerHtml = `
<header class="site-header">
  <div class="topbar">
    <div class="container">
      <div class="contact-info">&nbsp;</div>
      <div class="regions">&nbsp;</div>
    </div>
  </div>
  <div class="navbar container">
    <div class="brand" style="margin-left:2%">
      <a href="index.html" aria-label="回首頁"><p>金和福泰有限公司</p></a>
    </div>
    <button id="mobile-toggle" aria-label="切換選單">☰</button>
    <nav class="main-nav" id="main-nav">
      <ul>
        <li class="has-dropdown">
          <a href="product.html">愛思帝長效清潔劑</a>
          <ul class="dropdown">
            <li><a href="product.html">產品介紹</a></li>
            <li><a href="https://www.youtube.com/@user-jhft109" target="_blank">相關影片</a></li>
            <li><a href="faq.html">產品FAQ</a></li>
          </ul>
        </li>
        <li class="has-dropdown">
          <a href="hot.html">新聞中心</a>
          <ul class="dropdown">
            <li><a href="news-press.html">常用消毒殺菌產品介紹</a></li>
            <li><a href="news-press.html#news-letter">SD產品各國實驗報告及推薦函</a></li>
            <li><a href="news-press.html#news-case">SD產品各國使用案例</a></li>
          </ul>
        </li>
        <li><a href="index.html#buy">購買方式</a></li>
        <li><a href="contact.html">聯絡我們</a></li>
      </ul>
    </nav>
  </div>
</header>
`;

  function onReady(){
    insertHeaderHtml(headerHtml);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
