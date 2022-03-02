const getSelectedWebsite = () => {
    const selectElement = document.getElementById("available-websites");
    if (selectElement == null) {
        return "1377x";
    }
    return selectElement.value;
};

/*
 * const onWebsiteChange = () => {
 *     const website = getSelectedWebsite()
 *     const availableCategories = eel.get_available_categories_from(website);
 * }
 */


const createSelectOption = (optionValue) => {
    return '<option  value="' + optionValue + '">' + optionValue + "</option>";
};

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
    console.log(relative_link, onClickFunction);
    const icon = '<i class="las la-download"></i>';
    return "<button onclick='" + onClickFunction + "'>" + icon + "</button>";
};

const displaySearchResults = (jsonData) => {
    const searchResultsTag = document.getElementById("search-results");
    const hasSearchResults = searchResultsTag.childNodes.length > 0;
    if (hasSearchResults) {
        removeAllChildNodes(searchResultsTag);
    }
    for (let i = 0; i < jsonData.length; i++) {
        let wrapperTag = '<div class="search-result">';
        let detailWrapperTag = '<div class="detail-wrapper">'
        detailWrapperTag += getSeedTag(jsonData[i]["seeds"]) +
            getSizeTag(jsonData[i]["size"]) +
            getUploaderTag(jsonData[i]["uploader"]) +
            getDownloadTag(jsonData[i]["relative link"]) +
            '</div>';
        wrapperTag += getNameTag(jsonData[i]["name"]) + detailWrapperTag;
        searchResultsTag.insertAdjacentHTML("beforeend", wrapperTag);
    }
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

displayAvailableWebsites();
displayWebsiteCategories(getSelectedWebsite());