import time
import json
from urllib.parse import urljoin
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from bs4 import BeautifulSoup

def scrape_tum_programmes():
    """
    Scrapes TUM degree programmes from 12 pages.
    
    Each programme on the page is assumed to be represented by a pair of elements:
      - A <p class="roofline"> element containing the degree type (e.g. 
        "Master of Science (M.Sc.)" or "Bachelor of Science (B.Sc.)")
      - Followed by an <h3 class="h4"> element that contains the programme name.
         Optionally, an <a> tag within the h3 provides a detail URL.
    
    The function cycles through pages 1 to 12. Page 1 is loaded normally;
    for pages 2–12 we update the hash fragment via JavaScript.
    Finally, it groups programmes into bachelors and masters.
    """
    # Set up headless Chrome
    options = Options()
    options.headless = True
    driver = webdriver.Chrome(options=options)
    
    base_url = "https://www.tum.de"
    main_url = "https://www.tum.de/en/studies/degree-programs"
    
    all_programmes = []
    total_pages = 12

    # Load the main page once
    print("Loading main page...")
    driver.get(main_url)
    try:
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
    except TimeoutException:
        print("Timeout waiting for main page to load.")
        driver.quit()
        return {"bachelors": [], "masters": []}
    
    for page in range(1, total_pages + 1):
        if page == 1:
            url = main_url
            print(f"Processing page {page}: {url}")
        else:
            # Update the hash fragment instead of using driver.get()
            script = f"window.location.hash = 'page={page}';"
            driver.execute_script(script)
            print(f"Changed to page {page} using hash: {script}")
        
        # Wait for content to update
        time.sleep(3)
        
        soup = BeautifulSoup(driver.page_source, "html.parser")
        # Find all roofline elements (degree type)
        roofline_tags = soup.find_all("p", class_="roofline")
        print(f"Found {len(roofline_tags)} roofline elements on page {page}")
        
        for roof in roofline_tags:
            degree = roof.get_text(strip=True)
            # Look for the next <h3> element with class "h4" (the programme name)
            h3_tag = roof.find_next("h3", class_="h4")
            if h3_tag:
                # If an <a> tag is present inside the h3, extract its text and href
                a_tag = h3_tag.find("a")
                if a_tag:
                    programme_name = a_tag.get_text(strip=True)
                    href = a_tag.get("href")
                    detail_url = urljoin(base_url, href) if href else None
                else:
                    programme_name = h3_tag.get_text(strip=True)
                    detail_url = None
            else:
                programme_name = "Unknown Programme"
                detail_url = None
            
            programme_entry = {
                "programme": programme_name,
                "degree": degree,
                "detail_url": detail_url,
                "page": page
            }
            all_programmes.append(programme_entry)
    
    driver.quit()
    
    # Group programmes by degree type
    bachelor_programmes = [p for p in all_programmes if "Bachelor" in p["degree"]]
    master_programmes = [p for p in all_programmes if "Master" in p["degree"]]
    
    return {"bachelors": bachelor_programmes, "masters": master_programmes}

if __name__ == "__main__":
    data = scrape_tum_programmes()
    print("Total bachelor programmes found:", len(data["bachelors"]))
    print("Total master programmes found:", len(data["masters"]))
    with open("tum_programmes.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    print("Data has been written to tum_programmes.json")
