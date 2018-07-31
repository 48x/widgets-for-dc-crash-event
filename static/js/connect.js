var OK = OK || {};
OK.CONNECT = OK.CONNECT || {
    hostName: "https://connect.ok.ru",
    defaultStyle: "border:0;",
    frameId: 0,
    uiStarted: false,
    insertGroupWidget: function(a, c, b) {
        this.insertWidget(a, "Group", "st.groupId=" + c, b, 250, 335);
    },
    insertContentWidget: function(a, c, b) {
        this.insertWidget(a, "Content", "st.content=" + c, b, 250, 335);
    },
    insertShareWidget: function(c, f, d, g, e, b) {
        var a = "st.shareUrl=" + encodeURIComponent(f);
        if (typeof g !== "undefined") {
            a += "&st.title=" + encodeURIComponent(g);
        }
        if (typeof e !== "undefined") {
            a += "&st.description=" + encodeURIComponent(e);
        }
        if (typeof b !== "undefined") {
            a += "&st.imageUrl=" + encodeURIComponent(b);
        }
        this.insertWidget(c, "Share", a, d, 170, 30);
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
        }
    }
};