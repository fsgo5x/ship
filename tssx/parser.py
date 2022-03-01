import lxml.html
import json
import eel

_COLL_TO_NAME = {
    "coll-2": "seeds",
    "coll-3": "leeches",
    "coll-date": "date created",
    "coll-4": "size",
    "coll-5": "uploader",
}


def _get_element_text(element):
    return element.text


def _get_table_uploader(coll5element):
    return coll5element.getchildren()[0].text


def _content_of_coll(coll, collelement):
    return {
        "coll-2": _get_element_text,
        "coll-3": _get_element_text,
        "coll-date": _get_element_text,
        "coll-4": _get_element_text,
        "coll-5": _get_table_uploader,
    }[coll](collelement)


def _get_table_relative_link(coll1element):
    for a_tag in coll1element.getchildren():
        if a_tag.get("class") == None:
            return a_tag.get("href")
    return None


def _get_table_name(coll1element):
    for a_tag in coll1element.getchildren():
        if a_tag.get("class") == None:
            return a_tag.text
    return None


def _has_valid_info_keys(torrent_info):
    keys_that_should_be_included = [
        "name",
        "relative link",
        "seeds",
        "leeches",
        "date created",
        "size",
        "uploader",
    ]
    return keys_that_should_be_included == list(torrent_info.keys())


def _has_valid_info_value_type(torrent_info):
    return all(isinstance(item, str) for item in torrent_info.values())


def is_valid_info(torrent_info):
    torrent_info_key_are_valid = _has_valid_info_keys(torrent_info)
    values_have_valid_type = _has_valid_info_value_type(torrent_info)
    if not torrent_info_key_are_valid:
        raise Exception(f"Torrent info data keys are not valid")
    if not values_have_valid_type:
        raise Exception(f"Torrent info data values have invalid types")


def from_tssx_tr_tag(tssx_tr_tag):
    torrent_info_data = {}
    for element in tssx_tr_tag.getchildren():
        element_coll = element.get("class").split()[0]
        if element_coll == "coll-1":
            torrent_info_data["name"] = _get_table_name(element)
            torrent_info_data["relative link"] = _get_table_relative_link(
                element
            )
        else:
            element_content = _content_of_coll(
                element_coll, element)
            torrent_info_data[_COLL_TO_NAME[element_coll]
                              ] = element_content
    is_valid_info(torrent_info_data)
    return torrent_info_data


@eel.expose
def tssx_page_to_json(tssx_page):
    result = []
    tbody_tag_xpath = "/html/body/main/div/div/div/div[2]/div[1]/table/tbody"
    tbodys = lxml.html.fromstring(tssx_page).xpath(
        tbody_tag_xpath)[0].getchildren()
    if len(tbodys) < 1:
        return None
    for tr_tag in tbodys:
        result.append(from_tssx_tr_tag(tr_tag))
    return json.dumps(result)
