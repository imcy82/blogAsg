<!DOCTYPE html>
<html>
<head>
    <title>Blog</title>
    <link rel="stylesheet" href="{{ asset('css/welcome.css') }}">
</head>
<body>
    <div class="header">
        <div class="title">Blog</div>
        <div style="display: flex; align-items: center;">
            @auth
                <a href="{{ url('/') }}" class="login-btn">{{ Auth::user()->name }}</a>
                <form method="POST" action="{{ route('logout') }}" style="display:inline; margin-left: 10px;">
                    @csrf
                    <button type="submit" class="login-btn">Logout</button>
                </form>
            @else
                <a href="{{ route('login') }}" class="login-btn">Login</a>
            @endauth
        </div>
    </div>

    {{-- Flash message for login/logout --}}
    @if (session('success'))
        <div class="content" style="color: green; font-weight: bold;">
            {{ session('success') }}
        </div>
    @endif

</body>
</html>
