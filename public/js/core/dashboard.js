/* LibreNMS Dashboard
 *
 * @type Object
 * @description $.Dashboard is the main object for this dashboard class.
 *              It's used for implementing functions and options related
 *              to the dashboard. Keeping everything wrapped in an object
 *              prevents conflict with other plugins and is a better
 *              way to organize our code.
 */
$.Dashboard = {};

/* setupDashboard()
 * ========
 * Sets up the users dashboard
 */
$.Dashboard.setupDashboard = function() {
    var options = {
        cellHeight: 80,
        verticalMargin: 10,
        draggable: {
            handle: '.draggable',
            scroll: true,
            appendTo: 'body'
        },
        animate: true
    };
    return $('.grid-stack').gridstack(options).data('gridstack');
};

/* addWidget(grid, data)
 * ========
 * Sets up the users dashboard
 */
$.Dashboard.addWidget = function(grid, data) {
    if (data.settings) {
        data.settings = $.parseJSON(data.settings);
    }
    if (data.autoPosition == '') {
        data.autoPosition = false;
    }
    data.refresh = 60;
    $.Dashboard.refreshDashboardWidget(data, false);
 };

/* refreshDashboardWidget()
 * ========
 * Refreshes the data in a widget
 */
$.Dashboard.refreshDashboardWidget = function(data, refresh=false)
{
    var id = data.widget_id;
    $.Util.apiAjaxGetCall('/api/dashboard-widget/'+id)
        .done(function(response) {
            var settings = response.widget;
            if (refresh === false)
            {
                var html = '<div id="'+data.user_widget_id+'" data-widget_id="'+data.widget_id+'" data-refresh="'+data.refresh+'">' +
                    '<div class="grid-stack-item-content box box-primary box-solid">' +
                    '<div class="box-header with-border draggable"><h3 class="box-title">' + settings.widget_title + '</h3><div class="box-tools pull-right">' +
                    '<button type="button" class="btn btn-box-tool edit-widget" data-id="' + data.user_widget_id + '" data-widget-name="' + settings.widget + '" onClick="$.Dashboard.editWidget(this)"><i class="fa fa-wrench"></i></button> ' +
                    '<button type="button" class="btn btn-box-tool remove-widget" data-id="' + data.user_widget_id + '" onClick="$.Dashboard.removeWidget(this)"><i class="fa fa-trash"></i></button>' +
                    '</div></div><div class="box-body">' +
                    '<i class="fa fa-spinner fa-pulse fa-5x fa-fw margin-bottom"></i><span class="sr-only">Loading...</span>' +
                    '</div></div></div>';

                var el = $(html);
                grid.addWidget(el, data.col, data.row, data.size_x, data.size_y, data.autoPosition, null, null, null, null, data.user_widget_id);
            }
            $.Dashboard.grabContent(data,settings);

        })
        .fail(function(err,msg) {
            toastr.error("Couldn't create the widget " + data.title);
        });
};


$.Dashboard.grabContent = function(data,settings) {
    var refresh = data.refresh*1000;
    $.get('/widget-data/'+settings.widget+'?id='+data.user_widget_id, function () {
    })
    .done(function(output) {
        $('#'+data.user_widget_id).find('.grid-stack-item-content .box-body').html(output);
    })
    .fail(function(err,msg) {
        if (err.status === 404) {
            $('#'+data.user_widget_id).find('.grid-stack-item-content .box-body').html('This widget isn\'t currently available in this version! :(');
        }
        else {
            $('#'+data.user_widget_id).find('.grid-stack-item-content .box-body').html('<h1>:(</h1>');
        }
    });
    setTimeout(function() {
        $.Dashboard.grabContent(data,settings)
    },
    refresh);
};

/* updateWidget()
 * ======
 * Updates the widgets details in the DB
 */
$.Dashboard.updateWidget = function(target)
{
    var data = {
        id:     target.getAttribute('data-gs-id'),
        x:      target.getAttribute('data-gs-x'),
        y:      target.getAttribute('data-gs-y'),
        width:  target.getAttribute('data-gs-width'),
        height: target.getAttribute('data-gs-height')
    };
    $.Util.apiAjaxPATCHCall('/api/dashboard-widget/'+data['id'], data)
        .done(function(content) {
        })
        .fail(function(err,msg) {
            toastr.error("Couldn't update this widget!");
        });
};

/* removeWidget()
 * ======
 * Remove the selected widget
 *
 * @type Function
 * @Usage: $.Dashboard.removeWidget()
 */
$.Dashboard.removeWidget = function(data) {
    $(document).ready(function(){
            var $this = $(data);
            var el = $this.closest('.grid-stack-item');
            $.Util.apiAjaxDELETECall('/api/dashboard-widget/'+$this.data('id'))
                .done(function(content) {
                    $('.grid-stack').data('gridstack').removeWidget(el);
                })
                .fail(function(err,msg) {
                    toastr.error("Couldn't remove this widget!");
                });
    });
};

/* editWidget()
 * ======
 * Edit the selected widget
 *
 * @type Function
 * @Usage: $.Dashboard.editWidget()
 */
$.Dashboard.editWidget = function(data) {
        var $this = $(data);
        var id = $this.data('id');
        var widget = $this.data('widget-name');
        var url;
        if($this.data('settings-visible') != 1) {
            $this.data('settings-visible', 1);
            url = '/widget-data/' + widget + '/settings?id=' + id;
        } else {
            $this.data('settings-visible', 0);
            url = '/widget-data/' + widget + '?id=' + id;
        }
        $.get(url, function () {
        })
        .done(function(output) {
            var container = $this.closest('.grid-stack-item').find('.box-body');
            container.fadeOut(150).css('display', 'none').html(output).fadeIn(150);
        })
        .fail(function(err,msg) {
            if (err.status === 404) {
                $this.closest('.grid-stack-item').find('.box-body').html('This widget isn\'t currently available in this version! :(');
            }
            else {
                $this.closest('.grid-stack-item').find('.box-body').html('<h1>:(</h1>');
            }
        });
};

$.Dashboard.dashboardActions = function(grid) {
    $(document).ready(function(){
        $('#add-dashboard').click('', function(event) {
            event.preventDefault();
            $('#show-edit').collapse('hide');
            $('#show-delete').collapse('hide');
            $('#show-add').collapse('toggle');
        });
        $('#edit-dashboard').click('', function(event) {
            event.preventDefault();
            $('#show-add').collapse('hide');
            $('#show-delete').collapse('hide');
            $('#show-edit').collapse('toggle');
        });
        $('#delete-dashboard').click('', function(event) {
            event.preventDefault();
            $('#show-add').collapse('hide');
            $('#show-edit').collapse('hide');
            $('#show-delete').collapse('toggle');
        });
        $('#confirm-delete-dashboard').click('', function(event) {
            event.preventDefault();
            var $this = $(this);
            $.Util.apiAjaxDELETECall('/api/dashboard/'+$this.data('id'))
                .done(function(content) {
                    $('.grid-stack').data('gridstack').removeAll();
                    toastr.info("Dashboard has been removed");
                    setTimeout(function() {
                        window.location.replace('/');
                    }, 2000);
                })
                .fail(function(err,msg) {
                    toastr.error("Couldn't delete this dashboard!");
                });
        });
        $('#clear-dashboard, #clear-dashboard-2').click('', function(event) {
            event.preventDefault();
            var $this = $(this);
            $.Util.apiAjaxDELETECall('/api/dashboard/'+$this.data('id')+'/clear')
            .done(function(content) {
                $('.grid-stack').data('gridstack').removeAll();
                toastr.info("Dashboard has been cleared");
            })
            .fail(function(err,msg) {
                toastr.error("Couldn't clear this dashboard!");
            });
        });
        $('#confirm-add-dashboard').submit(function(event) {
            event.preventDefault(event);
            var data = $("#confirm-add-dashboard").serialize();
            $.Util.ajaxCall('POST','/api/dashboard', data)
                .done(function(data) {
                    if (data.statusText === "OK" ) {
                        window.location.replace('/dashboard/'+data.dashboard_id);
                    }
                    else {
                        toastr.error('We had a problem creating your dashboard');
                    }
                })
                .fail(function(err,msg) {
                    if (err.status === 422)
                    {
                        var response = jQuery.parseJSON(err.responseText);
                        jQuery.each(response, function(field, message)
                        {
                            $(form + ' [name=' + field + ']').next('.form-error').html(message);
                        });
                    }
                    else {
                        toastr.error("Couldn't create this dashboard");
                    }
                });
        });
        $('#confirm-edit-dashboard').submit(function(event) {
            event.preventDefault(event);
            var form         = $("#confirm-edit-dashboard");
            var dashboard_id = form.data('dashboard_id');
            var name         = form.find("input[name=name]").val();
            var access       = form.find("select[name=access]").val();
            var data = {
                name:   name,
                access: access
            };
            $.Util.apiAjaxPATCHCall('/api/dashboard/'+dashboard_id, data)
                .done(function(data) {
                    if (data.statusText === "OK" ) {
                        window.location.replace('/dashboard/'+dashboard_id);
                    }
                    else {
                        toastr.error('We had a problem updating your dashboard');
                    }
                })
                .fail(function(err,msg) {
                    if (err.status === 422)
                    {
                        var response = jQuery.parseJSON(err.responseText);
                        jQuery.each(response, function(field, message)
                        {
                            $("#confirm-edit-dashboard" + ' [name=' + field + ']').next('.form-error').html(message);
                        });
                    }
                    else {
                        toastr.error("Couldn't update this dashboard");
                    }
                });
        });
        $('#add_widget_id').on('change', function(event)
        {
            $(".helper-add-widgets").hide();
            var tmp_data     = $('#add_widget_id').val().split(",");
            var dashboard_id = $('#add_widget_id').data('dashboard_id');
            if (tmp_data && dashboard_id)
            {
                var widget_id  = tmp_data[0];
                var post_data = {
                    col: '',
                    row: '',
                    size_x: tmp_data[1],
                    size_y: tmp_data[2],
                    widget_id: tmp_data[0],
                    title: tmp_data[3],
                    dashboard_id: dashboard_id,
                    autoPosition: true
                };
                $.Util.ajaxCall('POST','/api/dashboard-widget', post_data)
                .done(function(data) {
                    if (data.statusText === "OK" ) {
                        post_data.user_widget_id = data.user_widget_id;
                        $.Dashboard.addWidget(grid, post_data, true);
                    }
                    else {
                        toastr.error('We had a problem adding this widget');
                    }
                })
                .fail(function(err,msg) {
                    toastr.error("Couldn't add this widget!");
                });
            }
            else {
                toastr.error("Fatal, Couldn't add this widget");
            }
        });

        var which;
        var content = $('.content');
        content.on('click', 'input.update-widget-settings', function(event) {
            which = 'update-widget-settings';
        });
        content.on('click', 'input.cancel-widget-settings', function(event) {
            which = 'cancel-widget-settings';
        });
        content.on('submit', 'form.widget-settings', function(event) {
            event.preventDefault();
            var el = $(this).closest('.grid-stack-item');
            var user_widget_id = el.attr('id');
            var form_data = dataToJson($(this).find('[name!=_token]').serializeArray());
            var fd = $.param({ settings: form_data });
            var data = {
                widget_id: el.data('widget_id'),
                user_widget_id: user_widget_id,
                refresh: el.data('refresh')
            };
            if (which === 'update-widget-settings') {
                $.Util.apiAjaxPATCHCall('/api/dashboard-widget/'+user_widget_id, fd)
                    .done(function(content) {
                        $.Dashboard.refreshDashboardWidget(data,true);
                    })
                    .fail(function(err,msg) {
                        toastr.error("Couldn't update this widget!");
                    });
            }
            else {
                $.Dashboard.refreshDashboardWidget(data,true);
            }
        });
        which = '';
    });
};

function dataToJson(data){
    var json = {};
    jQuery.each(data, function() {
        json[this.name] = this.value || '';
    });
    return json;
}
