/* LibreNMS Util
 *
 * @type Object
 * @description $.Util is the main object for this utility class.
 *              It's used for implementing functions and options related
 *              to the template. Keeping everything wrapped in an object
 *              prevents conflict with other plugins and is a better
 *              way to organize our code.
 */
$.Util = {};

/* ajaxSetup()
 * ======
 * Initial ajax setup call
 *
 * @type Function
 * @Usage: $.Util.ajaxSetup()
 */
$.Util.ajaxSetup = function(authtoken) {
    var headers = {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')};
    if (typeof authtoken != 'undefined') {
        var auth = {'Authorization': 'Bearer ' + authtoken};
        $.extend(headers, auth);
    }

    return $.ajaxSetup({
        headers: headers
    });
};

/* formatBitsPS()
 * ======
 * Converts raw bits to bits per second.
 *
 * @type Function
 * @Usage: $.Util.formatBitsPS(bits,decimals=2,base=1000)
 */
$.Util.formatBitsPS = function(bits,decimals,base) {
   var bps = ['bps', 'Kbps', 'Mbps', 'Gbps', 'Tbps', 'Pbps', 'Ebps', 'Zbps', 'Ybps'];
   return $.Util.formatDataUnits(bits,decimals,bps,base);
};

/* formatDataUnit()
 * ======
 * Converts raw bits or bytes human readable format.
 *
 * @type Function
 * @Usage: $.Util.formatBitsPS(bits,decimals=2,display=['Byte', 'Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']base=1000)
 */
$.Util.formatDataUnits = function(units,decimals,display,base) {
   if(!units) return '';
   if(display === undefined) display = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
   if(units == 0) return units + display[0];
   base = base || 1000; // or 1024 for binary
   var dm = decimals || 2;
   var i = Math.floor(Math.log(units) / Math.log(base));
   return parseFloat((units / Math.pow(base, i)).toFixed(dm)) + display[i];
};

/* updateNotificationMenu()
 * ======
 * Update the notification menu with data from the api
 *
 * @type Function
 * @Usage: $.Util.updateNotificationMenu(baseurl)
 */
$.Util.updateNotificationMenu = function(baseurl) {
    $.ajax({
        url: baseurl + '/api/notifications',
        dataType: 'json',
        success: function (data) {
            var nItems = data.data;
            var nCount = $('.notifications-menu > a > span');
            if(nItems.length > 0) {
                nCount.removeClass('label-info').addClass('label-warning');
            } else {
                nCount.removeClass('label-warning').addClass('label-info');
            }
            nCount.text(nItems.length);

            var nList = $('#dropdown-notifications-list');
            nList.empty();
            for (var i = 0; i < 5 && i < nItems.length; i++) {
                var item = $('<li>');
                var link = item.append('<a href="' + baseurl + '/notifications/' + nItems[i].id + '" title="' + nItems[i].body + '"><i class="fa fa-envelope text-aqua"></i> ' + nItems[i].title + '</a>');
                nList.append(item);
            }
        }
    });
};

/* ajaxCall()
 * ======
 * Ajax call
 *
 * @type Function
 * @Usage: $.Util.ajaxCall()
 */
$.Util.ajaxCall = function(type, url, data) {
    return $.ajax({
        type: type,
        url: url,
        data: data,
        dataType: "json"
    });
};

/* apiAjaxGetCall()
 * ======
 * Api Ajax call via get
 *
 * @type Function
 * @Usage: $.Util.apiAjaxGetCall()
 */
$.Util.apiAjaxGetCall = function(url) {
    return $.ajax({
        type: 'GET',
        url: url,
        dataType: "json"
    });
};

/* apiAjaxPATCHCall()
 * ======
 * Api Ajax call via PATCH
 *
 * @type Function
 * @Usage: $.Util.apiAjaxPATCHCall()
 */
$.Util.apiAjaxPATCHCall = function(url, data) {
    return $.ajax({
        type: 'PATCH',
        url: url,
        data: data,
        dataType: "json"
    });
};

/* apiAjaxDELETECall()
 * ======
 * Api Ajax call via DELETE
 *
 * @type Function
 * @Usage: $.Util.apiAjaxDELETECall()
 */
$.Util.apiAjaxDELETECall = function(url) {
    return $.ajax({
        type: 'DELETE',
        url: url,
        dataType: "json"
    });
};
