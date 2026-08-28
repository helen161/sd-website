// header 插入由 js/title.js 負責 (render header HTML into #site-header-placeholder)
// title.js 會在 DOMContentLoaded 時插入 header 並 dispatch 'headerLoaded'
// initUI 會在收到 headerLoaded 或 DOMContentLoaded 時執行

// 初始化所有互動元件（可安全呼叫多次，但只會執行一次）
function initUI(){
  if(window.__sd_init_done) return; // already initialized
  window.__sd_init_done = true;

  // 手機選單切換
  var toggle = document.getElementById('mobile-toggle');
  var nav = document.getElementById('main-nav');
  if(toggle && nav){
    toggle.addEventListener('click', function(){
      nav.classList.toggle('open');
    });
  }

  // Hero 輪播：支援自動與手動切換、點點與滑動
  (function(){
    var slider = document.getElementById('hero-slider');
    if(!slider) return;
    var slides = slider.querySelectorAll('.slide');
    var dotsContainer = document.getElementById('slider-dots');
    var prevBtn = slider.querySelector('.slider-prev');
    var nextBtn = slider.querySelector('.slider-next');
    var idx = 0;
    var timer = null;
    var autoDelay = 4000;

    function show(i){
      slides.forEach(function(s, n){
        s.classList.toggle('active', n === i);
      });
      // 更新點點
      if(dotsContainer){
        var dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach(function(d, n){ d.classList.toggle('active', n === i); });
      }
      idx = i;
    }

    function next(){ show((idx + 1) % slides.length); }
    function prev(){ show((idx - 1 + slides.length) % slides.length); }

    // 建立點點導航
    if(dotsContainer){
      slides.forEach(function(_, n){
        var d = document.createElement('button');
        d.className = 'dot' + (n===0? ' active':'');
        d.setAttribute('aria-label', '切換到第 ' + (n+1) + ' 張');
        d.addEventListener('click', function(){ show(n); pauseAuto(); });
        dotsContainer.appendChild(d);
      });
    }

    if(prevBtn) prevBtn.addEventListener('click', function(e){ e.preventDefault(); prev(); pauseAuto(); });
    if(nextBtn) nextBtn.addEventListener('click', function(e){ e.preventDefault(); next(); pauseAuto(); });

    // 自動播放
    function startAuto(){ if(timer) clearInterval(timer); timer = setInterval(next, autoDelay); }
    function pauseAuto(){ if(timer) clearInterval(timer); timer = null; }

    // 偵測滑鼠進入暫停自動播放
    slider.addEventListener('mouseenter', pauseAuto);
    slider.addEventListener('mouseleave', function(){ startAuto(); });

    // 支援左右鍵
    document.addEventListener('keydown', function(e){ if(e.key === 'ArrowLeft') prev(); if(e.key === 'ArrowRight') next(); });

    // 支援觸控滑動
    var touchStartX = 0;
    slider.addEventListener('touchstart', function(e){ touchStartX = e.changedTouches[0].clientX; }, {passive:true});
    slider.addEventListener('touchend', function(e){
      var dx = e.changedTouches[0].clientX - touchStartX;
      if(Math.abs(dx) > 40){ if(dx < 0) next(); else prev(); pauseAuto(); }
    });

    // 初始化
    show(0);
    startAuto();
  })();

  // 聯絡表單（範例：在 client 端顯示成功訊息）
  var form = document.getElementById('contact-form');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var status = document.getElementById('form-status');
      status.textContent = '已送出，感謝您的聯絡，我們會儘快回覆。';
      form.reset();
    });
  }

  // 行動 / 觸控裝置：為每個有子選單的項目加入顯示按鈕（手風琴式）
  (function(){
    // 不再根據裝置區分，主選單皆以點擊開合下拉
    var isTouchDevice = function(){ return true; };

    function ensureSubmenuToggles(){
      var parents = document.querySelectorAll('.has-dropdown');
      parents.forEach(function(p){
        if(p.querySelector('.submenu-toggle')) return; // 已建立
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'submenu-toggle';
        btn.setAttribute('aria-expanded', 'false');
        btn.addEventListener('click', function(e){
          e.stopPropagation();
          p.classList.toggle('open');
          var expanded = p.classList.contains('open');
          btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
          // close others
          if(expanded){
            document.querySelectorAll('.has-dropdown.open').forEach(function(other){ if(other!==p) other.classList.remove('open'); });
          }
        });
        // append after the anchor
        var a = p.querySelector('a');
        if(a && a.parentNode){
          a.parentNode.insertBefore(btn, a.nextSibling);
        }
      });
    }

    // intercept anchor clicks on touch devices: first click opens submenu, second click follows link
    // 改為所有裝置皆以點擊切換下拉（第一次點擊開啟，第二次若為有效連結則導向）
    // 父項點擊行為：第一次點擊開啟，第二次點擊收回（不直接導向），子選單內的連結仍能導向
    document.addEventListener('click', function(e){
      var a = e.target.closest('.has-dropdown > a');
      if(!a) return;

      var parent = a.parentElement;
      // 永遠 preventDefault，讓父項成為開關（避免父連結直接導向）
      e.preventDefault();
      var btn = parent.querySelector('.submenu-toggle');
      if(!parent.classList.contains('open')){
        parent.classList.add('open');
        if(btn) btn.setAttribute('aria-expanded','true');
        // 關閉其他已開啟的下拉
        document.querySelectorAll('.has-dropdown.open').forEach(function(other){ if(other!==parent) other.classList.remove('open'); });
      } else {
        parent.classList.remove('open');
        if(btn) btn.setAttribute('aria-expanded','false');
      }
    });

    // close submenus when clicking outside
    document.addEventListener('click', function(e){
      if(!e.target.closest('.main-nav')){
        document.querySelectorAll('.has-dropdown.open').forEach(function(d){ d.classList.remove('open'); });
      }
    });

    // initialize toggles and on resize
    ensureSubmenuToggles();
    window.addEventListener('resize', function(){ ensureSubmenuToggles(); });
  })();
}

// 初始化時機：若 DOMContentLoaded 尚未發生，等候其發生；若 header 是動態載入，等待 headerLoaded
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initUI);
} else {
  initUI();
}
window.addEventListener('headerLoaded', function(){
  // headerLoaded 可能在 DOMContentLoaded 之後或之前發生，確保初始化已呼叫
  initUI();
});
