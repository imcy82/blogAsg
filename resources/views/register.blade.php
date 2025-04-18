<!DOCTYPE html>
<html>
<head>
    <title>Register</title>
    <link rel="stylesheet" href="{{ asset('css/form.css') }}">
    <script>
        function toggleReferral() {
            const role = document.querySelector('input[name="role"]:checked').value;
            const referralDiv = document.getElementById('referral-section');
            referralDiv.style.display = (role === 'admin') ? 'block' : 'none';
        }

        window.onload = function () {
            toggleReferral(); // run once on load
            const radios = document.querySelectorAll('input[name="role"]');
            radios.forEach(r => r.addEventListener('change', toggleReferral));
        };
    </script>
</head>
<body>
    <div class="register-container">
        <h2>Register</h2>

        {{-- Back button --}}
        <div style="position: absolute; left: 20px; top: 20px;">
            <a href="{{ url('/') }}" style="text-decoration: none; color: blue; font-weight: bold;">← Back to Home</a>
        </div>

        {{-- Error messages --}}
        @if ($errors->any())
            <div class="error">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form method="POST" action="{{ route('register') }}">
            @csrf

            <div class="form-group">
                <label>Name</label>
                <input type="text" name="name" value="{{ old('name') }}" required>
            </div>

            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" value="{{ old('email') }}" required>
            </div>

            <div class="form-group">
                <label>Password</label>
                <input type="password" name="password" required>
            </div>

            <div class="form-group">
                <label>Confirm Password</label>
                <input type="password" name="password_confirmation" required>
            </div>

            <div class="form-group">
                <label>Register as:</label><br>
                <label><input type="radio" name="role" value="user" {{ old('role') !== 'admin' ? 'checked' : '' }}> User</label>
                <label><input type="radio" name="role" value="admin" {{ old('role') === 'admin' ? 'checked' : '' }}> Admin</label>
            </div>

            <div class="form-group" id="referral-section" style="display: none;">
                <label>Admin Referral Code</label>
                <input type="text" name="referral_code" value="{{ old('referral_code') }}">
            </div>

            <button type="submit">Register</button>

            <p style="text-align:center; margin-top:15px;">Already have an account?
                <a href="{{ route('login') }}">Log in here</a>
            </p>
        </form>
    </div>
</body>
</html>
