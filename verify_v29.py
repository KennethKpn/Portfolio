from pathlib import Path
from playwright.sync_api import sync_playwright
import json, hashlib, tempfile, base64, mimetypes

ROOT = Path(__file__).resolve().parent
PDF = ROOT / "assets/documents/Certificate-Claude-with-Anthropic-API.pdf"
EXPECTED_SOURCE_SHA256 = "4b54b582ca640ae3a639d592100836881dea52d4de49c79c1900846661397169"
FIXTURE = ROOT / "test-fixtures/wallpaper-fixture.mp4"
REPORTS = ROOT / "reports"
REPORTS.mkdir(exist_ok=True)
AI_VERIFY = "https://academy.claude.com/verify/c4e4cc5f3d7dda4bae246fa4e00eca71"
API_VERIFY = "https://academy.claude.com/verify/e6d6cacb0bd49e296d1863c3aefb28bb"
SKILLJAR_VERIFY = "https://verify.skilljar.com/c/jshitiofo33z"
checks, errors = [], []

def ck(name, passed, detail=""):
    checks.append({"test": name, "passed": bool(passed), "detail": str(detail)})

html = (ROOT / "index.html").read_text(encoding="utf-8")
css = (ROOT / "styles.css").read_text(encoding="utf-8")
js = (ROOT / "app.js").read_text(encoding="utf-8")
assets = {}
for item in (ROOT / "assets").rglob("*"):
    if item.is_file():
        mime = mimetypes.guess_type(item.name)[0] or "application/octet-stream"
        assets[item.relative_to(ROOT).as_posix()] = "data:" + mime + ";base64," + base64.b64encode(item.read_bytes()).decode("ascii")
for path, uri in sorted(assets.items(), key=lambda pair: -len(pair[0])):
    html = html.replace(path, uri)
    js = js.replace(path, uri)
html = html.replace('<link rel="stylesheet" href="styles.css">', "<style>" + css + "</style>")
html = html.replace('<script src="app.js"></script>', "<script>" + js + "</script>")

data = PDF.read_bytes() if PDF.exists() else b""
ck("existing_anthropic_pdf_available", PDF.is_file() and len(data) > 50000, f"{len(data)} bytes")
ck("existing_anthropic_pdf_signature", data.startswith(b"%PDF-") and data.rstrip().endswith(b"%%EOF"))
ck("existing_anthropic_pdf_sha256_preserved", hashlib.sha256(data).hexdigest() == EXPECTED_SOURCE_SHA256)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path="/usr/bin/chromium", args=["--no-sandbox", "--disable-gpu"])
    page = browser.new_page(viewport={"width": 1365, "height": 768}, accept_downloads=True)
    page.set_default_timeout(7000)
    page.route("https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/**", lambda route: route.fulfill(path=str(FIXTURE), content_type="video/mp4"))
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.set_content(html, wait_until="load")
    ck("french_is_default", page.locator("html").get_attribute("lang") == "fr")
    page.locator("#boot-screen").click()
    page.wait_for_timeout(220)
    page.locator('[data-shortcut="about"]').dblclick()
    page.wait_for_timeout(100)
    teaser = page.locator('.window[data-window="about"] .credential-teaser')
    ck("about_teaser_mentions_three_credentials", "1 certificat + 2 badges de complétion" in teaser.inner_text())
    teaser.locator('[data-action="education"]').click()
    page.wait_for_timeout(100)
    edu = page.locator('.window[data-window="education"]')
    cards = edu.locator(".certificate-card")
    ck("education_window_opens", edu.count() == 1)
    ck("three_credentials_rendered", cards.count() == 3, f"count={cards.count()}")
    ck("french_education_heading", "Formation & certifications" in edu.inner_text())
    cert = edu.locator('[data-credential-id="anthropic-api-certificate"]')
    ai = edu.locator('[data-credential-id="claude-academy-ai-capabilities"]')
    api = edu.locator('[data-credential-id="claude-academy-building-claude-api"]')
    ck("anthropic_certificate_type_clear", "CERTIFICAT" in cert.inner_text() and "Certificate of completion" not in cert.inner_text())
    ck("anthropic_skilljar_link_exact", cert.locator(".certificate-verify").get_attribute("href") == SKILLJAR_VERIFY)
    ck("ai_badge_title_and_type", "AI capabilities and limitations" in ai.inner_text() and "BADGE DE COMPLÉTION" in ai.inner_text())
    ck("ai_badge_link_exact", ai.locator(".certificate-verify").get_attribute("href") == AI_VERIFY)
    ck("api_badge_title_and_type", "Building with the Claude API" in api.inner_text() and "BADGE DE COMPLÉTION" in api.inner_text())
    ck("api_badge_link_exact", api.locator(".certificate-verify").get_attribute("href") == API_VERIFY)
    for name, locator in [("skilljar", cert.locator(".certificate-verify")), ("ai", ai.locator(".certificate-verify")), ("api", api.locator(".certificate-verify"))]:
        ck(f"{name}_link_safe_external", locator.get_attribute("target") == "_blank" and "noopener" in (locator.get_attribute("rel") or "") and "noreferrer" in (locator.get_attribute("rel") or ""))
    with page.expect_download(timeout=8000) as info:
        cert.locator(".certificate-download").click()
    download = info.value
    tmp = Path(tempfile.gettempdir()) / "desk95-v29-anthropic-certificate.pdf"
    download.save_as(tmp)
    ck("anthropic_pdf_download_unchanged", tmp.read_bytes() == data and download.suggested_filename == "Certificate-Claude-with-Anthropic-API.pdf")
    tmp.unlink(missing_ok=True)
    page.screenshot(path=str(REPORTS / "desktop-credentials-fr.png"), full_page=False)

    page.locator('.language-button[data-lang="en"]').click()
    page.wait_for_timeout(350)
    edu_en = page.locator('.window[data-window="education"]')
    cards_en = edu_en.locator(".certificate-card")
    ck("english_education_heading", "Education & certifications" in edu_en.inner_text())
    ck("english_three_credentials_rendered", cards_en.count() == 3)
    ck("english_ai_badge_visible", "AI capabilities and limitations" in edu_en.inner_text() and "COMPLETION BADGE" in edu_en.inner_text())
    ck("english_api_badge_visible", "Building with the Claude API" in edu_en.inner_text())
    ck("english_verify_actions_visible", "Verify badge" in edu_en.inner_text() and "Verify certificate" in edu_en.inner_text())
    page.screenshot(path=str(REPORTS / "desktop-credentials-en.png"), full_page=False)
    page.close()

    for vw, vh in [(320, 568), (390, 844), (820, 1180), (1365, 768)]:
        pg = browser.new_page(viewport={"width": vw, "height": vh}, is_mobile=vw <= 700, has_touch=vw <= 700)
        pg.set_default_timeout(6000)
        pg.route("https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/**", lambda route: route.fulfill(path=str(FIXTURE), content_type="video/mp4"))
        pg.on("pageerror", lambda e: errors.append(str(e)))
        pg.set_content(html, wait_until="load")
        pg.locator("#boot-screen").click()
        pg.wait_for_timeout(150)
        icon = pg.locator('[data-shortcut="about"]')
        if vw <= 700:
            icon.tap(); pg.wait_for_timeout(70); icon.tap()
        else:
            icon.dblclick()
        pg.wait_for_timeout(100)
        teaser = pg.locator('.window[data-window="about"] .credential-teaser')
        teaser.locator('[data-action="education"]').click()
        pg.wait_for_timeout(250)
        edu = pg.locator('.window[data-window="education"]')
        card_nodes = edu.locator(".certificate-card")
        for idx in range(card_nodes.count()):
            eb, cb = edu.bounding_box(), card_nodes.nth(idx).bounding_box()
            fits = bool(eb and cb and cb["x"] >= eb["x"] - 1 and cb["x"] + cb["width"] <= eb["x"] + eb["width"] + 1)
            ck(f"{vw}x{vh}_credential_{idx+1}_horizontal_fit", fits, str(cb))
        if vw <= 700:
            ck(f"{vw}x{vh}_education_scrollable", edu.locator(".window-body").evaluate("(el) => el.scrollHeight > el.clientHeight"))
        if vw == 390:
            pg.screenshot(path=str(REPORTS / "mobile-credentials-fr.png"), full_page=False)
        pg.close()

    ck("no_javascript_errors", len(errors) == 0, "; ".join(errors))
    browser.close()

passed = sum(c["passed"] for c in checks)
failed = len(checks) - passed
report = {"version":"2.9","passed":passed,"failed":failed,"javascript_errors":errors,"certificate_sha256":hashlib.sha256(data).hexdigest(),"checks":checks}
(REPORTS / "credential-validation-v2.9.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
print(json.dumps(report, ensure_ascii=False, indent=2))
if failed:
    raise SystemExit(1)
