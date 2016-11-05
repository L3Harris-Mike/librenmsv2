<!-- Header Navbar: style can be found in header.less -->
<nav class="navbar navbar-static-top">
    <!-- Sidebar toggle button-->
    <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
    </a>
    <div class="navbar-custom-menu">
        <ul class="nav navbar-nav">
            <!-- Notifications Menu -->
            <li class="dropdown notifications-menu">
                <!-- Menu toggle button -->
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                    <i class="fa fa-envelope-o"></i>
                    <span class="label label-info" id="notification-menu-count"></span>
                </a>
                <ul class="dropdown-menu">
                    <li>
                        <!-- Inner Menu: contains the notifications -->
                        <ul id="dropdown-notifications-list" class="menu">
                        </ul>
                    </li>
                    <li class="footer"><a href="{{ url('/notifications') }}">View all</a></li>
                </ul>
            </li>
            <!-- User Account: style can be found in dropdown.less -->
            <li class="dropdown user user-menu">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                    <i class="fa fa-user fa-lg" aria-hidden="true"></i>
                    <span class="hidden-xs">{{ Auth::user()->username }}</span> <span class="caret"></span>
                </a>
                <ul class="dropdown-menu">
                    <li class="user-header">
                        <p>{{ Auth::user()->realname }} ({{ Auth::user()->username }})</p>
                        <p><small>{{ Auth::user()->email }}</small></p>
                        <p><small><strong>{{ trans('user.level.' . Auth::user()->level) }}</strong></small></p>
                        <p><small><i>{{ Auth::user()->descr }}</i></small></p>
                    </li>
                    <li class="user-footer">
                        <div class="pull-left"><a href="{{ url('preferences') }}" class="btn btn-default btn-flat"><i class="fa fa-cog"></i> {{ trans('nav.mysettings') }}</a></div>
                        <form method="POST" action="{{ url('logout') }}">
                            {{ csrf_field() }}
                            <div class="pull-right">
                                <button type="submit" name="logout" class="btn btn-default btn-flat"><i class="fa fa-sign-out"></i> {{ trans('nav.logout') }}</button>
                            </div>
                        </form>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</nav>
