#!/bin/bash
# Generate page-code HTML files from source code
cd "$(dirname "$0")"

OUTDIR="page-code"
mkdir -p "$OUTDIR"

# Page list: number|title|controller_path|tsx_path|prev_file|next_file
declare -a PAGES=(
  "01|Halaman Login (Beranda)|app/Http/Controllers/Auth/LoginController.php|resources/js/pages/welcome.tsx"
  "02|Dashboard Administrator|app/Http/Controllers/Admin/DashboardController.php|resources/js/pages/admin/Dashboard.tsx"
  "03|Data Member|app/Http/Controllers/Admin/MemberController.php|resources/js/pages/admin/Member.tsx"
  "04|Biaya Pendaftaran|app/Http/Controllers/Admin/RegistrationPaymentController.php|resources/js/pages/admin/RegistrationPayment.tsx"
  "05|Biaya Gym|app/Http/Controllers/Admin/GymFeeController.php|resources/js/pages/admin/GymFee.tsx"
  "06|Data Inventaris|app/Http/Controllers/Admin/InventoryController.php|resources/js/pages/admin/Inventory.tsx"
  "07|Peralatan Gym|app/Http/Controllers/Admin/GymEquipmentController.php|resources/js/pages/admin/GymEquipment.tsx"
  "08|Kategori|app/Http/Controllers/Admin/InventoryController.php|resources/js/pages/admin/Category.tsx"
  "09|Perawatan Barang|app/Http/Controllers/Admin/MaintenanceLogController.php|resources/js/pages/admin/MaintenanceLog.tsx"
  "10|Pemasok|app/Http/Controllers/Admin/SupplierController.php|resources/js/pages/admin/Supplier.tsx"
  "11|Pengadaan Barang|app/Http/Controllers/Admin/ProcurementController.php|resources/js/pages/admin/Procurement.tsx"
  "12|Riwayat Aktivitas|app/Http/Controllers/Admin/ActivityLogController.php|resources/js/pages/admin/ActivityLog.tsx"
  "13|Laporan|app/Http/Controllers/Admin/ReportController.php|resources/js/pages/admin/Report.tsx"
  "14|Laporan Barang|app/Http/Controllers/Admin/ReportController.php|resources/js/pages/admin/report/Barang.tsx"
  "15|Laporan Keuangan|app/Http/Controllers/Admin/ReportController.php|resources/js/pages/admin/report/Keuangan.tsx"
  "16|Laporan Harian|app/Http/Controllers/Admin/ReportController.php|resources/js/pages/admin/report/Harian.tsx"
  "17|Notifikasi|app/Http/Controllers/Admin/NotificationController.php|resources/js/pages/admin/Notification.tsx"
  "18|Pengguna|app/Http/Controllers/Admin/UserController.php|resources/js/pages/admin/User.tsx"
  "19|Pengaturan|app/Http/Controllers/Admin/SettingsController.php|resources/js/pages/admin/Settings.tsx"
  "20|Dashboard Pengelola|app/Http/Controllers/Admin/DashboardController.php|resources/js/pages/pengelola/Dashboard.tsx"
  "21|Data Inventaris (Pengelola)|app/Http/Controllers/Admin/InventoryController.php|resources/js/pages/pengelola/Inventory.tsx"
  "22|Peralatan Gym (Pengelola)|app/Http/Controllers/Admin/GymEquipmentController.php|resources/js/pages/pengelola/GymEquipment.tsx"
  "23|Perawatan Barang (Pengelola)|app/Http/Controllers/Admin/MaintenanceLogController.php|resources/js/pages/pengelola/MaintenanceLog.tsx"
  "24|Pemasok (Pengelola)|app/Http/Controllers/Admin/SupplierController.php|resources/js/pages/pengelola/Supplier.tsx"
  "25|Laporan Barang (Pengelola)|app/Http/Controllers/Admin/ReportController.php|resources/js/pages/pengelola/report/Barang.tsx"
  "26|Laporan Keuangan (Pengelola)|app/Http/Controllers/Admin/ReportController.php|resources/js/pages/pengelola/report/Keuangan.tsx"
  "27|Laporan Harian (Pengelola)|app/Http/Controllers/Admin/ReportController.php|resources/js/pages/pengelola/report/Harian.tsx"
  "28|Dashboard Pimpinan|app/Http/Controllers/Admin/DashboardController.php|resources/js/pages/pimpinan/Dashboard.tsx"
  "29|Laporan Barang (Pimpinan)|app/Http/Controllers/Admin/ReportController.php|resources/js/pages/pimpinan/report/Barang.tsx"
  "30|Laporan Keuangan (Pimpinan)|app/Http/Controllers/Admin/ReportController.php|resources/js/pages/pimpinan/report/Keuangan.tsx"
  "31|Laporan Harian (Pimpinan)|app/Http/Controllers/Admin/ReportController.php|resources/js/pages/pimpinan/report/Harian.tsx"
)

TOTAL=${#PAGES[@]}

escape_html() {
  sed 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g; s/"/\&quot;/g'
}

# Keep only the essential parts of a PHP controller:
# drop the opening <?php tag, namespace, and use-imports, plus leading blank lines.
filter_php() {
  awk '
    /^<\?php/ { next }
    /^namespace / { next }
    /^use / { next }
    !seen && /^[[:space:]]*$/ { next }
    { seen = 1; print }
  ' "$1"
}

# Keep only the essential parts of a React TSX page:
# drop import lines and the JSX return(...) block (matched by paren balance),
# replacing the markup with a short placeholder comment.
filter_tsx() {
  awk '
    function countchar(s, re,   t) { t = s; return gsub(re, "", t) }
    BEGIN { skip = 0; body = 0 }
    skip == 1 {
      depth += countchar($0, "\\(") - countchar($0, "\\)")
      if (depth <= 0) { skip = 0 }
      next
    }
    /^import / { next }
    !body && /^[[:space:]]*$/ { next }
    /return[[:space:]]*\(/ {
      match($0, /^[[:space:]]*/)
      print substr($0, 1, RLENGTH) "// ... (JSX markup dibuang)"
      body = 1
      depth = countchar($0, "\\(") - countchar($0, "\\)")
      if (depth > 0) { skip = 1 }
      next
    }
    { body = 1; print }
  ' "$1"
}

generate_page() {
  local idx=$1
  IFS='|' read -r num title controller tsx <<< "${PAGES[$idx]}"

  local filename="${num}-$(echo "$title" | tr '[:upper:]' '[:lower:]' | sed 's/ (/_/g; s/)//g; s/ /-/g').html"

  local prev_link=""
  local next_link=""

  if [ $idx -gt 0 ]; then
    IFS='|' read -r pnum ptitle _ _ <<< "${PAGES[$((idx-1))]}"
    local prev_file="${pnum}-$(echo "$ptitle" | tr '[:upper:]' '[:lower:]' | sed 's/ (/_/g; s/)//g; s/ /-/g').html"
    prev_link="<a href=\"${prev_file}\" class=\"nav-btn\">&larr; Sebelumnya</a>"
  else
    prev_link="<span></span>"
  fi

  if [ $idx -lt $((TOTAL-1)) ]; then
    IFS='|' read -r nnum ntitle _ _ <<< "${PAGES[$((idx+1))]}"
    local next_file="${nnum}-$(echo "$ntitle" | tr '[:upper:]' '[:lower:]' | sed 's/ (/_/g; s/)//g; s/ /-/g').html"
    next_link="<a href=\"${next_file}\" class=\"nav-btn\">Berikutnya &rarr;</a>"
  else
    next_link="<span></span>"
  fi

  local ctrl_escaped=$(filter_php "$controller" | escape_html)
  local tsx_escaped=$(filter_tsx "$tsx" | escape_html)

  cat > "$OUTDIR/$filename" << HTMLEOF
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${num}. ${title} — Kode Sumber</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; color: #1e293b; line-height: 1.6; padding: 2rem; max-width: 1200px; margin: 0 auto; }
        h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
        .subtitle { color: #64748b; margin-bottom: 2rem; font-size: 0.9rem; }
        .code-section { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 2rem; overflow: hidden; }
        .code-header { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: #f1f5f9; border-bottom: 1px solid #e2e8f0; }
        .code-header h3 { font-size: 0.85rem; color: #475569; }
        .code-header .filepath { font-size: 0.75rem; color: #94a3b8; font-family: monospace; }
        .copy-btn { background: #3b82f6; color: #fff; border: none; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem; transition: background 0.2s; }
        .copy-btn:hover { background: #2563eb; }
        .copy-btn.copied { background: #10b981; }
        pre { margin: 0; padding: 1rem; overflow-x: auto; font-size: 0.8rem; line-height: 1.5; }
        pre code { font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace; }
        .nav { display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; }
        .nav-btn { color: #3b82f6; text-decoration: none; font-size: 0.9rem; padding: 0.5rem 1rem; border: 1px solid #3b82f6; border-radius: 4px; transition: all 0.2s; }
        .nav-btn:hover { background: #3b82f6; color: #fff; }
        .back-link { display: inline-block; margin-bottom: 1rem; color: #3b82f6; text-decoration: none; font-size: 0.85rem; }
        .back-link:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <a href="index.html" class="back-link">&larr; Kembali ke Daftar Isi</a>
    <h1>${num}. ${title}</h1>
    <p class="subtitle">Kode sumber Controller (PHP) dan Halaman (React TSX)</p>

    <div class="code-section">
        <div class="code-header">
            <div>
                <h3>Controller (PHP)</h3>
                <span class="filepath">${controller}</span>
            </div>
            <button class="copy-btn" onclick="copyCode(this, 'ctrl-code', 'Controller (PHP)', '${controller}')">Copy</button>
        </div>
        <pre><code id="ctrl-code" class="language-php">${ctrl_escaped}</code></pre>
    </div>

    <div class="code-section">
        <div class="code-header">
            <div>
                <h3>Halaman (React TSX)</h3>
                <span class="filepath">${tsx}</span>
            </div>
            <button class="copy-btn" onclick="copyCode(this, 'tsx-code', 'Halaman (React TSX)', '${tsx}')">Copy</button>
        </div>
        <pre><code id="tsx-code" class="language-tsx">${tsx_escaped}</code></pre>
    </div>

    <div class="nav">
        ${prev_link}
        ${next_link}
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/php.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/typescript.min.js"></script>
    <script>
        function inlineStyles(source) {
            const clone = source.cloneNode(true);
            const srcNodes = source.querySelectorAll('*');
            const cloneNodes = clone.querySelectorAll('*');
            for (let i = 0; i < srcNodes.length; i++) {
                const cs = window.getComputedStyle(srcNodes[i]);
                let style = 'color:' + cs.color + ';background:transparent;';
                if (cs.fontWeight === '700' || cs.fontWeight === 'bold') { style += 'font-weight:bold;'; }
                if (cs.fontStyle === 'italic') { style += 'font-style:italic;'; }
                cloneNodes[i].setAttribute('style', style);
                cloneNodes[i].removeAttribute('class');
            }
            return clone.innerHTML;
        }

        function markDone(btn) {
            btn.textContent = 'Tersalin!';
            btn.classList.add('copied');
            setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
        }

        function legacyCopy(btn, plain, html) {
            // Fallback for file:// or older browsers: use a contenteditable + execCommand
            var holder = document.createElement('div');
            holder.setAttribute('contenteditable', 'true');
            holder.style.position = 'fixed';
            holder.style.left = '-9999px';
            holder.innerHTML = html;
            document.body.appendChild(holder);
            var range = document.createRange();
            range.selectNodeContents(holder);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            var ok = false;
            try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
            sel.removeAllRanges();
            document.body.removeChild(holder);
            if (ok) {
                markDone(btn);
            } else {
                btn.textContent = 'Copy manual (Ctrl+C)';
                setTimeout(function () { btn.textContent = 'Copy'; }, 2500);
            }
        }

        function copyCode(btn, id, label, path) {
            const code = document.getElementById(id);
            const plainHeader = label + '\n' + path + '\n\n';
            const plain = plainHeader + code.textContent;
            const header = '<div style="font-family:Consolas,\'Courier New\',monospace;'
                + 'background:transparent;"><span style="font-weight:bold;color:#000000;">'
                + label + '</span><br><span style="color:#000000;">' + path + '</span></div>';
            const body = '<div style="font-family:Consolas,\'Courier New\',monospace;font-size:12px;'
                + 'line-height:1.5;white-space:pre-wrap;background:transparent;">'
                + inlineStyles(code) + '</div>';
            const html = '<div style="background:transparent;">' + header + '<br>' + body + '</div>';

            if (navigator.clipboard && window.ClipboardItem) {
                try {
                    const item = new ClipboardItem({
                        'text/html': new Blob([html], { type: 'text/html' }),
                        'text/plain': new Blob([plain], { type: 'text/plain' }),
                    });
                    navigator.clipboard.write([item]).then(function () { markDone(btn); }).catch(function () {
                        legacyCopy(btn, plain, html);
                    });
                } catch (e) {
                    legacyCopy(btn, plain, html);
                }
            } else {
                legacyCopy(btn, plain, html);
            }
        }

        try {
            if (typeof hljs !== 'undefined') { hljs.highlightAll(); }
        } catch (e) { /* highlight.js unavailable — copy still works */ }
    </script>
</body>
</html>
HTMLEOF

  echo "$filename"
}

# Generate index
generate_index() {
  local items=""
  for i in "${!PAGES[@]}"; do
    IFS='|' read -r num title _ _ <<< "${PAGES[$i]}"
    local filename="${num}-$(echo "$title" | tr '[:upper:]' '[:lower:]' | sed 's/ (/_/g; s/)//g; s/ /-/g').html"

    local section=""
    case $num in
      01) section="LOGIN" ;;
      02) section="ADMINISTRATOR" ;;
      20) section="PENGELOLA" ;;
      28) section="PIMPINAN" ;;
    esac

    if [ -n "$section" ]; then
      items="${items}<li class=\"section-header\">${section}</li>"
    fi
    items="${items}<li><a href=\"${filename}\">${num}. ${title}</a></li>"
  done

  cat > "$OUTDIR/index.html" << HTMLEOF
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daftar Kode Sumber — Welmina Fitness Center</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; color: #1e293b; line-height: 1.6; padding: 2rem; max-width: 800px; margin: 0 auto; }
        h1 { font-size: 1.5rem; margin-bottom: 0.25rem; }
        .subtitle { color: #64748b; margin-bottom: 2rem; font-size: 0.9rem; }
        ul { list-style: none; }
        li { margin-bottom: 0.25rem; }
        li a { display: block; padding: 0.5rem 1rem; color: #1e293b; text-decoration: none; border-radius: 4px; font-size: 0.9rem; transition: background 0.2s; }
        li a:hover { background: #e2e8f0; }
        .section-header { font-weight: 700; font-size: 0.75rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; padding: 1rem 1rem 0.25rem; margin-top: 0.5rem; }
    </style>
</head>
<body>
    <h1>Daftar Kode Sumber</h1>
    <p class="subtitle">Sistem Informasi Inventaris Fitness Center Vicca Sera Polimak</p>
    <ul>
        ${items}
    </ul>
</body>
</html>
HTMLEOF
  echo "index.html"
}

echo "Generating index..."
generate_index

echo "Generating pages..."
for i in "${!PAGES[@]}"; do
  generate_page $i
done

echo "Done! Generated $TOTAL pages + index in $OUTDIR/"
