!function (e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t(require("react")) : "function" == typeof define && define.amd ? define(["react"], t) : "object" == typeof exports ? exports.SpotifyLogin = t(require("react")) : e.SpotifyLogin = t(e.react)
}(this, function (e) {
    return function (e) {
        function t(r) {
            if (n[r]) return n[r].exports;
            var o = n[r] = {i: r, l: !1, exports: {}};
            return e[r].call(o.exports, o, o.exports, t), o.l = !0, o.exports
        }

        var n = {};
        return t.m = e, t.c = n, t.d = function (e, n, r) {
            t.o(e, n) || Object.defineProperty(e, n, {configurable: !1, enumerable: !0, get: r})
        }, t.n = function (e) {
            var n = e && e.__esModule ? function () {
                return e.default
            } : function () {
                return e
            };
            return t.d(n, "a", n), n
        }, t.o = function (e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }, t.p = "", t(t.s = 1)
    }([function (e, t, n) {
        "use strict";

        function r(e) {
            return e.replace(/^\??\//, "").split("&").reduce(function (e, t) {
                var n = t.split("="), r = i(n, 2), o = r[0], u = r[1];
                return e[o] = u, e
            }, {})
        }

        function o(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "&", n = Object.keys(e);
            return n.reduce(function (r, o, i) {
                var u = "" + r + o + "=" + e[o];
                return i < n.length - 1 && (u += t), u
            }, "")
        }

        Object.defineProperty(t, "__esModule", {value: !0});
        var i = function () {
            function e(e, t) {
                var n = [], r = !0, o = !1, i = void 0;
                try {
                    for (var u, c = e[Symbol.iterator](); !(r = (u = c.next()).done) && (n.push(u.value), !t || n.length !== t); r = !0) ;
                } catch (e) {
                    o = !0, i = e
                } finally {
                    try {
                        !r && c.return && c.return()
                    } finally {
                        if (o) throw i
                    }
                }
                return n
            }

            return function (t, n) {
                if (Array.isArray(t)) return t;
                if (Symbol.iterator in Object(t)) return e(t, n);
                throw new TypeError("Invalid attempt to destructure non-iterable instance")
            }
        }();
        t.toParams = r, t.toQuery = o
    }, function (e, t, n) {
        e.exports = n(2)
    }, function (e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {value: !0});
        var r = n(3), o = function (e) {
            return e && e.__esModule ? e : {default: e}
        }(r);
        t.default = o.default
    }, function (e, t, n) {
        "use strict";

        function r(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function o(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function u(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }

        Object.defineProperty(t, "__esModule", {value: !0});
        var c = function () {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                }
            }

            return function (t, n, r) {
                return n && e(t.prototype, n), r && e(t, r), t
            }
        }(), a = n(4), s = r(a), l = n(5), f = r(l), p = n(8), d = r(p), y = n(0), h = function (e) {
            function t() {
                var e, n, r, u;
                o(this, t);
                for (var c = arguments.length, a = Array(c), s = 0; s < c; s++) a[s] = arguments[s];
                return n = r = i(this, (e = t.__proto__ || Object.getPrototypeOf(t)).call.apply(e, [this].concat(a))), r.onBtnClick = function () {
                    var e = r.props, t = e.clientId, n = e.scope, o = e.redirectUri, i = (0, y.toQuery)({
                            client_id: t, scope: n, redirect_uri: o,
                            response_type: "code"
                        }),
                        u = r.popup = d.default.open("spotify-authorization", "https://accounts.spotify.com/authorize?" + i, {
                            height: 1e3,
                            width: 600
                        });
                    r.onRequest(), u.then(function (e) {
                        return r.onSuccess(e)
                    }, function (e) {
                        return r.onFailure(e)
                    })
                }, r.onRequest = function () {
                    r.props.onRequest()
                }, r.onSuccess = function (e) {
                    if (false) return r.onFailure(new Error("'access_token' not found"));
                    r.props.onSuccess(e)
                }, r.onFailure = function (e) {
                    r.props.onFailure(e)
                }, u = n, i(r, u)
            }

            return u(t, e), c(t, [{
                key: "render", value: function () {
                    var e = this.props, t = e.className, n = e.buttonText, r = e.children,
                        o = {onClick: this.onBtnClick};
                    return t && (o.className = t), s.default.createElement("button", o, r || n)
                }
            }]), t
        }(a.Component);
        h.propTypes = {
            buttonText: f.default.string,
            children: f.default.node,
            className: f.default.string,
            clientId: f.default.string.isRequired,
            onRequest: f.default.func,
            onSuccess: f.default.func,
            onFailure: f.default.func,
            redirectUri: f.default.string.isRequired,
            scope: f.default.string
        }, h.defaultProps = {
            buttonText: "Sign in with Spotify", scope: "user-read-private", onRequest: function () {
            }, onSuccess: function () {
            }, onFailure: function () {
            }
        }, t.default = h
    }, function (t, n) {
        t.exports = e
    }, function (e, t, n) {
        e.exports = n(6)()
    }, function (e, t, n) {
        "use strict";

        function r() {
        }

        var o = n(7);
        e.exports = function () {
            function e(e, t, n, r, i, u) {
                if (u !== o) {
                    var c = new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");
                    throw c.name = "Invariant Violation", c
                }
            }

            function t() {
                return e
            }

            e.isRequired = e;
            var n = {
                array: e,
                bool: e,
                func: e,
                number: e,
                object: e,
                string: e,
                symbol: e,
                any: e,
                arrayOf: t,
                element: e,
                instanceOf: t,
                node: e,
                objectOf: t,
                oneOf: t,
                oneOfType: t,
                shape: t,
                exact: t
            };
            return n.checkPropTypes = r, n.PropTypes = n, n
        }
    }, function (e, t, n) {
        "use strict";
        e.exports = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"
    }, function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        Object.defineProperty(t, "__esModule", {value: !0});
        var o = function () {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                }
            }

            return function (t, n, r) {
                return n && e(t.prototype, n), r && e(t, r), t
            }
        }(), i = n(0), u = function () {
            function e(t, n) {
                var o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
                r(this, e), this.id = t, this.url = n, this.options = o
            }

            return o(e, [{
                key: "open", value: function () {
                    var e = this.url, t = this.id, n = this.options;
                    this.window = window.open(e, t, (0, i.toQuery)(n, ","))
                }
            }, {
                key: "close", value: function () {
                    this.cancel(), this.window.close()
                }
            }, {
                key: "poll", value: function () {
                    var e = this;
                    this.promise = new Promise(function (t, n) {
                        e._iid = window.setInterval(function () {
                            try {
                                var r = e.window;
                                if (!r || !1 !== r.closed) return e.close(), void n(new Error("The popup was closed"));
                                if (r.location.href === e.url || "blank" === r.location.pathname) return;

                                var url = r.location.href;

                                var split = url.split("?");

                                t(split[1]), e.close()
                            } catch (e) {
                            }
                        }, 500)
                    })
                }
            }, {
                key: "cancel", value: function () {
                    this._iid && (window.clearInterval(this._iid), this._iid = null)
                }
            }, {
                key: "then", value: function () {
                    var e;
                    return (e = this.promise).then.apply(e, arguments)
                }
            }, {
                key: "catch", value: function () {
                    var e;
                    return (e = this.promise).then.apply(e, arguments)
                }
            }], [{
                key: "open", value: function () {
                    for (var e = arguments.length, t = Array(e), n = 0; n < e; n++) t[n] = arguments[n];
                    var r = new (Function.prototype.bind.apply(this, [null].concat(t)));
                    return r.open(), r.poll(), r
                }
            }]), e
        }();
        t.default = u
    }])
});
//# sourceMappingURL=SpotifyLogin.js.map