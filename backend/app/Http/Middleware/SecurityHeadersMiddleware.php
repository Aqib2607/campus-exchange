<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SecurityHeadersMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Prevent clickjacking
        $response->headers->set('X-Frame-Options', 'DENY');
        
        // Prevent MIME sniffing
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        
        // Ensure HTTPS (HSTS)
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        
        // Cross-site scripting (XSS) protection (older browsers)
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        
        // Basic Content-Security-Policy
        $csp = "default-src 'self'; "
             . "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
             . "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
             . "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com; "
             . "font-src 'self' data: https://fonts.gstatic.com; "
             . "img-src 'self' data: https: blob:; "
             . "connect-src 'self' http://127.0.0.1:* http://localhost:* ws://127.0.0.1:* ws://localhost:*;";
        $response->headers->set('Content-Security-Policy', $csp);
        
        // Restrict referer
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        return $response;
    }
}
