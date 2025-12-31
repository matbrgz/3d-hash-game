from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        # Open the index.html file
        page.goto("file:///app/index.html")
        # Wait for the title to appear
        page.wait_for_selector(".text--title")
        # Take a screenshot
        page.screenshot(path="verification/screenshot.png")
        browser.close()

if __name__ == "__main__":
    run()
