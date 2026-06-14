$port = 8081
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
try {
    $listener.Start()
    Write-Host "PowerShell HTTP Server started successfully."
    Write-Host "Listening on http://localhost:$port/"
    Write-Host "Press Ctrl+C to stop the server."
} catch {
    Write-Host ("Failed to start listener on port " + $port + ": " + $_.Exception.Message)
    Exit
}

$baseDir = "C:\Users\Himanshu\.gemini\antigravity\scratch\himanshu-resume-site"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawUrl = $request.RawUrl
        $path = $rawUrl.Split('?')[0]
        if ($path -eq "/" -or $path -eq "") {
            $path = "/index.html"
        }

        # Format path for Windows
        $cleanPath = $path.Replace('/', '\')
        # Remove leading backslash if it exists and Join-Path handles it
        if ($cleanPath.StartsWith('\')) {
            $cleanPath = $cleanPath.Substring(1)
        }
        
        $filePath = Join-Path $baseDir $cleanPath
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            # Content-type headers
            if ($path.EndsWith(".html")) { $response.ContentType = "text/html; charset=utf-8" }
            elseif ($path.EndsWith(".css")) { $response.ContentType = "text/css" }
            elseif ($path.EndsWith(".js")) { $response.ContentType = "application/javascript" }
            elseif ($path.EndsWith(".png")) { $response.ContentType = "image/png" }
            elseif ($path.EndsWith(".jpg") -or $path.EndsWith(".jpeg")) { $response.ContentType = "image/jpeg" }

            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errorMessage = "404 Not Found: $path"
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes($errorMessage)
            $response.ContentLength64 = $errBytes.Length
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.OutputStream.Close()
    } catch {
        # Silent fail or log
    }
}
