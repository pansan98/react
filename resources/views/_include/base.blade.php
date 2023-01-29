<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

@include('_include.head')

<body class="antialiased hold_transition sidebar-mini layout-fixed">
@yield('content')

@include('_include.javascript')
</body>
</html>