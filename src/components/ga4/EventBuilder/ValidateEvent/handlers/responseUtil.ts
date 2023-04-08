const API_DOC_EVENT_URL = 'https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#'

export const formatErrorMessages = (errors) => {
    const formattedErrors = errors.map(error => {
        if (error.description.endsWith('can have at most [10] custom params.')) {
            error['description'] = 'Item array has invalid key'
            
            return error
        }

        return error

    })

    const documentedErrors = formattedErrors.map(error => {
        error['documentation'] = addDocumentation(error)
        return error
    })

    return documentedErrors
}

// add documentation based on fieldPath
const addDocumentation = (error) => {
    if (error) {
        return API_DOC_EVENT_URL
    }

    return API_DOC_EVENT_URL
}