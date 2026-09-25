/**
 * DHIS2 version helpers for 2.40 through 2.43.1.0, including SNAPSHOT builds.
 *
 * Handles strings like:
 *  2.40, 2.40.0, 2.40.1, 2.40-SNAPSHOT, 2.40.0-SNAPSHOT
 *  2.41-SNAPSHOT, 2.42.0.1, 2.43.1.0, 2.43.1.0-SNAPSHOT
 */

export const MIN_SUPPORTED_DHIS2_VERSION = '2.40'
export const MAX_SUPPORTED_DHIS2_VERSION = '2.43.1.0'
export const SUPPORTED_DHIS2_RANGE_LABEL = '2.40 through 2.43.1.0 (including SNAPSHOT builds)'

const parseIntOrZero = (value) => {
    const parsed = parseInt(value, 10)
    return Number.isFinite(parsed) ? parsed : 0
}

export const parseDhis2Version = (versionInput) => {
    if (!versionInput) {
        return null
    }

    if (typeof versionInput === 'object') {
        const full = versionInput.full || ''
        const tag = versionInput.tag || (full.includes('-') ? full.split('-').slice(1).join('-') : '')
        const extra = typeof full === 'string' ? full.split('-')[0]?.split('.') || [] : []
        return {
            full: full || [versionInput.major, versionInput.minor, versionInput.patch].filter((part) => part !== undefined).join('.'),
            major: parseIntOrZero(versionInput.major),
            minor: parseIntOrZero(versionInput.minor),
            patch: parseIntOrZero(versionInput.patch ?? extra[2]),
            hotfix: parseIntOrZero(extra[3]),
            snapshot: /snapshot/i.test(tag || full),
            tag: tag || undefined,
        }
    }

    const raw = String(versionInput).trim()
    if (!raw) {
        return null
    }

    const [numericPart, ...tagParts] = raw.split('-')
    const tag = tagParts.join('-')
    const [major, minor, patch, hotfix] = numericPart.split('.')

    return {
        full: raw,
        major: parseIntOrZero(major),
        minor: parseIntOrZero(minor),
        patch: parseIntOrZero(patch),
        hotfix: parseIntOrZero(hotfix),
        snapshot: /snapshot/i.test(tag),
        tag: tag || undefined,
    }
}

const toTuple = (version) => [
    version.major,
    version.minor,
    version.patch,
    version.hotfix,
]

const compareTuples = (left, right) => {
    for (let i = 0; i < 4; i += 1) {
        if (left[i] !== right[i]) {
            return left[i] - right[i]
        }
    }
    return 0
}

/**
 * SNAPSHOT of a version is treated as that same version for range membership
 * so 2.40-SNAPSHOT and 2.43.1.0-SNAPSHOT stay inside the supported window.
 */
export const compareDhis2Versions = (leftInput, rightInput) => {
    const left = parseDhis2Version(leftInput)
    const right = parseDhis2Version(rightInput)
    if (!left && !right) return 0
    if (!left) return -1
    if (!right) return 1
    return compareTuples(toTuple(left), toTuple(right))
}

export const isSupportedDhis2Version = (versionInput) => {
    const parsed = parseDhis2Version(versionInput)
    if (!parsed || !parsed.major || !parsed.minor) {
        return false
    }

    return (
        compareDhis2Versions(parsed, MIN_SUPPORTED_DHIS2_VERSION) >= 0 &&
        compareDhis2Versions(parsed, MAX_SUPPORTED_DHIS2_VERSION) <= 0
    )
}

export const getDhis2ApiVersion = (versionInput) => {
    const parsed = parseDhis2Version(versionInput)
    if (!parsed || parsed.major !== 2 || !parsed.minor) {
        return 40
    }
    return parsed.minor
}
