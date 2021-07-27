define(['react', 'ramda'], function (React, R) { 'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

	function _interopNamespace(e) {
		if (e && e.__esModule) return e;
		var n = Object.create(null);
		if (e) {
			Object.keys(e).forEach(function (k) {
				if (k !== 'default') {
					var d = Object.getOwnPropertyDescriptor(e, k);
					Object.defineProperty(n, k, d.get ? d : {
						enumerable: true,
						get: function () {
							return e[k];
						}
					});
				}
			});
		}
		n['default'] = e;
		return Object.freeze(n);
	}

	var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
	var R__namespace = /*#__PURE__*/_interopNamespace(R);

	class B {
	  name() {
	    return R__namespace.always(true);
	  }

	}

	var main = (() => {
	  const b = new B();
	  return /*#__PURE__*/React__default['default'].createElement("div", null, "Hello world! ", b.toString());
	});

	return main;

});
