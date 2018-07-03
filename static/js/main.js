function postData() {
    var appId = document.getElementById("app-id").value.trim();
    var attachmentToSend = document.getElementById("attachment-data").value.trim().replace(/(\r\n|\n|\r)/gm,"");
    var appSecretKey = document.getElementById("app-secret-key").value.trim();
    var returnUrl = document.getElementById("return-url").value.trim()
    var groupId = document.getElementById("group-id").value.trim()
    window.open(buildUrl(appId, attachmentToSend, appSecretKey, returnUrl, groupId));
}

function suggest() {
    var appId = document.getElementById("app-id-suggest").value.trim();
    var widgetType = document.getElementById("app-widget-type").value.trim();
    var appSecretKey = document.getElementById("app-secret-key-suggest").value.trim();
    window.open(buildSuggestUrl(appId, widgetType, appSecretKey));
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
    var widgetsHost = document.getElementById("widgets-host-main").value.trim();
    var urlToShare = document.getElementById("share-url").value.trim();
    OK.CONNECT.hostName = widgetsHost;
    OK.CONNECT.insertShareWidget("ok_shareWidget", urlToShare, "{width:150  ,height:50,st:'oval',sz:30,ck:1}");
}

function oauth() {
    var appId = document.getElementById("app-id-oauth").value.trim();
    var scope = document.getElementById("oauth-permissions").value.trim();
    var redirectUri = document.getElementById("oauth-redirect-uri").value.trim();
    window.open(buildOauthUrl(appId, scope, redirectUri));
}

function buildOauthUrl(appId, scope, redirectUri) {
    var oauthUrl = document.getElementById("widgets-host-main").value.trim() +
                    "&client_id=" + appId +
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