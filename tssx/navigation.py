import lxml.html
import eel
import requests
import base64


_UNSUCCESSFUL_TSSX_REQUEST_EXCEPTION = Exception(
    "1377x Request was not successfull")

_NOT_A_VALID_TSSX_CATEGORY_EXCEPTION = Exception("Got invalid tssx category")


@eel.expose
def tssx_get_available_categories():
    return [
        "all categories",
        "movies",
        "tv",
        "games",
        "music",
        "applications",
        "documentaries",
        "anime",
    ]


def _fetch_page_content(url):
    server_response = requests.get(url)
    if server_response.status_code != 200:
        raise _UNSUCCESSFUL_TSSX_REQUEST_EXCEPTION
    return server_response.content


@eel.expose
def tssx_search(search_term, category="all categories", page_number=1):
    default_search_term = f"https://www.1377x.to/search/{search_term}/{page_number}/"
    categorized_search_term = (
        f"https://www.1377x.to/category-search/{search_term}/{category}/{page_number}/"
    )
    page_content = ""
    if category not in tssx_get_available_categories():
        raise _NOT_A_VALID_TSSX_CATEGORY_EXCEPTION
    if category != "all categories":
        page_content = _fetch_page_content(categorized_search_term)
    else:
        page_content = _fetch_page_content(default_search_term)
    return page_content


@eel.expose
def tssx_get_magnet_link(relative_torrent_link):
    magnet_link_xpath = "/html/body/main/div/div/div/div[2]/div[1]/ul[1]/li[1]/a"
    tssx_response = requests.get(
        f"https://www.1377x.to{relative_torrent_link}")
    if tssx_response.status_code != 200:
        raise _UNSUCCESSFUL_TSSX_REQUEST_EXCEPTION
    return (
        lxml.html.fromstring(tssx_response.content)
        .xpath(magnet_link_xpath)[0]
        .get("href")
    )


def _get_number_of_pages(tssx_page):
    pagination_xpath = "/html/body/main/div/div/div/div[2]/div[2]/ul"
    pages = lxml.html.fromstring(tssx_page).xpath(pagination_xpath)
    if len(pages) < 1:
        return 1
    return len(pages[0].getchildren()) - 1


def _get_active_page_number(tssx_page):
    pagination_xpath = "/html/body/main/div/div/div/div[2]/div[2]/ul"
    pages = lxml.html.fromstring(tssx_page).xpath(pagination_xpath)
    if len(pages) < 1:
        return 1
    return pages[0].cssselect(".active")[0].getchildren()[0].text
