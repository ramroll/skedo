define(['react'], function (React) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

  function styleInject(css, ref) {
    if (ref === void 0) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') {
      return;
    }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z = ".swiper_scroller__1q5nr {\r\n  width: 400px;\r\n  height: 250px;\r\n  overflow: hidden;\r\n}\r\n\r\n.swiper_scroller__1q5nr .swiper_inner__1JOBj::-webkit-scrollbar {\r\n  display: none;\r\n}\r\n\r\n.swiper_scroller__1q5nr .swiper_inner__1JOBj {\r\n  overflow: scroll;\r\n  transition: transform 0.3s ease;\r\n}\r\n.swiper_scroller__1q5nr .swiper_inner__1JOBj img {\r\n  display: block;\r\n  height: 250px;\r\n  float: left;\r\n}";
  styleInject(css_248z);

  /**
   * 提供基于时间间隔重复调用callback的hooks
   * @param {*} callback
   * @param {*} interval
   */

  function useInterval(callback, interval) {
    React.useEffect(() => {
      const start = new Date().getTime();
      const I = setInterval(() => {
        callback(new Date().getTime() - start);
      }, interval);
      return () => clearInterval(I);
    }, []);
  }
  /**
   * 提供实现slider的底层
   * @param {*} N
   */


  function useSlider(N, speed = 3000) {
    const [slider, setSlider] = React.useState(0);
    useInterval(diff => {
      setSlider(_ => Math.floor(diff / speed) % N);
    }, 300);
    return slider;
  }

  const imgs = ["http://5b0988e595225.cdn.sohucs.com/images/20190724/a801831af3c743a4b97e443121f44f30.jpeg", "https://th.bing.com/th?id=OIP.qsPu-MfQrZdhoLjWf0SDKwHaEo&pid=Api&rs=1", "https://th.bing.com/th?id=OIP.R_mn8O9thXZN4aXRk5XKJgHaEo&pid=Api&rs=1"];
  var Swiper = (() => {
    const slider = useSlider(imgs.length);
    return /*#__PURE__*/React__default['default'].createElement("div", {
      className: "scroller"
    }, /*#__PURE__*/React__default['default'].createElement("div", {
      className: "inner",
      style: {
        width: `${imgs.length * 100}%`,
        transform: `translateX(-${100 * slider / imgs.length}%)`
      }
    }, imgs.map(src => {
      return /*#__PURE__*/React__default['default'].createElement("img", {
        style: {
          width: `${100 / imgs.length}%`
        },
        key: src,
        alt: "",
        src: src
      });
    })));
  });

  return Swiper;

});
