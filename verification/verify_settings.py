from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("file:///app/index.html")
        page.wait_for_selector(".ui__prefs")

        # Click the settings button to show preferences
        page.click(".btn--prefs")

        # Wait for the animation or display
        page.wait_for_timeout(1000)

        # Take a screenshot of the settings
        page.screenshot(path="verification/settings.png")
        browser.close()

if __name__ == "__main__":
    run()
