from pathlib import Path
from playwright.sync_api import sync_playwright
import base64,mimetypes,json
root=Path(__file__).resolve().parent
html=(root/'index.html').read_text(encoding='utf-8'); css=(root/'styles.css').read_text(encoding='utf-8'); js=(root/'app.js').read_text(encoding='utf-8')
for f in (root/'assets').rglob('*'):
    if f.is_file():
        uri='data:'+(mimetypes.guess_type(f.name)[0] or 'application/octet-stream')+';base64,'+base64.b64encode(f.read_bytes()).decode()
        html=html.replace(f.relative_to(root).as_posix(),uri); js=js.replace(f.relative_to(root).as_posix(),uri)
html=html.replace('<link rel="stylesheet" href="styles.css">','<style>'+css+'</style>').replace('<script src="app.js"></script>','<script>'+js+'</script>')
results=[]; errors=[]
def ck(name,val): results.append((name,bool(val)))
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu'])
    for vw,vh in [(1365,768),(1024,768),(390,844),(320,568)]:
        pg=browser.new_page(viewport={'width':vw,'height':vh},device_scale_factor=1,is_mobile=vw<=700,has_touch=vw<=700)
        pg.set_default_timeout(4000)
        pg.route('https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/**', lambda route: route.fulfill(path=str(root/'test-fixtures/wallpaper-fixture.mp4'),content_type='video/mp4'))
        pg.on('pageerror',lambda e: errors.append(str(e)))
        pg.set_content(html,wait_until='load')
        video=pg.locator('#desktop-wallpaper-video')
        ck(f'{vw}x{vh}_video_lazy',video.get_attribute('src') is None and '202606021731-e_hqa6sn.mp4' in (video.get_attribute('data-src') or ''))
        pg.locator('#boot-screen').click(); pg.wait_for_timeout(550)
        ck(f'{vw}x{vh}_no_auto_about',pg.locator('.window[data-window="about"]').count()==0)
        about_icon=pg.locator('[data-shortcut="about"]'); ck(f'{vw}x{vh}_about_icon_present',about_icon.count()==1)
        layer=pg.locator('#desktop-icon-layer').bounding_box(); boxes=[x.bounding_box() for x in pg.locator('#desktop-icon-layer .shortcut').all()]
        ck(f'{vw}x{vh}_icons_fit',bool(layer) and all(r and r['x']>=layer['x']-1 and r['y']>=layer['y']-1 and r['x']+r['width']<=layer['x']+layer['width']+1 and r['y']+r['height']<=layer['y']+layer['height']+1 for r in boxes))
        if vw<=700: about_icon.tap(); about_icon.tap()
        else: about_icon.dblclick()
        pg.wait_for_timeout(100); about=pg.locator('.window[data-window="about"]'); ck(f'{vw}x{vh}_about_opens_on_demand',about.count()==1)
        if about.count():
            txt=about.inner_text(); ck(f'{vw}x{vh}_about_identity','KPANOU Kenneth' in txt)
            about.locator('.window-control.close').click(force=True)
        pg.locator('[data-shortcut="unyvon"]').dblclick() if vw>700 else (pg.locator('[data-shortcut="unyvon"]').tap(),pg.locator('[data-shortcut="unyvon"]').tap())
        pg.wait_for_timeout(100); ck(f'{vw}x{vh}_unyvon_opens',pg.locator('.window[data-window="unyvon"]').count()==1)
        pg.close()
    # language / requested UX behavior on a clean desktop
    pg=browser.new_page(viewport={'width':1365,'height':768}); pg.set_default_timeout(5000); pg.set_content(html,wait_until='load'); pg.locator('#boot-screen').click(); pg.wait_for_timeout(500)
    ck('french_default',pg.locator('html').get_attribute('lang')=='fr' and pg.locator('.language-button[data-lang="fr"]').count()==1)
    pg.locator('[data-shortcut="about"]').dblclick(); pg.wait_for_timeout(80); pg.locator('.window[data-window="about"] .close').click(force=True)
    pg.locator('.language-button[data-lang="en"]').click(); pg.wait_for_timeout(120)
    ck('english_lang_active',pg.locator('html').get_attribute('lang')=='en' and 'EN' in pg.locator('.language-button.active').inner_text())
    pg.locator('[data-shortcut="about"]').dblclick(); pg.wait_for_timeout(80); en=pg.locator('.window[data-window="about"]'); t=en.inner_text(); ck('english_about','Hello, welcome to my digital corner' in t and 'Mes compétences' not in t); en.locator('.close').click(force=True)
    pg.locator('[data-shortcut="unyvon"]').dblclick(); pg.wait_for_timeout(80); u=pg.locator('.window[data-window="unyvon"]'); ut=u.inner_text(); ck('english_unyvon','An operational management system' in ut and 'Vue d’ensemble' not in ut); u.locator('.close').click(force=True)
    pg.locator('.language-button[data-lang="fr"]').click(); pg.wait_for_timeout(100); ck('french_restored',pg.locator('html').get_attribute('lang')=='fr')
    pg.close(); browser.close()
print(json.dumps({'passed':sum(v for _,v in results),'failed':sum(not v for _,v in results),'errors':errors,'results':[{'test':n,'pass':v} for n,v in results]},ensure_ascii=False,indent=2))
