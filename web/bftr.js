const getSelectedWebsite = () => {
    const selectElement = document.getElementById('available-websites')
    if (selectElement == null) {
        return '1377x'
    }
    return selectElement.value
}

const onWebsiteChange = () => {
    const website = getSelectedWebsite()
    const availableCategories = eel.get_available_categories_from(website);
}

const createSelectOption = (optionValue) => {
    return "<option  value=\"" + optionValue + "\">" + optionValue + "</option>"
}

const displayAvailableWebsites = (availableWebsites) => {
    const availableWebsitesOptions = availableWebsites.map(item => createSelectOption(item))
    let selectTag = "<select onchange=\"onWebsiteChange()\" name=\"selected-website\" id=\"available-websites\">"
    for (let i = 0; i < availableWebsitesOptions.length; i++) {
        selectTag += availableWebsitesOptions[i]
    }
    selectTag += "</select>"
    const div = document.getElementById("website-category")
    div.insertAdjacentHTML('beforeend', selectTag)
}

const displayWebsiteCategories = async (website) => {
    const availableCategories = await eel.get_available_categories_from(website)()
    let selectTag = "<select id= \"available-categories\" name=\"selected-category\">"
    for (let i = 0; i < availableCategories.length; i++) {
        selectTag += createSelectOption(availableCategories[i])
    }
    selectTag += "</select>"
    const div = document.getElementById("website-category")
    div.insertAdjacentHTML("beforeend", selectTag)
}

const removeAllChildNodes = (parent) => {
    while(parent.firstChild) {
        parent.removeChild(parent.firstChild)
    }
}

const displaySearchResults = (jsonData) => {
    const tagToInsert = document.getElementById('search-results')
    if (tagToInsert.childNodes.length > 0) {
        removeAllChildNodes(tagToInsert)
    }
    for (let i = 0; i < jsonData.length; i++) {
        let wrapperTag = "<div class=\"search-result\">";
        const nameTag = "<div class=\"search-result-name\">" + jsonData[i]['name'] + "</div>"
        const uploaderTag = "<div class=\"serach-result-uploader\"><i class=\"las la-user\"></i>" + jsonData[i]['uploader'].toLowerCase() + "</div>"
        const seedTag = "<div><i class=\"search-result-seeds las la-seedling\"></i>" + jsonData[i]["seeds"] + "</div>"
        const sizeTag = "<div><i class=\"search-result-size las la-hdd\"></i>" + jsonData[i]["size"] + "</div>"
        const downloadTag = "<button onclick='eel.download(\""+ getSelectedWebsite()+"\", \"" + jsonData[i]['relative link'] + "\")'><i class=\"las la-download\"></i></button>"
        wrapperTag += nameTag + seedTag + sizeTag + uploaderTag + downloadTag
        tagToInsert.insertAdjacentHTML('beforeend', wrapperTag)
    }
}

const onSubmit = async () => {
    const formData = new FormData(document.getElementById('search-form'))
    const searchTerm = formData.get('search-term')
    const website = formData.get('selected-website')
    const category = formData.get('selected-category')
    const jsonData = JSON.parse(await eel.get_json_data_from(website, searchTerm, category)())
    displaySearchResults(jsonData)
}

eel.get_available_websites()().then(availableWebsites => displayAvailableWebsites(availableWebsites))
displayWebsiteCategories(getSelectedWebsite())