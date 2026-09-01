// footer.js - 插入共用 footer 到 #site-footer-placeholder
(function(){
  function insertFooter(){
    var placeholder = document.getElementById('site-footer-placeholder');
    if(!placeholder) return;
    var html = `
<footer class="site-footer">
  <div class="container">
    <div class="footer-col">
      <h4>聯絡資訊</h4>
      <p>金和福泰有限公司</p>
      <p>103 台北市大同區長安西路289號2樓</p>
      <p>客服電話：886-2-66346768</p>
      <p>客服信箱：ec-jhft109@outlook.com</p>
    </div>
    <div class="footer-fb">
      <a href="https://www.facebook.com/sdlabssdcleaner/" target="_blank" rel="noopener" aria-label="SD LABS Facebook">
        <img src="images/fb-icon.svg" alt="Facebook" width="44" height="44">
      </a>
    </div>
  </div>
  <div class="copyright">© 2026 金和福泰有限公司 版權所有</div>
</footer>
`;
    placeholder.innerHTML = html;
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', insertFooter);
  } else {
    insertFooter();
  }
})();
