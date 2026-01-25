import asyncio
import sys
import json
import os
from playwright.async_api import async_playwright

async def scrape_and_generate_pdf(url: str, output_pdf_path: str):
    html_content = ""
    all_css_content = ""
    pdf_generated = False
    
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()

            # Listen for CSS responses
            css_responses = []
            # Intercept all requests to get CSS content
            page.on("response", lambda response: asyncio.create_task(process_response(response, css_responses)))

            await page.goto(url, wait_until="networkidle")

            # Extract full HTML
            html_content = await page.content()

            # Extract CSS from <style> tags
            inline_styles = await page.evaluate('''
                Array.from(document.querySelectorAll('style')).map(style => style.textContent)
            ''')
            all_css_content += "\n".join(inline_styles)

            # Wait for all CSS responses to be processed
            # This is a bit tricky, need to ensure all CSS responses are captured
            # before moving on. For simplicity, we'll wait for a short period.
            await asyncio.sleep(2) # Give some time for network responses to be processed

            # Combine all CSS content
            for css_text in css_responses:
                all_css_content += "\n" + css_text

            # Generate PDF
            # Ensure the directory for the PDF exists
            os.makedirs(os.path.dirname(output_pdf_path), exist_ok=True)
            await page.pdf(
                path=output_pdf_path,
                format="A4",
                print_background=True,
                margin={"top": "1cm", "right": "1cm", "bottom": "1cm", "left": "1cm"}
            )
            pdf_generated = True

            await browser.close()

    except Exception as e:
        print(f"Error during scraping: {e}", file=sys.stderr)

    # Output results as JSON
    output = {
        "url": url,
        "html_content": html_content,
        "css_content": all_css_content,
        "pdf_path": os.path.abspath(output_pdf_path) if pdf_generated else None,
        "success": pdf_generated and html_content != ""
    }
    print(json.dumps(output))

async def process_response(response, css_responses):
    # Only process successful CSS responses
    if response.ok and "text/css" in response.headers.get("content-type", ""):
        try:
            css_responses.append(await response.text())
        except Exception as e:
            print(f"Warning: Could not get text from CSS response ({response.url}): {e}", file=sys.stderr)


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python playwright_scraper.py <url> <output_pdf_path>", file=sys.stderr)
        sys.exit(1)
    
    target_url = sys.argv[1]
    pdf_output_path = sys.argv[2]
    
    asyncio.run(scrape_and_generate_pdf(target_url, pdf_output_path))
