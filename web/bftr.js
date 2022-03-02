const getSelectedWebsite = () => {
    const selectElement = document.getElementById("available-websites");
    if (selectElement == null) {
        return "1377x";
    }
    return selectElement.value;
};

const createSelectOption = (optionValue) => {
    return '<option  value="' + optionValue + '">' + optionValue + "</option>";
};

const removeAllChildNodes = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
};

const getUploaderTag = (uploader) => {
    const className = "search-result-uploader";
    const icon = '<i class="las la-user"></i>';
    return '<div class="' + className + '">' + icon + uploader + "</div>";
};

const getSeedTag = (seeds) => {
    const className = "search-result-seeds";
    const icon = '<i class="search-result-seeds las la-seedling"></i>';
    return '<div class="' + className + '">' + icon + seeds + "</div>";
};

const getSizeTag = (size) => {
    const className = "search-result-size";
    const icon = '<i class="search-result-size las la-hdd"></i>';
    return '<div class="' + className + '">' + icon + size + "</div>";
};

const getNameTag = (name) => {
    const className = "search-result-name";
    return '<div class="' + className + '">' + name + "</div>";
};

const getDownloadTag = (relative_link) => {
    const onClickFunction = "eel.download(\"" +
        getSelectedWebsite() + "\", \"" + relative_link + "\")";
    const icon = '<i class="las la-download"></i>';
    return "<button onclick='" + onClickFunction + "'>" + icon + "</button>";
};

const onSubmit = async () => {
    const formData = new FormData(document.getElementById("search-form"));
    const searchTerm = formData.get("search-term");
    const website = formData.get("selected-website");
    const category = formData.get("selected-category");
    const jsonData = JSON.parse(
        await eel.get_json_data_from(website, searchTerm, category)()
    );
    displaySearchResults(jsonData);
};


/*
 *
 * const onWebsiteChange = () => {
 *     const website = getSelectedWebsite()
 *     const availableCategories = eel.get_available_categories_from(website);
 * }
 */


const displayAvailableWebsites = async () => {
    const availableWebsites = await eel.get_available_websites()();
    const availableWebsitesOptions = availableWebsites.map(
        (item) => createSelectOption(item)
    );
    let selectTag = '<select onchange="onWebsiteChange()"' +
        ' name="selected-website" id="available-websites">';
    for (let i = 0; i < availableWebsitesOptions.length; i++) {
        selectTag += availableWebsitesOptions[i];
    }
    selectTag += "</select>";
    const div = document.getElementById("website-category");
    div.insertAdjacentHTML("beforeend", selectTag);
};

const displayWebsiteCategories = async (website) => {
    const availableCategories =
        await eel.get_available_categories_from(website)();
    let selectTag = '<select id= "available-categories"' +
        ' name="selected-category">';
    for (let i = 0; i < availableCategories.length; i++) {
        selectTag += createSelectOption(availableCategories[i]);
    }
    selectTag += "</select>";
    const div = document.getElementById("website-category");
    div.insertAdjacentHTML("beforeend", selectTag);
};

const getDetailsTag = (jsonDataItem) => {
    let detailsTag = '<div class="detail-wrapper">'
    detailsTag += getSeedTag(jsonDataItem["seeds"]) +
        getSizeTag(jsonDataItem["size"]) +
        getUploaderTag(jsonDataItem["uploader"]) +
        getDownloadTag(jsonDataItem["relative link"]) + '</div>';
    return detailsTag;
}

const getSearchResultTag = (jsonDataItem) => {
    let searchResultTag = '<div class="search-result">';
    searchResultTag += getNameTag(jsonDataItem["name"]) +
        getDetailsTag(jsonDataItem);
    return searchResultTag
}

const displaySearchResults = (jsonData) => {
    const searchResultsTag = document.getElementById("search-results");
    const hasSearchResults = searchResultsTag.childNodes.length > 0;
    if (hasSearchResults) {
        removeAllChildNodes(searchResultsTag);
    }
    for (let i = 0; i < jsonData.length; i++) {
        searchResultsTag.insertAdjacentHTML(
            "beforeend", getSearchResultTag(jsonData[i])
        );
    }
};

displayAvailableWebsites();
displayWebsiteCategories(getSelectedWebsite());