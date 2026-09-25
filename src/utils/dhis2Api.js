/**
 * Response and payload helpers that stay compatible from DHIS2 2.40 through 2.43.1.0.
 */

export const extractCollection = (payload, key) => {
    if (!payload) {
        return []
    }
    if (Array.isArray(payload)) {
        return payload
    }
    if (Array.isArray(payload[key])) {
        return payload[key]
    }
    if (payload[key] && Array.isArray(payload[key][key])) {
        return payload[key][key]
    }
    return []
}

export const extractDataValues = (payload) => extractCollection(payload, 'dataValues')

export const extractCompleteRegistrations = (payload) =>
    extractCollection(payload, 'completeDataSetRegistrations')

export const getUsername = (user) =>
    user?.username || user?.userCredentials?.username || undefined

export const buildCompleteRegistration = ({ dataSet, period, organisationUnit, storedBy }) => ({
    dataSet,
    period,
    organisationUnit,
    storedBy,
    completed: true,
})
