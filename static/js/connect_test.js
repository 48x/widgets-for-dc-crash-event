var OK = OK || {};
OK.CONNECT = OK.CONNECT || {
    hostName: "https://vDevLnx192.mail.msk",
    defaultStyle: "border:0;",
    frameId: 0,
    uiStarted: false,
    config: {
        detectClientCanonical: true,
        maxQueryLength: 1488
    },
    insertGroupWidget: function(a, c, b) {
        this.insertWidget(a, "Group", "st.groupId=" + c, b, 250, 335);
    },
    insertShareWidget: function(d, c, i, f, h, g) {
        var a = "st.shareUrl=" + encodeURIComponent(c);
        if (typeof f !== "undefined") {
            a += "&st.title=" + encodeURIComponent(f);
        }
        if (typeof h !== "undefined") {
            a += "&st.description=" + encodeURIComponent(h);
        }
        if (typeof g !== "undefined") {
            a += "&st.imageUrl=" + encodeURIComponent(g);
        }
        var e = this.UTIL.detectCanonicalUrl();
        if (typeof e === "string" && e.length > 0) {
            var b = "&st.canonicalUrl=" + encodeURIComponent(e);
            if ((a + b).length <= OK.CONNECT.config.maxQueryLength) {
                a += "&st.canonicalUrl=" + encodeURIComponent(e);
            }
        }
        this.insertWidget(d, "Share", a, i, 170, 30);
    },
    insertWidget: function(f, g, h, i, j, b) {
        var e = document.getElementById(f);
        if (e == null) {
            return "error";
        }
        if (typeof i === "undefined") {
            i = "{}";
        }
        this.startUI();
        var d = document.createElement("iframe");
        d.id = "__ok" + g + this.frameId++;
        d.scrolling = "no";
        d.frameBorder = 0;
        d.allowTransparency = true;
        d.src = this.hostName + "/dk?st.cmd=Widget" + g + "&" + h + "&st.fid=" + d.id + "&st.hoster=" + encodeURIComponent(window.location) + "&st.settings=" + encodeURIComponent(i);
        var c = this.UTIL.parseJson(i);
        var a = this.defaultStyle;
        a += "width:" + this.UTIL.getJsonAttr(c, "width", j) + "px;";
        a += "height:" + this.UTIL.getJsonAttr(c, "height", b) + "px;";
        this.UTIL.applyStyle(d, a);
        e.appendChild(d);
    },
    startUI: function() {
        if (this.uiStarted) {
            return;
        }
        this.uiStarted = true;
        try {
            if (window.addEventListener) {
                window.addEventListener("message", this.onUI, false);
            } else {
                window.attachEvent("onmessage", this.onUI);
            }
        } catch (a) {}
    },
    onUI: function(c) {
        if (c.origin != OK.CONNECT.hostName) {
            return;
        }
        var a = c.data.split("$");
        if (a[0] == "ok_setStyle") {
            var b = document.getElementById(a[1]);
            OK.CONNECT.UTIL.applyStyle(b, a[2]);
        }
    },
    UTIL: {
        applyStyle: function(b, e) {
            var d = e.split(";");
            for (var a = 0; a < d.length; a++) {
                var c = d[a].split(":");
                if (c.length == 2 && c[0].length > 0) {
                    b.style[c[0]] = c[1];
                }
            }
        },
        parseJson: function(jsonStr) {
            return eval("(function(){return " + jsonStr + ";})()");
        },
        getJsonAttr: function(d, b, c) {
            var a = d[b];
            return a != null ? a : c;
        },
        detectCanonicalUrl: function() {
            if (OK.CONNECT.config.detectClientCanonical != true) {
                console.log("1");
                return undefined;
            }
            if (!document || !document.getElementsByTagName) {
                console.log("2");
                return undefined;
            }
            var a = document.getElementsByTagName("link");
            for (var b = 0; b < a.length; b++) {
                var c = a[b];
                if (c && c.rel === "canonical" && c.href !== undefined) {
                    console.log("3");
                    return c.href;
                }
            }
            var e = document.getElementsByTagName("meta");
            for (var b = 0; b < e.length; b++) {
                var d = e[b];
                if (d && d.name === "og:url" && d.content !== undefined) {
                    console.log("4");
                    return d.content;
                }
            }
            console.log("5");
            return undefined;
        }
    }
};