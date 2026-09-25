import { extractCompleteRegistrations, extractDataValues } from './dhis2Api'

export const hasKnownStatus = (status) =>
    Boolean(status) && status.hasData !== undefined && status.isCompleted !== undefined

export const fetchOrgUnitStatus = async (engine, { dataSet, period, orgUnit }) => {
    const result = await engine.query({
        dataValues: {
            resource: 'dataValueSets',
            params: {
                dataSet,
                period,
                orgUnit,
            },
        },
        completed: {
            resource: 'completeDataSetRegistrations',
            params: {
                dataSet,
                period,
                orgUnit,
            },
        },
    })

    const registrations = extractCompleteRegistrations(result.completed)
    const completion = registrations[0]

    return {
        hasData: extractDataValues(result.dataValues).length > 0,
        isCompleted: registrations.length > 0,
        completedBy: completion?.storedBy,
        dateCompleted: completion?.dateCompleted || completion?.date || null,
        error: null,
        loading: false,
    }
}

export const runWithConcurrency = async (items, worker, concurrency = 5) => {
    const queue = [...items]
    const size = Math.min(concurrency, queue.length) || 0
    await Promise.all(
        Array.from({ length: size }, async () => {
            while (queue.length) {
                const item = queue.shift()
                await worker(item)
            }
        })
    )
}
