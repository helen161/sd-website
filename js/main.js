// header 插入由 js/title.js 負責
// title.js 會在 DOMContentLoaded 時插入 header 並 dispatch 'headerLoaded'

// ==================================================
// 聯絡表單：Formspree
// ==================================================
function initContactForm() {
  var form = document.getElementById('contact-form');

  // 找不到表單就直接結束
  if (!form) {
    return;
  }

  // 避免重複綁定
  if (form.dataset.formInitialized === 'true') {
    return;
  }

  form.dataset.formInitialized = 'true';

  form.addEventListener('submit', async function(e) {
    // 阻止瀏覽器跳轉到 Formspree
    e.preventDefault();

    var status = document.getElementById('form-status');
    var submitBtn = form.querySelector('button[type="submit"]');

    // 顯示送出中
    if (status) {
      status.textContent = '資料送出中，請稍候…';
      status.className = 'form-status sending';
    }

    // 暫時停用送出按鈕
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '送出中…';
    }

    try {
      var response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {

        // 送出成功
        if (status) {
          status.textContent = '✓ 感謝您的聯絡，我們會儘快回覆您。';
          status.className = 'form-status success';
        }

        // 清空表單
        form.reset();

      } else {

        // Formspree 回傳錯誤
        var data = await response.json().catch(function() {
          return {};
        });

        var message = '送出失敗，請稍後再試。';

        if (data && data.errors && data.errors.length > 0) {
          message = data.errors
            .map(function(error) {
              return error.message;
            })
            .join(' ');
        }

        if (status) {
          status.textContent = '✕ ' + message;
          status.className = 'form-status error';
        }
      }

    } catch (error) {

      console.error('表單送出錯誤：', error);

      if (status) {
        status.textContent = '✕ 網路連線發生問題，請稍後再試。';
        status.className = 'form-status error';
      }

    } finally {

      // 恢復送出按鈕
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '送出';
      }
    }
  });
}


// ==================================================
// 初始化所有互動元件
// ==================================================
function initUI() {

  // 避免重複初始化
  if (window.__sd_init_done) {
    return;
  }

  window.__sd_init_done = true;


  // ==================================================
  // 手機選單切換
  // ==================================================
  var toggle = document.getElementById('mobile-toggle');
  var nav = document.getElementById('main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function() {
      nav.classList.toggle('open');
    });
  }


  // ==================================================
  // Hero 輪播
  // ==================================================
  (function() {

    var slider = document.getElementById('hero-slider');

    if (!slider) {
      return;
    }

    var slides = slider.querySelectorAll('.slide');
    var dotsContainer = document.getElementById('slider-dots');
    var prevBtn = slider.querySelector('.slider-prev');
    var nextBtn = slider.querySelector('.slider-next');

    var idx = 0;
    var timer = null;
    var autoDelay = 4000;


    function show(i) {

      slides.forEach(function(s, n) {
        s.classList.toggle('active', n === i);
      });

      if (dotsContainer) {

        var dots = dotsContainer.querySelectorAll('.dot');

        dots.forEach(function(d, n) {
          d.classList.toggle('active', n === i);
        });
      }

      idx = i;
    }


    function next() {
      show((idx + 1) % slides.length);
    }


    function prev() {
      show((idx - 1 + slides.length) % slides.length);
    }


    // 建立點點導航
    if (dotsContainer) {

      slides.forEach(function(_, n) {

        var d = document.createElement('button');

        d.className = 'dot' + (n === 0 ? ' active' : '');

        d.setAttribute(
          'aria-label',
          '切換到第 ' + (n + 1) + ' 張'
        );

        d.addEventListener('click', function() {
          show(n);
          pauseAuto();
        });

        dotsContainer.appendChild(d);
      });
    }


    // 左右按鈕
    if (prevBtn) {
      prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        prev();
        pauseAuto();
      });
    }


    if (nextBtn) {
      nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        next();
        pauseAuto();
      });
    }


    // 自動播放
    function startAuto() {

      if (timer) {
        clearInterval(timer);
      }

      timer = setInterval(next, autoDelay);
    }


    function pauseAuto() {

      if (timer) {
        clearInterval(timer);
      }

      timer = null;
    }


    // 滑鼠進入暫停
    slider.addEventListener('mouseenter', pauseAuto);

    slider.addEventListener('mouseleave', function() {
      startAuto();
    });


    // 鍵盤左右鍵
    document.addEventListener('keydown', function(e) {

      if (e.key === 'ArrowLeft') {
        prev();
      }

      if (e.key === 'ArrowRight') {
        next();
      }
    });


    // 觸控滑動
    var touchStartX = 0;

    slider.addEventListener(
      'touchstart',
      function(e) {
        touchStartX = e.changedTouches[0].clientX;
      },
      { passive: true }
    );


    slider.addEventListener(
      'touchend',
      function(e) {

        var dx =
          e.changedTouches[0].clientX - touchStartX;

        if (Math.abs(dx) > 40) {

          if (dx < 0) {
            next();
          } else {
            prev();
          }

          pauseAuto();
        }
      }
    );


    // 初始化輪播
    show(0);
    startAuto();

  })();


  // ==================================================
  // 主選單下拉
  // ==================================================
  (function() {

    function ensureSubmenuToggles() {

      var parents =
        document.querySelectorAll('.has-dropdown');

      parents.forEach(function(p) {

        if (p.querySelector('.submenu-toggle')) {
          return;
        }

        var btn =
          document.createElement('button');

        btn.type = 'button';

        btn.className = 'submenu-toggle';

        btn.setAttribute(
          'aria-expanded',
          'false'
        );


        btn.addEventListener('click', function(e) {

          e.stopPropagation();

          p.classList.toggle('open');

          var expanded =
            p.classList.contains('open');

          btn.setAttribute(
            'aria-expanded',
            expanded ? 'true' : 'false'
          );


          // 關閉其他下拉選單
          if (expanded) {

            document
              .querySelectorAll('.has-dropdown.open')
              .forEach(function(other) {

                if (other !== p) {
                  other.classList.remove('open');
                }

              });
          }

        });


        // 插入按鈕
        var a = p.querySelector('a');

        if (a && a.parentNode) {

          a.parentNode.insertBefore(
            btn,
            a.nextSibling
          );
        }

      });
    }


    // 父選單點擊
    document.addEventListener('click', function(e) {

      var a =
        e.target.closest('.has-dropdown > a');

      if (!a) {
        return;
      }

      var parent = a.parentElement;

      // 父項只負責開關下拉
      e.preventDefault();

      var btn =
        parent.querySelector('.submenu-toggle');


      if (!parent.classList.contains('open')) {

        parent.classList.add('open');

        if (btn) {
          btn.setAttribute(
            'aria-expanded',
            'true'
          );
        }


        // 關閉其他下拉
        document
          .querySelectorAll('.has-dropdown.open')
          .forEach(function(other) {

            if (other !== parent) {
              other.classList.remove('open');
            }

          });

      } else {

        parent.classList.remove('open');

        if (btn) {
          btn.setAttribute(
            'aria-expanded',
            'false'
          );
        }
      }

    });


    // 點擊外部關閉
    document.addEventListener('click', function(e) {

      if (!e.target.closest('.main-nav')) {

        document
          .querySelectorAll('.has-dropdown.open')
          .forEach(function(d) {
            d.classList.remove('open');
          });

      }

    });


    // 初始化
    ensureSubmenuToggles();


    // 視窗尺寸改變
    window.addEventListener(
      'resize',
      function() {
        ensureSubmenuToggles();
      }
    );

  })();

}


// ==================================================
// 頁面載入時初始化
// ==================================================
function initializePage() {

  initUI();

  initContactForm();

}


// DOM 載入
if (document.readyState === 'loading') {

  document.addEventListener(
    'DOMContentLoaded',
    initializePage
  );

} else {

  initializePage();

}


// ==================================================
// header 動態載入完成
// ==================================================
window.addEventListener(
  'headerLoaded',
  function() {

    // initUI 本身會避免重複初始化
    initUI();

    // 聯絡表單也再次確認
    initContactForm();

  }
);
