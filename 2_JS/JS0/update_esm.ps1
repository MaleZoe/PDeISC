$dirs = @(
    "Ejercicio1-push", "Ejercicio2-pop", "Ejercicio3-unshift", "Ejercicio4-shift", "Ejercicio5-splice",
    "Ejercicio6-slice", "Ejercicio7-indexOf", "Ejercicio8-includes", "Ejercicio9-forEach", "Ejercicio10-map",
    "Ejercicio11-filter", "Ejercicio12-reduce", "Ejercicio13-sort", "Ejercicio14-reverse"
)

$ports = @{
    "Ejercicio1-push" = 3001;
    "Ejercicio2-pop" = 3002;
    "Ejercicio3-unshift" = 3003;
    "Ejercicio4-shift" = 3004;
    "Ejercicio5-splice" = 3005;
    "Ejercicio6-slice" = 3006;
    "Ejercicio7-indexOf" = 3007;
    "Ejercicio8-includes" = 3008;
    "Ejercicio9-forEach" = 3009;
    "Ejercicio10-map" = 3010;
    "Ejercicio11-filter" = 3011;
    "Ejercicio12-reduce" = 3012;
    "Ejercicio13-sort" = 3013;
    "Ejercicio14-reverse" = 3014
}

foreach ($dir in $dirs) {
    $port = $ports[$dir]
    $basePath = "c:\Users\salvi\Documents\GitHub\PDeISC\2_JS\JS0\$dir"
    
    # Update server.js - Using literal heredoc for the template
    $template = @'
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = {{PORT}};

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

const server = app.listen(PORT, () => {
    console.log(` Servidor iniciado exitosamente en puerto ${PORT}.`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(` ERROR: Puerto ${PORT} en uso.`);
        process.exit(1);
    }
});
'@
    $serverContent = $template.Replace('{{PORT}}', $port)
    Set-Content -Path "$basePath\server.js" -Value $serverContent

    # Update package.json
    $pjPath = "$basePath\package.json"
    if (Test-Path $pjPath) {
        $pj = Get-Content $pjPath | ConvertFrom-Json
        $pj | Add-Member -Name "type" -Value "module" -Force
        $pj | ConvertTo-Json | Set-Content $pjPath
    }

    # Update HTML to shrink placeholder text
    $htmlPath = "$basePath\pages\index.html"
    if (Test-Path $htmlPath) {
        $html = Get-Content $htmlPath -Raw
        $html = $html -replace 'display-6', 'h5'
        $html = $html -replace 'display-5', 'h4'
        $html = $html -replace 'display-4', 'h3'
        # Restore h1 display-4
        $html = $html -replace '<h1 class="h3', '<h1 class="display-4'
        Set-Content -Path $htmlPath -Value $html
    }
}
