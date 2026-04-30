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
    
    # Template strings in JS use backticks, so we use literal heredoc in PS to avoid expansion
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
        if (-not ($pj.PSObject.Properties['type'])) {
            $pj | Add-Member -Name "type" -Value "module"
        } else {
            $pj.type = "module"
        }
        $pj | ConvertTo-Json | Set-Content $pjPath
    }

    # Update HTML to shrink placeholder text
    $htmlPath = "$basePath\pages\index.html"
    if (Test-Path $htmlPath) {
        $html = Get-Content $htmlPath -Raw
        $html = $html -replace 'class="display-6', 'class="h5'
        $html = $html -replace 'class="display-5', 'class="h4'
        $html = $html -replace 'class="display-4', 'class="h3'
        $html = $html -replace '<h1 class="h3', '<h1 class="display-4'
        $html = $html -replace 'id="resPanel1" class="fw-bold', 'id="resPanel1" class="h5 fw-bold'
        $html = $html -replace 'id="resPanel3" class="fw-bold', 'id="resPanel3" class="h5 fw-bold'
        Set-Content -Path $htmlPath -Value $html
    }
}
