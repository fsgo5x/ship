import eel
import tssx.navigation
import tssx.parser
import subprocess


@eel.expose
def get_available_websites():
    return ["1377x"]


@eel.expose
def get_available_categories_from(website):
    return {"1377x": tssx.navigation.tssx_get_available_categories}[website]()


@eel.expose
def get_json_data_from(website, search_term, category):
    if website == "1377x":
        return tssx.parser.tssx_page_to_json(
            tssx.navigation.tssx_search(search_term, category)
        )


@eel.expose
def download(website, relative_torrent_link):
    magnet_link = {"1377x": tssx.navigation.tssx_get_magnet_link}[website](
        relative_torrent_link
    )
    subprocess.run(["qbittorrent", magnet_link])


if __name__ == "__main__":
    eel.init("web")
    eel.start("main.html", mode="electron", cmdline_args=["web"], port=8686)
