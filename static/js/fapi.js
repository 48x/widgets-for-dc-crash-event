function API_initialized() {
    FAPI.initialized = true;
    window.fapi_success(FAPI.mode);
}
var FAPI = {
    initialized: false,
    mode: "",
    init: function(f, j, b) {
        var g = f || {};
        var k = j;
        var c = b;
        var i = f == null || FAPI.Util.isString(f);
        if (i) {
            g = {};
            k = arguments[2];
            c = arguments[3];
        }
        window.fapi_success = FAPI.Util.isFunc(k) ? k : function() {};
        window.fapi_failure = FAPI.Util.isFunc(c) ? c : function() {};
        var e = FAPI.Util.getRequestParameters(g.location_search || window.location.search);
        var a = FAPI.Util.getRequestParameters(g.location_hash || window.location.hash);
        var d = e.api_server || (i ? arguments[0] : null);
        var h = e.apiconnection || (i ? arguments[1] : null);
        FAPI.Client.initialize(e, a, g);
        if (d) {
            this.mode = h ? "W" : "M";
            if (this.mode == "W") {
                if (!FAPI.Util.isFunc(window.postMessage)) {
                    this.mode = "F";
                    this.invokeUIMethod = FAPI.FLASH.invokeUIMethod;
                    FAPI.FLASH.init(d, h, e);
                } else {
                    this.invokeUIMethod = FAPI.HTML5.invokeUIMethod;
                    FAPI.HTML5.init(d, h, e);
                }
            } else {
                FAPI.MOBILE.init();
            }
        } else {
            if (!g.app_id || !g.app_key) {
                window.fapi_failure("FAPI was unable to detect launch platform. URL parameters and app_id/app_key not detected.");
                return;
            }
            this.mode = "O";
            FAPI.OAUTH.init(g, e, a);
        }
    },
    invokeUIMethod: function() {
        API_callback(arguments[0], "error", {
            error_code: -1,
            error_message: "UI methods are available only for apps running on OK portal"
        });
    },
    HTML5: {
        webServerUrl: "",
        serverUrl: "",
        apiConnectionName: "",
        attachRetryCounter: 0,
        init: function(a, b, c) {
            this.serverUrl = a;
            this.apiConnectionName = b;
            this.attachRetryCounter = 0;
            if (!FAPI.initialized) {
                this.webServerUrl = c.web_server;
                if (this.webServerUrl.indexOf("://") == -1) {
                    this.webServerUrl = "http://" + this.webServerUrl;
                }
                if (FAPI.Util.isFunc(window.addEventListener)) {
                    window.addEventListener("message", this.onPostMessage, false);
                } else {
                    window.attachEvent("onmessage", this.onPostMessage);
                }
                this.doAttach();
            }
        },
        doAttach: function() {
            if (!FAPI.initialized) {
                if (FAPI.HTML5.attachRetryCounter++ < 20) {
                    FAPI.HTML5.invokeUIMethod("attach");
                    setTimeout(FAPI.HTML5.doAttach, 500);
                } else {
                    window.fapi_failure("Failed to init.");
                }
            }
        },
        onPostMessage: function(c) {
            if (FAPI.HTML5.webServerUrl != c.origin) {
                return;
            }
            var b = c.data.split("$");
            if (b.length != 3) {
                return;
            }
            var a = decodeURIComponent(b[0]);
            if (a == "attach") {
                API_initialized();
            } else {
                API_callback(a, decodeURIComponent(b[1]), decodeURIComponent(b[2]));
            }
        },
        invokeUIMethod: function() {
            var c = "";
            for (var b = 0; b < arguments.length; b++) {
                var a = arguments[b];
                if (b > 0) {
                    c += "$";
                }
                if (a != null) {
                    c += encodeURIComponent(String(a));
                }
            }
            parent.postMessage("__FAPI__" + c, FAPI.HTML5.webServerUrl);
        }
    },
    FLASH: {
        flash: null,
        swfCallback: function(a) {
            if (a.success) {
                FAPI.FLASH.flash = document.getElementById("FAPI_Flash");
            } else {
                window.fapi_failure("Failed  to embed flash");
            }
        },
        embedFlash: function() {
            var c = document.createElement("span");
            c.id = "FAPI_Flash_wrap";
            c.style.position = "absolute";
            c.style.marginTop = "-10px";
            document.body.appendChild(c);
            var e = {
                apiconnection: this.apiConnectionName
            };
            var b = {
                menu: "false",
                scale: "noScale",
                allowScriptAccess: "always",
                bgcolor: "#FFFFFF"
            };
            var d = {
                id: "FAPI_Flash"
            };
            var a = function() {
                var aq = "undefined",
                    aD = "object",
                    ab = "Shockwave Flash",
                    X = "ShockwaveFlash.ShockwaveFlash",
                    aE = "application/x-shockwave-flash",
                    ac = "SWFObjectExprInst",
                    ax = "onreadystatechange",
                    af = window,
                    aL = document,
                    aB = navigator,
                    aa = false,
                    Z = [aN],
                    aG = [],
                    ag = [],
                    al = [],
                    aJ, ad, ap, at, ak = false,
                    aU = false,
                    aH, an, aI = true,
                    ah = function() {
                        var f = typeof aL.getElementById != aq && typeof aL.getElementsByTagName != aq && typeof aL.createElement != aq,
                            j = aB.userAgent.toLowerCase(),
                            h = aB.platform.toLowerCase(),
                            m = h ? /win/.test(h) : /win/.test(j),
                            o = h ? /mac/.test(h) : /mac/.test(j),
                            l = /webkit/.test(j) ? parseFloat(j.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false,
                            i = !+"\v1",
                            k = [0, 0, 0],
                            p = null;
                        if (typeof aB.plugins != aq && typeof aB.plugins[ab] == aD) {
                            p = aB.plugins[ab].description;
                            if (p && !(typeof aB.mimeTypes != aq && aB.mimeTypes[aE] && !aB.mimeTypes[aE].enabledPlugin)) {
                                aa = true;
                                i = false;
                                p = p.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
                                k[0] = parseInt(p.replace(/^(.*)\..*$/, "$1"), 10);
                                k[1] = parseInt(p.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
                                k[2] = /[a-zA-Z]/.test(p) ? parseInt(p.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0;
                            }
                        } else {
                            if (typeof af.ActiveXObject != aq) {
                                try {
                                    var n = new ActiveXObject(X);
                                    if (n) {
                                        p = n.GetVariable("$version");
                                        if (p) {
                                            i = true;
                                            p = p.split(" ")[1].split(",");
                                            k = [parseInt(p[0], 10), parseInt(p[1], 10), parseInt(p[2], 10)];
                                        }
                                    }
                                } catch (g) {}
                            }
                        }
                        return {
                            w3: f,
                            pv: k,
                            wk: l,
                            ie: i,
                            win: m,
                            mac: o
                        };
                    }(),
                    aK = function() {
                        if (!ah.w3) {
                            return;
                        }
                        if ((typeof aL.readyState != aq && aL.readyState == "complete") || (typeof aL.readyState == aq && (aL.getElementsByTagName("body")[0] || aL.body))) {
                            aP();
                        }
                        if (!ak) {
                            if (typeof aL.addEventListener != aq) {
                                aL.addEventListener("DOMContentLoaded", aP, false);
                            }
                            if (ah.ie && ah.win) {
                                aL.attachEvent(ax, function() {
                                    if (aL.readyState == "complete") {
                                        aL.detachEvent(ax, arguments.callee);
                                        aP();
                                    }
                                });
                                if (af == top) {
                                    (function() {
                                        if (ak) {
                                            return;
                                        }
                                        try {
                                            aL.documentElement.doScroll("left");
                                        } catch (f) {
                                            setTimeout(arguments.callee, 0);
                                            return;
                                        }
                                        aP();
                                    })();
                                }
                            }
                            if (ah.wk) {
                                (function() {
                                    if (ak) {
                                        return;
                                    }
                                    if (!/loaded|complete/.test(aL.readyState)) {
                                        setTimeout(arguments.callee, 0);
                                        return;
                                    }
                                    aP();
                                })();
                            }
                            aC(aP);
                        }
                    }();

                function aP() {
                    if (ak) {
                        return;
                    }
                    try {
                        var g = aL.getElementsByTagName("body")[0].appendChild(ar("span"));
                        g.parentNode.removeChild(g);
                    } catch (f) {
                        return;
                    }
                    ak = true;
                    var i = Z.length;
                    for (var h = 0; h < i; h++) {
                        Z[h]();
                    }
                }

                function aj(f) {
                    if (ak) {
                        f();
                    } else {
                        Z[Z.length] = f;
                    }
                }

                function aC(f) {
                    if (typeof af.addEventListener != aq) {
                        af.addEventListener("load", f, false);
                    } else {
                        if (typeof aL.addEventListener != aq) {
                            aL.addEventListener("load", f, false);
                        } else {
                            if (typeof af.attachEvent != aq) {
                                aM(af, "onload", f);
                            } else {
                                if (typeof af.onload == "function") {
                                    var g = af.onload;
                                    af.onload = function() {
                                        g();
                                        f();
                                    };
                                } else {
                                    af.onload = f;
                                }
                            }
                        }
                    }
                }

                function aN() {
                    if (aa) {
                        Y();
                    } else {
                        am();
                    }
                }

                function Y() {
                    var i = aL.getElementsByTagName("body")[0];
                    var g = ar(aD);
                    g.setAttribute("type", aE);
                    var f = i.appendChild(g);
                    if (f) {
                        var h = 0;
                        (function() {
                            if (typeof f.GetVariable != aq) {
                                var j = f.GetVariable("$version");
                                if (j) {
                                    j = j.split(" ")[1].split(",");
                                    ah.pv = [parseInt(j[0], 10), parseInt(j[1], 10), parseInt(j[2], 10)];
                                }
                            } else {
                                if (h < 10) {
                                    h++;
                                    setTimeout(arguments.callee, 10);
                                    return;
                                }
                            }
                            i.removeChild(g);
                            f = null;
                            am();
                        })();
                    } else {
                        am();
                    }
                }

                function am() {
                    var l = aG.length;
                    if (l > 0) {
                        for (var m = 0; m < l; m++) {
                            var h = aG[m].id;
                            var q = aG[m].callbackFn;
                            var f = {
                                success: false,
                                id: h
                            };
                            if (ah.pv[0] > 0) {
                                var n = aS(h);
                                if (n) {
                                    if (ao(aG[m].swfVersion) && !(ah.wk && ah.wk < 312)) {
                                        ay(h, true);
                                        if (q) {
                                            f.success = true;
                                            f.ref = av(h);
                                            q(f);
                                        }
                                    } else {
                                        if (aG[m].expressInstall && au()) {
                                            var j = {};
                                            j.data = aG[m].expressInstall;
                                            j.width = n.getAttribute("width") || "0";
                                            j.height = n.getAttribute("height") || "0";
                                            if (n.getAttribute("class")) {
                                                j.styleclass = n.getAttribute("class");
                                            }
                                            if (n.getAttribute("align")) {
                                                j.align = n.getAttribute("align");
                                            }
                                            var k = {};
                                            var i = n.getElementsByTagName("param");
                                            var p = i.length;
                                            for (var o = 0; o < p; o++) {
                                                if (i[o].getAttribute("name").toLowerCase() != "movie") {
                                                    k[i[o].getAttribute("name")] = i[o].getAttribute("value");
                                                }
                                            }
                                            ae(j, k, h, q);
                                        } else {
                                            aF(n);
                                            if (q) {
                                                q(f);
                                            }
                                        }
                                    }
                                }
                            } else {
                                ay(h, true);
                                if (q) {
                                    var g = av(h);
                                    if (g && typeof g.SetVariable != aq) {
                                        f.success = true;
                                        f.ref = g;
                                    }
                                    q(f);
                                }
                            }
                        }
                    }
                }

                function av(g) {
                    var i = null;
                    var h = aS(g);
                    if (h && h.nodeName == "OBJECT") {
                        if (typeof h.SetVariable != aq) {
                            i = h;
                        } else {
                            var f = h.getElementsByTagName(aD)[0];
                            if (f) {
                                i = f;
                            }
                        }
                    }
                    return i;
                }

                function au() {
                    return !aU && ao("6.0.65") && (ah.win || ah.mac) && !(ah.wk && ah.wk < 312);
                }

                function ae(k, i, m, j) {
                    aU = true;
                    ap = j || null;
                    at = {
                        success: false,
                        id: m
                    };
                    var f = aS(m);
                    if (f) {
                        if (f.nodeName == "OBJECT") {
                            aJ = aO(f);
                            ad = null;
                        } else {
                            aJ = f;
                            ad = m;
                        }
                        k.id = ac;
                        if (typeof k.width == aq || (!/%$/.test(k.width) && parseInt(k.width, 10) < 310)) {
                            k.width = "310";
                        }
                        if (typeof k.height == aq || (!/%$/.test(k.height) && parseInt(k.height, 10) < 137)) {
                            k.height = "137";
                        }
                        aL.title = aL.title.slice(0, 47) + " - Flash Player Installation";
                        var g = ah.ie && ah.win ? "ActiveX" : "PlugIn",
                            h = "MMredirectURL=" + af.location.toString().replace(/&/g, "%26") + "&MMplayerType=" + g + "&MMdoctitle=" + aL.title;
                        if (typeof i.flashvars != aq) {
                            i.flashvars += "&" + h;
                        } else {
                            i.flashvars = h;
                        }
                        if (ah.ie && ah.win && f.readyState != 4) {
                            var l = ar("div");
                            m += "SWFObjectNew";
                            l.setAttribute("id", m);
                            f.parentNode.insertBefore(l, f);
                            f.style.display = "none";
                            (function() {
                                if (f.readyState == 4) {
                                    f.parentNode.removeChild(f);
                                } else {
                                    setTimeout(arguments.callee, 10);
                                }
                            })();
                        }
                        aA(k, i, m);
                    }
                }

                function aF(f) {
                    if (ah.ie && ah.win && f.readyState != 4) {
                        var g = ar("div");
                        f.parentNode.insertBefore(g, f);
                        g.parentNode.replaceChild(aO(f), g);
                        f.style.display = "none";
                        (function() {
                            if (f.readyState == 4) {
                                f.parentNode.removeChild(f);
                            } else {
                                setTimeout(arguments.callee, 10);
                            }
                        })();
                    } else {
                        f.parentNode.replaceChild(aO(f), f);
                    }
                }

                function aO(g) {
                    var i = ar("div");
                    if (ah.win && ah.ie) {
                        i.innerHTML = g.innerHTML;
                    } else {
                        var j = g.getElementsByTagName(aD)[0];
                        if (j) {
                            var f = j.childNodes;
                            if (f) {
                                var k = f.length;
                                for (var h = 0; h < k; h++) {
                                    if (!(f[h].nodeType == 1 && f[h].nodeName == "PARAM") && !(f[h].nodeType == 8)) {
                                        i.appendChild(f[h].cloneNode(true));
                                    }
                                }
                            }
                        }
                    }
                    return i;
                }

                function aA(j, l, h) {
                    var i, f = aS(h);
                    if (ah.wk && ah.wk < 312) {
                        return i;
                    }
                    if (f) {
                        if (typeof j.id == aq) {
                            j.id = h;
                        }
                        if (ah.ie && ah.win) {
                            var k = "";
                            for (var n in j) {
                                if (j[n] != Object.prototype[n]) {
                                    if (n.toLowerCase() == "data") {
                                        l.movie = j[n];
                                    } else {
                                        if (n.toLowerCase() == "styleclass") {
                                            k += ' class="' + j[n] + '"';
                                        } else {
                                            if (n.toLowerCase() != "classid") {
                                                k += " " + n + '="' + j[n] + '"';
                                            }
                                        }
                                    }
                                }
                            }
                            var m = "";
                            for (var o in l) {
                                if (l[o] != Object.prototype[o]) {
                                    m += '<param name="' + o + '" value="' + l[o] + '" />';
                                }
                            }
                            f.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + k + ">" + m + "</object>";
                            ag[ag.length] = j.id;
                            i = aS(j.id);
                        } else {
                            var g = ar(aD);
                            g.setAttribute("type", aE);
                            for (var p in j) {
                                if (j[p] != Object.prototype[p]) {
                                    if (p.toLowerCase() == "styleclass") {
                                        g.setAttribute("class", j[p]);
                                    } else {
                                        if (p.toLowerCase() != "classid") {
                                            g.setAttribute(p, j[p]);
                                        }
                                    }
                                }
                            }
                            for (var q in l) {
                                if (l[q] != Object.prototype[q] && q.toLowerCase() != "movie") {
                                    aQ(g, q, l[q]);
                                }
                            }
                            f.parentNode.replaceChild(g, f);
                            i = g;
                        }
                    }
                    return i;
                }

                function aQ(g, i, h) {
                    var f = ar("param");
                    f.setAttribute("name", i);
                    f.setAttribute("value", h);
                    g.appendChild(f);
                }

                function aw(f) {
                    var g = aS(f);
                    if (g && g.nodeName == "OBJECT") {
                        if (ah.ie && ah.win) {
                            g.style.display = "none";
                            (function() {
                                if (g.readyState == 4) {
                                    aT(f);
                                } else {
                                    setTimeout(arguments.callee, 10);
                                }
                            })();
                        } else {
                            g.parentNode.removeChild(g);
                        }
                    }
                }

                function aT(f) {
                    var g = aS(f);
                    if (g) {
                        for (var h in g) {
                            if (typeof g[h] == "function") {
                                g[h] = null;
                            }
                        }
                        g.parentNode.removeChild(g);
                    }
                }

                function aS(f) {
                    var h = null;
                    try {
                        h = aL.getElementById(f);
                    } catch (g) {}
                    return h;
                }

                function ar(f) {
                    return aL.createElement(f);
                }

                function aM(f, h, g) {
                    f.attachEvent(h, g);
                    al[al.length] = [f, h, g];
                }

                function ao(f) {
                    var g = ah.pv,
                        h = f.split(".");
                    h[0] = parseInt(h[0], 10);
                    h[1] = parseInt(h[1], 10) || 0;
                    h[2] = parseInt(h[2], 10) || 0;
                    return (g[0] > h[0] || (g[0] == h[0] && g[1] > h[1]) || (g[0] == h[0] && g[1] == h[1] && g[2] >= h[2])) ? true : false;
                }

                function az(g, k, f, h) {
                    if (ah.ie && ah.mac) {
                        return;
                    }
                    var j = aL.getElementsByTagName("head")[0];
                    if (!j) {
                        return;
                    }
                    var l = (f && typeof f == "string") ? f : "screen";
                    if (h) {
                        aH = null;
                        an = null;
                    }
                    if (!aH || an != l) {
                        var i = ar("style");
                        i.setAttribute("type", "text/css");
                        i.setAttribute("media", l);
                        aH = j.appendChild(i);
                        if (ah.ie && ah.win && typeof aL.styleSheets != aq && aL.styleSheets.length > 0) {
                            aH = aL.styleSheets[aL.styleSheets.length - 1];
                        }
                        an = l;
                    }
                    if (ah.ie && ah.win) {
                        if (aH && typeof aH.addRule == aD) {
                            aH.addRule(g, k);
                        }
                    } else {
                        if (aH && typeof aL.createTextNode != aq) {
                            aH.appendChild(aL.createTextNode(g + " {" + k + "}"));
                        }
                    }
                }

                function ay(f, h) {
                    if (!aI) {
                        return;
                    }
                    var g = h ? "visible" : "hidden";
                    if (ak && aS(f)) {
                        aS(f).style.visibility = g;
                    } else {
                        az("#" + f, "visibility:" + g);
                    }
                }

                function ai(g) {
                    var f = /[\\\"<>\.;]/;
                    var h = f.exec(g) != null;
                    return h && typeof encodeURIComponent != aq ? encodeURIComponent(g) : g;
                }
                var aR = function() {
                    if (ah.ie && ah.win) {
                        window.attachEvent("onunload", function() {
                            var f = al.length;
                            for (var g = 0; g < f; g++) {
                                al[g][0].detachEvent(al[g][1], al[g][2]);
                            }
                            var i = ag.length;
                            for (var h = 0; h < i; h++) {
                                aw(ag[h]);
                            }
                            for (var j in ah) {
                                ah[j] = null;
                            }
                            ah = null;
                            for (var k in a) {
                                a[k] = null;
                            }
                            a = null;
                        });
                    }
                }();
                return {
                    registerObject: function(f, j, h, g) {
                        if (ah.w3 && f && j) {
                            var i = {};
                            i.id = f;
                            i.swfVersion = j;
                            i.expressInstall = h;
                            i.callbackFn = g;
                            aG[aG.length] = i;
                            ay(f, false);
                        } else {
                            if (g) {
                                g({
                                    success: false,
                                    id: f
                                });
                            }
                        }
                    },
                    getObjectById: function(f) {
                        if (ah.w3) {
                            return av(f);
                        }
                    },
                    embedSWF: function(p, j, m, k, h, f, g, n, l, o) {
                        var i = {
                            success: false,
                            id: j
                        };
                        if (ah.w3 && !(ah.wk && ah.wk < 312) && p && j && m && k && h) {
                            ay(j, false);
                            aj(function() {
                                m += "";
                                k += "";
                                var v = {};
                                if (l && typeof l === aD) {
                                    for (var t in l) {
                                        v[t] = l[t];
                                    }
                                }
                                v.data = p;
                                v.width = m;
                                v.height = k;
                                var s = {};
                                if (n && typeof n === aD) {
                                    for (var u in n) {
                                        s[u] = n[u];
                                    }
                                }
                                if (g && typeof g === aD) {
                                    for (var q in g) {
                                        if (typeof s.flashvars != aq) {
                                            s.flashvars += "&" + q + "=" + g[q];
                                        } else {
                                            s.flashvars = q + "=" + g[q];
                                        }
                                    }
                                }
                                if (ao(h)) {
                                    var r = aA(v, s, j);
                                    if (v.id == j) {
                                        ay(j, true);
                                    }
                                    i.success = true;
                                    i.ref = r;
                                } else {
                                    if (f && au()) {
                                        v.data = f;
                                        ae(v, s, j, o);
                                        return;
                                    } else {
                                        ay(j, true);
                                    }
                                }
                                if (o) {
                                    o(i);
                                }
                            });
                        } else {
                            if (o) {
                                o(i);
                            }
                        }
                    },
                    switchOffAutoHideShow: function() {
                        aI = false;
                    },
                    ua: ah,
                    getFlashPlayerVersion: function() {
                        return {
                            major: ah.pv[0],
                            minor: ah.pv[1],
                            release: ah.pv[2]
                        };
                    },
                    hasFlashPlayerVersion: ao,
                    createSWF: function(f, g, h) {
                        if (ah.w3) {
                            return aA(f, g, h);
                        } else {
                            return undefined;
                        }
                    },
                    showExpressInstall: function(g, f, i, h) {
                        if (ah.w3 && au()) {
                            ae(g, f, i, h);
                        }
                    },
                    removeSWF: function(f) {
                        if (ah.w3) {
                            aw(f);
                        }
                    },
                    createCSS: function(g, f, h, i) {
                        if (ah.w3) {
                            az(g, f, h, i);
                        }
                    },
                    addDomLoadEvent: aj,
                    addLoadEvent: aC,
                    getQueryParamValue: function(g) {
                        var f = aL.location.search || aL.location.hash;
                        if (f) {
                            if (/\?/.test(f)) {
                                f = f.split("?")[1];
                            }
                            if (g == null) {
                                return ai(f);
                            }
                            var h = f.split("&");
                            for (var i = 0; i < h.length; i++) {
                                if (h[i].substring(0, h[i].indexOf("=")) == g) {
                                    return ai(h[i].substring((h[i].indexOf("=") + 1)));
                                }
                            }
                        }
                        return "";
                    },
                    expressInstallCallback: function() {
                        if (aU) {
                            var f = aS(ac);
                            if (f && aJ) {
                                f.parentNode.replaceChild(aJ, f);
                                if (ad) {
                                    ay(ad, true);
                                    if (ah.ie && ah.win) {
                                        aJ.style.display = "block";
                                    }
                                }
                                if (ap) {
                                    ap(at);
                                }
                            }
                            aU = false;
                        }
                    }
                };
            }();
            a.embedSWF(this.serverUrl + "flash/ForticomAPIJS.swf?v=19", "FAPI_Flash_wrap", "1", "1", "9.0.0", this.serverUrl + "flash/expressInstall.swf", e, b, d, this.swfCallback);
        },
        init: function(a, b) {
            this.serverUrl = a;
            this.apiConnectionName = b;
            this.flash = document.getElementById("FAPI_Flash");
            if (this.flash == null) {
                this.embedFlash();
            } else {
                API_initialized();
            }
        },
        isFunc: function(a) {
            return Object.prototype.toString.call(a) === "[object Function]";
        },
        getFlash: function() {
            if (!FAPI.initialized) {
                throw "Forticom API was not initialized properly";
            }
            return this.flash;
        },
        invokeUIMethod: function() {
            for (var b = 0; b < arguments.length; b++) {
                var a = arguments[b];
                if (a != null) {
                    arguments[b] = String(a);
                }
            }
            FAPI.FLASH.getFlash().FAPI_send.apply(FAPI.FLASH.getFlash(), arguments);
        }
    },
    UI: {
        showInvite: function(c, b, a) {
            FAPI.invokeUIMethod("showInvite", c, b, a);
        },
        showNotification: function(c, b, a) {
            FAPI.invokeUIMethod("showNotification", c, b, a);
        },
        showPermissions: function(a, b) {
            FAPI.invokeUIMethod("showPermissions", a, b);
        },
        showPayment: function(a, g, b, d, i, c, f, h, e) {
            FAPI.invokeUIMethod("showPayment", a, g, b, d, i, c, f, h, e);
        },
        showPortalPayment: function() {
            FAPI.invokeUIMethod("showPortalPayment");
        },
        showConfirmation: function(c, b, a) {
            FAPI.invokeUIMethod("showConfirmation", c, b, a);
        },
        setWindowSize: function(b, a) {
            FAPI.invokeUIMethod("setWindowSize", b, a);
        },
        changeHistory: function(a) {
            FAPI.invokeUIMethod("changeHistory", a);
        },
        scrollToTop: function() {
            FAPI.invokeUIMethod("scrollToTop");
        },
        scrollTo: function(a, b) {
            FAPI.invokeUIMethod("scrollTo", a, b);
        },
        getPageInfo: function() {
            FAPI.invokeUIMethod("getPageInfo");
        },
        navigateTo: function(a) {
            FAPI.invokeUIMethod("navigateTo", a);
        },
        postMediatopic: function(c, a, b) {
            FAPI.invokeUIMethod("postMediatopic", JSON.stringify(c), a ? "on" : "off", b ? b.join(",") : "");
        },
        showPromoPayment: function(a, b) {
            FAPI.invokeUIMethod("showPromoPayment", a, b);
        },
        isSupported: function() {
            return FAPI.mode == "W" || FAPI.mode == "F";
        }
    },
    MOBILE: {
        init: function() {
            API_initialized();
        }
    },
    OAUTH: {
        init: function(a, c, b) {
            if ((b.access_token == null) && (b.error == null)) {
                window.location = "https://connect.ok.ru/oauth/authorize?client_id=" + a.app_id + "&scope=" + (a.oauth_scope || "VALUABLE_ACCESS") + "&response_type=token&redirect_uri=" + (a.oauth_url || window.location.href) + "&layout=a&state=" + (a.oauth_state || "");
                return;
            }
            if (b.error != null) {
                window.fapi_failure("Error with OAUTH authorization: " + b.error);
                return;
            }
            API_initialized();
        }
    },
    Util: {
        isFunc: function(a) {
            return Object.prototype.toString.call(a) === "[object Function]";
        },
        isString: function(a) {
            return Object.prototype.toString.call(a) === "[object String]";
        },
        calcSignature: function(f, b) {
            var d, e = [],
                a;
            for (d in f) {
                e.push(d.toString());
            }
            e.sort();
            a = "";
            for (d = 0; d < e.length; d++) {
                var c = e[d];
                if (("sig" != c) && ("resig" != c) && ("access_token" != c)) {
                    a += e[d] + "=" + f[e[d]];
                }
            }
            a += b;
            a = this.encodeUtf8(a);
            return MD5.calc(a);
        },
        encodeUtf8: function(a) {
            var b = "";
            for (var e = 0; e < a.length; e++) {
                var d = a.charCodeAt(e);
                if (d < 128) {
                    b += String.fromCharCode(d);
                } else {
                    if ((d > 127) && (d < 2048)) {
                        b += String.fromCharCode((d >> 6) | 192);
                        b += String.fromCharCode((d & 63) | 128);
                    } else {
                        b += String.fromCharCode((d >> 12) | 224);
                        b += String.fromCharCode(((d >> 6) & 63) | 128);
                        b += String.fromCharCode((d & 63) | 128);
                    }
                }
            }
            return b;
        },
        getRequestParameters: function(h) {
            var f = {};
            var c = h || window.location.search;
            if (c) {
                c = c.substr(1);
                var e = c.split("&");
                for (var d = 0; d < e.length; d++) {
                    var a = e[d].split("=");
                    var b = a[0];
                    var g = a[1];
                    if (b !== undefined && g !== undefined) {
                        g = decodeURIComponent(g.replace(/\+/g, " "));
                        f[b] = g;
                    }
                }
            }
            return f;
        }
    },
    Client: {
        counter: 0,
        window: this,
        head: null,
        applicationKey: null,
        sessionKey: null,
        accessToken: null,
        sessionSecretKey: null,
        apiServer: null,
        baseUrl: null,
        uid: null,
        format: "JSON",
        initialized: false,
        load: function(c) {
            var b = document.createElement("script"),
                a = false;
            b.src = c;
            b.async = true;
            b.onload = b.onreadystatechange = function() {
                if (!a && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                    a = true;
                    b.onload = b.onreadystatechange = null;
                    if (b && b.parentNode) {
                        b.parentNode.removeChild(b);
                    }
                }
            };
            if (!this.head) {
                this.head = document.getElementsByTagName("head")[0];
            }
            this.head.appendChild(b);
        },
        call: function(e, a, c) {
            if (!this.initialized) {
                this.initialize();
            }
            var d = "?";
            e = this.fillParams(e);
            e.sig = FAPI.Util.calcSignature(e, this.sessionSecretKey);
            if (c != null) {
                e.resig = c;
            }
            for (key in e) {
                if (e.hasOwnProperty(key)) {
                    d += key + "=" + encodeURIComponent(e[key]) + "&";
                }
            }
            var b = "__fapi__callback_" + (++this.counter);
            this.window[b] = function(f, h, g) {
                a(f, h, g);
                window[b] = null;
                try {
                    delete window[b];
                } catch (i) {}
            };
            this.load(this.baseUrl + d + "js_callback=" + b);
            return b;
        },
        calcSignature: function(a) {
            if (!this.initialized) {
                this.initialize();
            }
            a = this.fillParams(a);
            return FAPI.Util.calcSignature(a, this.sessionSecretKey);
        },
        fillParams: function(a) {
            if (!this.initialized) {
                this.initialize();
            }
            a = a || {};
            a.application_key = this.applicationKey;
            if (this.sessionKey) {
                a.session_key = this.sessionKey;
            } else {
                a.access_token = this.accessToken;
            }
            a.format = this.format;
            return a;
        },
        initialize: function(c, b, a) {
            c = c || FAPI.Util.getRequestParameters();
            b = b || {};
            a = a || {};
            this.uid = c.logged_user_id;
            this.applicationKey = c.application_key || a.app_key;
            this.sessionKey = c.session_key;
            this.accessToken = b.access_token;
            this.sessionSecretKey = c.session_secret_key || b.session_secret_key;
            this.apiServer = c.api_server || "https://api.ok.ru/";
            this.baseUrl = this.apiServer + "fb.do";
            this.initialized = true;
        }
    }
};
var MD5 = (function() {
    var f = "0123456789abcdef";

    function e(m) {
        var n = "";
        for (var l = 0; l <= 3; l++) {
            n += f.charAt((m >> (l * 8 + 4)) & 15) + f.charAt((m >> (l * 8)) & 15);
        }
        return n;
    }

    function g(n) {
        var l = ((n.length + 8) >> 6) + 1;
        var o = new Array(l * 16);
        for (var m = 0; m < l * 16; m++) {
            o[m] = 0;
        }
        for (m = 0; m < n.length; m++) {
            o[m >> 2] |= n.charCodeAt(m) << ((m % 4) * 8);
        }
        o[m >> 2] |= 128 << ((m % 4) * 8);
        o[l * 16 - 2] = n.length * 8;
        return o;
    }

    function k(l, o) {
        var n = (l & 65535) + (o & 65535);
        var m = (l >> 16) + (o >> 16) + (n >> 16);
        return (m << 16) | (n & 65535);
    }

    function d(l, m) {
        return (l << m) | (l >>> (32 - m));
    }

    function i(r, n, m, l, p, o) {
        return k(d(k(k(n, r), k(l, o)), p), m);
    }

    function b(n, m, r, q, l, p, o) {
        return i((m & r) | ((~m) & q), n, m, l, p, o);
    }

    function h(n, m, r, q, l, p, o) {
        return i((m & q) | (r & (~q)), n, m, l, p, o);
    }

    function c(n, m, r, q, l, p, o) {
        return i(m ^ r ^ q, n, m, l, p, o);
    }

    function j(n, m, r, q, l, p, o) {
        return i(r ^ (m | (~q)), n, m, l, p, o);
    }

    function a(s) {
        var v = g(s);
        var u = 1732584193;
        var t = -271733879;
        var r = -1732584194;
        var q = 271733878;
        for (var n = 0; n < v.length; n += 16) {
            var p = u;
            var o = t;
            var m = r;
            var l = q;
            u = b(u, t, r, q, v[n + 0], 7, -680876936);
            q = b(q, u, t, r, v[n + 1], 12, -389564586);
            r = b(r, q, u, t, v[n + 2], 17, 606105819);
            t = b(t, r, q, u, v[n + 3], 22, -1044525330);
            u = b(u, t, r, q, v[n + 4], 7, -176418897);
            q = b(q, u, t, r, v[n + 5], 12, 1200080426);
            r = b(r, q, u, t, v[n + 6], 17, -1473231341);
            t = b(t, r, q, u, v[n + 7], 22, -45705983);
            u = b(u, t, r, q, v[n + 8], 7, 1770035416);
            q = b(q, u, t, r, v[n + 9], 12, -1958414417);
            r = b(r, q, u, t, v[n + 10], 17, -42063);
            t = b(t, r, q, u, v[n + 11], 22, -1990404162);
            u = b(u, t, r, q, v[n + 12], 7, 1804603682);
            q = b(q, u, t, r, v[n + 13], 12, -40341101);
            r = b(r, q, u, t, v[n + 14], 17, -1502002290);
            t = b(t, r, q, u, v[n + 15], 22, 1236535329);
            u = h(u, t, r, q, v[n + 1], 5, -165796510);
            q = h(q, u, t, r, v[n + 6], 9, -1069501632);
            r = h(r, q, u, t, v[n + 11], 14, 643717713);
            t = h(t, r, q, u, v[n + 0], 20, -373897302);
            u = h(u, t, r, q, v[n + 5], 5, -701558691);
            q = h(q, u, t, r, v[n + 10], 9, 38016083);
            r = h(r, q, u, t, v[n + 15], 14, -660478335);
            t = h(t, r, q, u, v[n + 4], 20, -405537848);
            u = h(u, t, r, q, v[n + 9], 5, 568446438);
            q = h(q, u, t, r, v[n + 14], 9, -1019803690);
            r = h(r, q, u, t, v[n + 3], 14, -187363961);
            t = h(t, r, q, u, v[n + 8], 20, 1163531501);
            u = h(u, t, r, q, v[n + 13], 5, -1444681467);
            q = h(q, u, t, r, v[n + 2], 9, -51403784);
            r = h(r, q, u, t, v[n + 7], 14, 1735328473);
            t = h(t, r, q, u, v[n + 12], 20, -1926607734);
            u = c(u, t, r, q, v[n + 5], 4, -378558);
            q = c(q, u, t, r, v[n + 8], 11, -2022574463);
            r = c(r, q, u, t, v[n + 11], 16, 1839030562);
            t = c(t, r, q, u, v[n + 14], 23, -35309556);
            u = c(u, t, r, q, v[n + 1], 4, -1530992060);
            q = c(q, u, t, r, v[n + 4], 11, 1272893353);
            r = c(r, q, u, t, v[n + 7], 16, -155497632);
            t = c(t, r, q, u, v[n + 10], 23, -1094730640);
            u = c(u, t, r, q, v[n + 13], 4, 681279174);
            q = c(q, u, t, r, v[n + 0], 11, -358537222);
            r = c(r, q, u, t, v[n + 3], 16, -722521979);
            t = c(t, r, q, u, v[n + 6], 23, 76029189);
            u = c(u, t, r, q, v[n + 9], 4, -640364487);
            q = c(q, u, t, r, v[n + 12], 11, -421815835);
            r = c(r, q, u, t, v[n + 15], 16, 530742520);
            t = c(t, r, q, u, v[n + 2], 23, -995338651);
            u = j(u, t, r, q, v[n + 0], 6, -198630844);
            q = j(q, u, t, r, v[n + 7], 10, 1126891415);
            r = j(r, q, u, t, v[n + 14], 15, -1416354905);
            t = j(t, r, q, u, v[n + 5], 21, -57434055);
            u = j(u, t, r, q, v[n + 12], 6, 1700485571);
            q = j(q, u, t, r, v[n + 3], 10, -1894986606);
            r = j(r, q, u, t, v[n + 10], 15, -1051523);
            t = j(t, r, q, u, v[n + 1], 21, -2054922799);
            u = j(u, t, r, q, v[n + 8], 6, 1873313359);
            q = j(q, u, t, r, v[n + 15], 10, -30611744);
            r = j(r, q, u, t, v[n + 6], 15, -1560198380);
            t = j(t, r, q, u, v[n + 13], 21, 1309151649);
            u = j(u, t, r, q, v[n + 4], 6, -145523070);
            q = j(q, u, t, r, v[n + 11], 10, -1120210379);
            r = j(r, q, u, t, v[n + 2], 15, 718787259);
            t = j(t, r, q, u, v[n + 9], 21, -343485551);
            u = k(u, p);
            t = k(t, o);
            r = k(r, m);
            q = k(q, l);
        }
        return e(u) + e(t) + e(r) + e(q);
    }
    return {
        calc: a
    };
}());