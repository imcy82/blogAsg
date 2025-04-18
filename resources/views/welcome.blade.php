<!DOCTYPE html>
<html>
<head>
    <title>Blog</title>
    <link rel="stylesheet" href="{{ asset('css/welcome.css') }}">
    <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
    rel="stylesheet"
    />
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

    {{-- Blogs --}}
    @if(Auth::user())
        <div id="home"></div>
        <script src="/js/app.js"></script>
    @endif
</body>
</html>
