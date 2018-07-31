function postData() {
    var appId = document.getElementById("app-id").value.trim();
    var attachmentToSend = document.getElementById("attachment-data").value.trim().replace(/(\r\n|\n|\r)/gm,"");
    var appSecretKey = document.getElementById("app-secret-key").value.trim();
    var returnUrl = document.getElementById("return-url").value.trim()
    var groupId = document.getElementById("group-id").value.trim()
    var width = document.getElementById("publish-width").value.trim();
    var height = document.getElementById("publish-height").value.trim();
    if (width === "" || height === "") {
        window.open(buildUrl(appId, attachmentToSend, appSecretKey, returnUrl, groupId));
    }
    window.open(
        buildUrl(appId, attachmentToSend, appSecretKey, returnUrl, groupId),
        "publish-window",
        "width="+parseInt(width)+",height="+parseInt(height)
    );
}

function suggest() {
    var appId = document.getElementById("app-id-suggest").value.trim();
    var widgetType = document.getElementById("app-widget-type").value.trim();
    var appSecretKey = document.getElementById("app-secret-key-suggest").value.trim();
    var width = document.getElementById("suggest-width").value.trim();
    var height = document.getElementById("suggest-height").value.trim();
    if (width === "" || height === "") {
        window.open(buildSuggestUrl(appId, widgetType, appSecretKey));
    }
    window.open(
        buildSuggestUrl(appId, widgetType, appSecretKey),
        "suggest-window",
        "width="+parseInt(width)+",height="+parseInt(height)
    )
}

function buildUrl(appId, attachment, secretKey, returnUrl, groupId) {
    var urlToPost = document.getElementById("widgets-main-host").value.trim() +
                    "dk?st.cmd=WidgetMediatopicPost" +
                    "&st.app=" + appId +
                    "&st.attachment=" + encodeURIComponent(attachment) +
                    "&st.signature=" + getSignature(attachment, secretKey, returnUrl)
    ;
    if (returnUrl && returnUrl.length > 0) {
        urlToPost += "&st.return=" + returnUrl;
    }

    if (groupId && groupId.length > 0) {
        urlToPost += "&st.groupId=" + groupId;
    }

    if (document.getElementById("publish-st.popup").checked) {
        urlToPost += "&st.popup=1"
    }

    if (document.getElementById("publish-st.silent").checked) {
        urlToPost += "&st.silent=1"
    }

    if (document.getElementById("publish-st.utext").checked) {
        urlToPost += "&st.utext=1"
    }

    if (document.getElementById("publish-st.nohead").checked) {
        urlToPost += "&st.nohead=1"
    }
    console.log(urlToPost)
    return urlToPost;
}

function buildSuggestUrl(appId, widgetType, secretKey) {
    var urlToPost = document.getElementById("widgets-main-host").value.trim() +
                    "dk?st.cmd=" + widgetType +
                    "&st.app=" + appId +
                    "&st.signature=" + CryptoJS.MD5(secretKey)
    ;

    console.log(urlToPost)
    return urlToPost;
}

function getSignature(attachment, secretKey, returnUrl) {
    var stringToHash = "st.attachment=" + attachment;
    if (returnUrl && returnUrl.length > 0) {
        stringToHash += "st.return=" + returnUrl;
    }
    stringToHash += secretKey;
    console.log(stringToHash);
    return CryptoJS.MD5(stringToHash);
}

function getSessionSecretKey(accessToken, secretKey) {
    return secretKey ? accessToken === "" : CryptoJS.MD5(accessToken+secretKey);
}

function getWidgetAsFrame() {
    var frame = document.createElement('iframe');
    var appId = document.getElementById("app-id").value.trim();
    var attachmentToSend = document.getElementById("attachment-data").value.trim().replace(/(\r\n|\n|\r)/gm,"");
    var appSecretKey = document.getElementById("app-secret-key").value.trim();
    frame.src = buildUrl(appId, attachmentToSend, appSecretKey);
    document.body.appendChild(frame);
}

function renewLikeWidget() {
    document.getElementById("ok_shareWidget").innerHTML = ""
    var widgetsHost = document.getElementById("widgets-main-host").value.trim();
    var urlToShare = document.getElementById("share-url").value.trim();
    OK.CONNECT.hostName = widgetsHost;
    OK.CONNECT.insertShareWidget("ok_shareWidget", urlToShare, "{width:150  ,height:50,st:'oval',sz:30,ck:1}");
}

function oauth() {
    var appId = document.getElementById("app-id-oauth").value.trim();
    var scope = document.getElementById("oauth-permissions").value.trim();
    var redirectUri = document.getElementById("oauth-redirect-uri").value.trim();
    window.open(buildOauthUrl(appId, scope, redirectUri), "oauth", "width=640,height=480");
}

function buildOauthUrl(appId, scope, redirectUri) {
    var widgetsHost = document.getElementById("widgets-main-host").value.trim();
    var oauthUrl = widgetsHost +
                    "oauth/authorize?" +
                    "client_id=" + appId +
                    "&scope=" + scope +
                    "&response_type=" + "code" +
                    "&redirect_uri=" + redirectUri
    ;
    return oauthUrl;
}

function getGroupWidget() {
    document.getElementById("ok_group_widget").innerHTML = "";
    var groupId = document.getElementById("group-widget-group-id").value.trim();
    var widgetHeight = document.getElementById("group-widget-height").value.trim();
    var widgetWidth = document.getElementById("group-widget-width").value.trim();
    var widgetsHost = document.getElementById("widgets-main-host").value.trim();
    OK.CONNECT.hostName = widgetsHost;
    OK.CONNECT.insertGroupWidget("ok_group_widget", groupId, '{"width":' + widgetWidth + ', "height":' + widgetHeight + '}');
}