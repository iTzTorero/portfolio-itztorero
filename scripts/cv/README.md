# Fuente de los CVs

`cv_en.html` y `cv_es.html` son la fuente de los PDFs en `src/assets/`. El logo va incrustado en base64 (origen: `src/assets/logo.png`, reducido a 240px de alto).

Regenerar tras editar:

```bash
cd scripts/cv
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf=../../src/assets/CV_JuanPablo_Valenzuela_EN.pdf cv_en.html
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf=../../src/assets/CV_JuanPablo_Valenzuela_ES.pdf cv_es.html
```
