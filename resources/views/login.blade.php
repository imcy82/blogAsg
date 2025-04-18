<!DOCTYPE html>
<html>
<head>
    <title>Login</title>
    <link rel="stylesheet" href="{{ asset('css/form.css') }}"> {{-- reuse same CSS --}}
</head>
<body>
    <div class="register-container">
        <h2>Login</h2>

        @if ($errors->any())
            <div class="error">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif
        
            <div style="position: absolute; left: 20px; top: 20px;">
                <a href="{{ url('/') }}" style="text-decoration: none; color: blue; font-weight: bold;">← Back to Home</a>
            </div>
        <form method="POST" action="{{ route('login') }}">
            @csrf

            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" value="{{ old('email') }}" required>
            </div>

            <div class="form-group">
                <label>Password</label>
                <input type="password" name="password" required>
            </div>

            {{-- Remember Me checkbox --}}  
            <div class="form-group">
                <label><input type="checkbox" name="remember" >Remember me</label>
            </div>

            <button type="submit">Login</button>
        </form>

        <p style="text-align:center; margin-top:15px;">Don’t have an account?
            <a href="{{ route('register') }}">Register here</a>
        </p>
    </div>
</body>
</html>
