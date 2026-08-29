<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(HttpRequest $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users', function ($attribute, $value, $fail) {
                if (!str_ends_with(strtolower($value), '@university.edu')) {
                    $fail('The '.$attribute.' must be a valid @university.edu address.');
                }
            }],
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'student',
            'email_verified_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Registration successful',
            'data' => [
                'user' => $user,
                'token' => $user->createToken('auth_token')->plainTextToken,
            ]
        ], 201);
    }

    public function login(HttpRequest $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if ($user->status === 'blocked') {
            throw ValidationException::withMessages([
                'email' => ['This account has been blocked.'],
            ]);
        }

        if (!$user->email_verified_at) {
            $user->email_verified_at = now();
            $user->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => $user,
                'token' => $user->createToken('auth_token')->plainTextToken,
            ]
        ]);
    }

    public function logout(HttpRequest $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }

    public function me(HttpRequest $request)
    {
        return response()->json([
            'success' => true,
            'data' => $request->user()
        ]);
    }

    public function updateProfile(HttpRequest $request)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'contact_information' => 'nullable|string|max:255',
            'profile_image' => 'nullable|image|max:2048',
        ]);

        $user = $request->user();

        if ($request->hasFile('profile_image')) {
            $file = $request->file('profile_image');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('profiles', $filename, 'public');
            $validated['profile_image'] = '/storage/' . $path;
        }

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => $user->fresh()
        ]);
    }

    public function forgotPassword(HttpRequest $request)
    {
        $request->validate(['email' => 'required|email']);
        $status = Password::sendResetLink($request->only('email'));

        return $status === Password::RESET_LINK_SENT
                    ? response()->json(['success' => true, 'message' => __($status)])
                    : response()->json(['success' => false, 'message' => __($status)], 400);
    }

    public function resetPassword(HttpRequest $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset($request->only('email', 'password', 'password_confirmation', 'token'), function ($user, $password) {
            $user->forceFill([
                'password' => Hash::make($password)
            ])->setRememberToken(Str::random(60));
            $user->save();
            event(new PasswordReset($user));
        });

        return $status === Password::PASSWORD_RESET
                    ? response()->json(['success' => true, 'message' => __($status)])
                    : response()->json(['success' => false, 'message' => __($status)], 400);
    }
}
