from pathlib import Path
from playwright.sync_api import sync_playwright
import json, hashlib, tempfile, base64, mimetypes, shutil

ROOT = Path(__file__).resolve().parent
PDF = ROOT / 'assets/documents/Certificate-Claude-with-Anthropic-API.pdf'
EXPECTED_SOURCE_SHA256 = '4b54b582ca640ae3a639d592100836881dea52d4de49c79c1900846661397169'
FIXTURE = ROOT / 'test-fixtures/wallpaper-fixture.mp4'
REPORTS = ROOT / 'reports'
REPORTS.mkdir(exist_ok=True)
checks=[]
errors=[]
def ck(name, passed, detail=''):
    checks.append({'test': name, 'passed': bool(passed), 'detail': str(detail)})

# Bundle all local assets into the test page to verify the certificate without network.
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

data=PDF.read_bytes() if PDF.exists() else b''
ck('certificate_pdf_packaged',PDF.is_file() and PDF.stat().st_size>50000,f'{len(data)} bytes')
ck('certificate_pdf_signature',data.startswith(b'%PDF-') and data.rstrip().endswith(b'%%EOF'))
ck('certificate_pdf_matches_original_upload_sha256',hashlib.sha256(data).hexdigest()==EXPECTED_SOURCE_SHA256,f'sha256={hashlib.sha256(data).hexdigest()}')
ck('certificate_filename_is_clear',PDF.name=='Certificate-Claude-with-Anthropic-API.pdf',PDF.name)

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu'])
    page=browser.new_page(viewport={'width':1365,'height':768},accept_downloads=True)
    page.set_default_timeout(7000)
    page.route('https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/**',lambda route: route.fulfill(path=str(FIXTURE),content_type='video/mp4'))
    page.on('pageerror',lambda e: errors.append(str(e)))
    page.set_content(html,wait_until='load')
    ck('french_is_default',page.locator('html').get_attribute('lang')=='fr')
    page.locator('#boot-screen').click(); page.wait_for_timeout(220)
    about_icon=page.locator('[data-shortcut="about"]')
    about_icon.dblclick(); page.wait_for_timeout(100)
    about=page.locator('.window[data-window="about"]')
    teaser=about.locator('.credential-teaser')
    ck('about_teaser_visible_in_french',teaser.count()==1 and 'NOUVEAU' in teaser.inner_text() and 'Claude with the Anthropic API' in teaser.inner_text())
    ck('about_teaser_includes_completion_date','6 novembre 2026' in teaser.inner_text())
    teaser.locator('[data-action="education"]').click(); page.wait_for_timeout(100)
    edu=page.locator('.window[data-window="education"]')
    card=edu.locator('.certificate-card')
    ck('education_window_opens_from_about_teaser',edu.count()==1)
    ck('french_window_title_updated','Formation & certifications' in edu.locator('.window-title').inner_text())
    ck('french_certificate_title_correct','Claude with the Anthropic API' in card.inner_text())
    ck('french_course_title_correct','Building with the Claude API' in card.inner_text())
    ck('french_issuer_and_date_visible','ANTHROPIC EDUCATION' in card.inner_text() and '06 NOV. 2026' in edu.inner_text())
    ck('french_certificate_type_is_completion','Certificat de fin de formation' in card.inner_text())
    vlink=card.locator('.certificate-verify')
    ck('verification_link_exact',vlink.get_attribute('href')=='https://verify.skilljar.com/c/jshitiofo33z')
    ck('verification_link_opens_safely',vlink.get_attribute('target')=='_blank' and 'noopener' in (vlink.get_attribute('rel') or '') and 'noreferrer' in (vlink.get_attribute('rel') or ''))
    dl=card.locator('.certificate-download')
    ck('french_download_name',dl.get_attribute('download')=='Certificate-Claude-with-Anthropic-API.pdf')
    ck('french_download_href_targets_exact_asset',dl.get_attribute('href').startswith('data:application/pdf;base64,'))
    with page.expect_download(timeout=8000) as info:
        dl.click()
    item=info.value
    ck('french_download_filename',item.suggested_filename=='Certificate-Claude-with-Anthropic-API.pdf',item.suggested_filename)
    tmp=Path(tempfile.gettempdir())/'desk95-certificate-fr-download.pdf'
    item.save_as(tmp)
    got=tmp.read_bytes()
    ck('french_download_is_original_pdf',got==data and got.startswith(b'%PDF-'),f'{len(got)} bytes')
    tmp.unlink(missing_ok=True)
    page.screenshot(path=str(REPORTS/'desktop-certificate-fr.png'),full_page=False)

    # Language switch should rebuild open windows with the translated strings.
    page.locator('.language-button[data-lang="en"]').click(); page.wait_for_timeout(350)
    ck('english_lang_attribute',page.locator('html').get_attribute('lang')=='en')
    edu_en=page.locator('.window[data-window="education"]')
    card_en=edu_en.locator('.certificate-card')
    ck('english_education_heading','Education & certifications' in edu_en.inner_text())
    ck('english_window_title_updated','Education & certifications' in edu_en.locator('.window-title').inner_text())
    ck('english_certificate_completion_label','Certificate of completion' in card_en.inner_text())
    ck('english_course_title','Building with the Claude API' in card_en.inner_text())
    ck('english_download_label','Download certificate (PDF)' in card_en.inner_text())
    ck('english_verify_label','Verify certificate' in card_en.inner_text())
    page.screenshot(path=str(REPORTS/'desktop-certificate-en.png'),full_page=False)
    with page.expect_download(timeout=8000) as info2:
        card_en.locator('.certificate-download').click()
    item2=info2.value
    tmp2=Path(tempfile.gettempdir())/'desk95-certificate-en-download.pdf'
    item2.save_as(tmp2)
    ck('english_download_is_same_original_pdf',tmp2.read_bytes()==data and item2.suggested_filename=='Certificate-Claude-with-Anthropic-API.pdf')
    tmp2.unlink(missing_ok=True)
    page.locator('.language-button[data-lang="fr"]').click(); page.wait_for_timeout(100)
    ck('french_can_be_restored',page.locator('html').get_attribute('lang')=='fr')
    page.close()

    # Check the About teaser and the certificate card stay inside the window on varied screens.
    for vw,vh in [(320,568),(390,844),(820,1180),(1365,768)]:
        pg=browser.new_page(viewport={'width':vw,'height':vh},is_mobile=vw<=700,has_touch=vw<=700,accept_downloads=True)
        pg.set_default_timeout(6000)
        pg.route('https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/**',lambda route: route.fulfill(path=str(FIXTURE),content_type='video/mp4'))
        pg.on('pageerror',lambda e: errors.append(str(e)))
        pg.set_content(html,wait_until='load')
        pg.locator('#boot-screen').click(); pg.wait_for_timeout(160)
        about_icon2=pg.locator('[data-shortcut="about"]')
        if vw<=700:
            about_icon2.tap(); pg.wait_for_timeout(70); about_icon2.tap()
        else:
            about_icon2.dblclick()
        pg.wait_for_timeout(100)
        about2=pg.locator('.window[data-window="about"]')
        teaser2=about2.locator('.credential-teaser')
        ab=about2.bounding_box(); tb=teaser2.bounding_box()
        teaser_fit=bool(ab and tb and tb['x']>=ab['x']-1 and tb['x']+tb['width']<=ab['x']+ab['width']+1)
        ck(f'{vw}x{vh}_about_teaser_horizontal_fit',teaser_fit,str(tb))
        teaser2.locator('[data-action="education"]').click(); pg.wait_for_timeout(300)
        education2=pg.locator('.window[data-window="education"]')
        cert2=education2.locator('.certificate-card')
        eb=education2.bounding_box(); cb=cert2.bounding_box()
        card_fit=bool(eb and cb and cb['x']>=eb['x']-1 and cb['x']+cb['width']<=eb['x']+eb['width']+1)
        ck(f'{vw}x{vh}_certificate_card_horizontal_fit',card_fit,str(cb))
        button=cert2.locator('.certificate-download')
        bb=button.bounding_box()
        btn_fit=bool(cb and bb and bb['x']>=cb['x']-1 and bb['x']+bb['width']<=cb['x']+cb['width']+1)
        ck(f'{vw}x{vh}_certificate_download_button_fit',btn_fit,str(bb))
        if vw == 390:
            pg.screenshot(path=str(REPORTS/'mobile-certificate-fr.png'),full_page=False)
        if vw<=700:
            ck(f'{vw}x{vh}_certificate_page_scrollable',pg.locator('.window[data-window="education"] .window-body').evaluate('(el)=>el.scrollHeight > el.clientHeight'))
        pg.close()

    ck('no_javascript_errors',len(errors)==0,'; '.join(errors))
    browser.close()

passed=sum(c['passed'] for c in checks)
failed=len(checks)-passed
report={'version':'2.8','passed':passed,'failed':failed,'javascript_errors':errors,'certificate_sha256':hashlib.sha256(data).hexdigest(),'checks':checks}
(REPORTS/'certificate-validation-v2.8.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
if failed: raise SystemExit(1)
