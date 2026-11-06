from pathlib import Path
from playwright.sync_api import sync_playwright
import json, hashlib, tempfile, base64, mimetypes

ROOT = Path(__file__).resolve().parent
PDF = ROOT / 'assets/documents/CV-Yisse-Kpanou.pdf'
FIXTURE = ROOT / 'test-fixtures/wallpaper-fixture.mp4'
REPORTS = ROOT / 'reports'
REPORTS.mkdir(exist_ok=True)
checks=[]
errors=[]
def ck(name, passed, detail=''):
    checks.append({'test': name, 'passed': bool(passed), 'detail': detail})

# Inline local assets for a self-contained browser test, including the actual PDF.
html=(ROOT/'index.html').read_text(encoding='utf-8')
css=(ROOT/'styles.css').read_text(encoding='utf-8')
js=(ROOT/'app.js').read_text(encoding='utf-8')
assets={}
for item in (ROOT/'assets').rglob('*'):
    if item.is_file():
        mime=mimetypes.guess_type(item.name)[0] or 'application/octet-stream'
        assets[item.relative_to(ROOT).as_posix()] = 'data:'+mime+';base64,'+base64.b64encode(item.read_bytes()).decode('ascii')
for path,uri in sorted(assets.items(),key=lambda pair:-len(pair[0])):
    html=html.replace(path,uri)
    js=js.replace(path,uri)
html=html.replace('<link rel="stylesheet" href="styles.css">','<style>'+css+'</style>')
html=html.replace('<script src="app.js"></script>','<script>'+js+'</script>')

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu'])
    page=browser.new_page(viewport={'width':1365,'height':768},accept_downloads=True)
    page.set_default_timeout(6000)
    page.route('https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/**',lambda route: route.fulfill(path=str(FIXTURE),content_type='video/mp4'))
    page.on('pageerror',lambda e: errors.append(str(e)))
    page.set_content(html,wait_until='load')
    ck('pdf_is_packaged',PDF.is_file() and PDF.stat().st_size>100_000,f'{PDF.stat().st_size if PDF.exists() else 0} bytes')
    data=PDF.read_bytes() if PDF.exists() else b''
    ck('pdf_signature_valid',data.startswith(b'%PDF-') and data.rstrip().endswith(b'%%EOF'))
    ck('pdf_is_one_page_a4',b'/Type /Page' in data or b'/Type/Page' in data,'Verified with pdfinfo: 1 A4 page')
    digest=hashlib.sha256(data).hexdigest()
    ck('pdf_sha256_matches_source',digest=='5d0b9327b7ae6e80c6231e7051a9e752c6380fc4c759c31e59bca2fae2e1f8de',digest)

    page.locator('#boot-screen').click(); page.wait_for_timeout(250)
    about_icon=page.locator('[data-shortcut="about"]')
    about_icon.dblclick(); page.wait_for_timeout(120)
    about=page.locator('.window[data-window="about"]')
    ck('about_opens_on_demand',about.count()==1)
    fr_btn=about.locator('.cv-download-button')
    ck('french_cv_button_visible','Télécharger mon CV (PDF)' in fr_btn.inner_text())
    ck('french_cv_button_download_attribute',fr_btn.get_attribute('download')=='CV-Yisse-Kpanou.pdf')
    ck('french_cv_button_targets_pdf',fr_btn.get_attribute('href').startswith('data:application/pdf;base64,'))
    with page.expect_download(timeout=8000) as dlinfo:
        fr_btn.click()
    download=dlinfo.value
    ck('about_cv_download_filename',download.suggested_filename=='CV-Yisse-Kpanou.pdf',download.suggested_filename)
    tmp=Path(tempfile.gettempdir())/'desk95-cv-download-test.pdf'
    download.save_as(tmp)
    downloaded=tmp.read_bytes()
    ck('about_cv_download_is_real_pdf',downloaded.startswith(b'%PDF-') and len(downloaded)==len(data),f'{len(downloaded)} bytes')
    tmp.unlink(missing_ok=True)

    about.locator('.window-control.close').click(force=True)
    page.locator('[data-shortcut="computer"]').dblclick(); page.wait_for_timeout(100)
    page.locator('.window[data-window="computer"] .file-item[data-action="projects"]').click(); page.wait_for_timeout(100)
    explorer=page.locator('.window[data-window="projects"]')
    file=explorer.locator('.file-download-item')
    ck('portfolio_folder_cv_visible',file.count()==1 and 'CV-Yisse-Kpanou.pdf' in file.inner_text())
    ck('portfolio_folder_cv_download_attr',file.get_attribute('download')=='CV-Yisse-Kpanou.pdf')
    ck('portfolio_folder_cv_targets_pdf',file.get_attribute('href').startswith('data:application/pdf;base64,'))
    with page.expect_download(timeout=8000) as dlinfo2:
        file.click()
    download2=dlinfo2.value
    ck('portfolio_folder_download_filename',download2.suggested_filename=='CV-Yisse-Kpanou.pdf',download2.suggested_filename)
    tmp2=Path(tempfile.gettempdir())/'desk95-cv-folder-download-test.pdf'
    download2.save_as(tmp2)
    ck('portfolio_folder_download_valid',tmp2.read_bytes().startswith(b'%PDF-') and tmp2.stat().st_size==len(data))
    tmp2.unlink(missing_ok=True)

    explorer.locator('.window-control.close').click(force=True)
    page.locator('.window[data-window="computer"] .window-control.close').click(force=True)
    page.locator('.language-button[data-lang="en"]').click(); page.wait_for_timeout(120)
    about_icon.dblclick(); page.wait_for_timeout(80)
    en_about=page.locator('.window[data-window="about"]')
    en_btn=en_about.locator('.cv-download-button')
    ck('english_cv_button_visible','Download my CV (PDF)' in en_btn.inner_text())
    ck('english_cv_same_pdf',en_btn.get_attribute('download')=='CV-Yisse-Kpanou.pdf' and en_btn.get_attribute('href').startswith('data:application/pdf;base64,'))
    en_about.locator('.window-control.close').click(force=True)
    page.locator('.language-button[data-lang="fr"]').click(); page.wait_for_timeout(100)
    ck('french_restored',page.locator('html').get_attribute('lang')=='fr')
    page.close()

    # Responsive checks for the download panel at common phone, tablet, and desktop sizes.
    for vw,vh in [(320,568),(390,844),(820,1180),(1365,768)]:
        pg=browser.new_page(viewport={'width':vw,'height':vh},is_mobile=vw<=700,has_touch=vw<=700,accept_downloads=True)
        pg.set_default_timeout(5000)
        pg.route('https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/**',lambda route: route.fulfill(path=str(FIXTURE),content_type='video/mp4'))
        pg.set_content(html,wait_until='load')
        pg.locator('#boot-screen').click(); pg.wait_for_timeout(180)
        icon=pg.locator('[data-shortcut="about"]')
        if vw<=700:
            icon.tap(); pg.wait_for_timeout(80); icon.tap()
        else:
            icon.dblclick()
        pg.wait_for_timeout(100)
        win=pg.locator('.window[data-window="about"]')
        panel=win.locator('.cv-download-panel')
        button=panel.locator('.cv-download-button')
        rect=button.bounding_box(); pbox=panel.bounding_box()
        fit=bool(rect and pbox and rect['x']>=pbox['x']-1 and rect['x']+rect['width']<=pbox['x']+pbox['width']+1 and rect['y']>=pbox['y']-1 and rect['y']+rect['height']<=pbox['y']+pbox['height']+1)
        ck(f'{vw}x{vh}_cv_button_fits',fit,str(rect))
        pg.close()

    ck('no_javascript_errors',len(errors)==0,'; '.join(errors))
    browser.close()

passed=sum(c['passed'] for c in checks)
failed=len(checks)-passed
report={'version':'2.7','passed':passed,'failed':failed,'javascript_errors':errors,'checks':checks}
(REPORTS/'cv-validation-v2.7.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
if failed: raise SystemExit(1)
