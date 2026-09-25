import { useCallback, useRef, useState } from 'react'
import {
    fetchOrgUnitStatus,
    hasKnownStatus,
    runWithConcurrency,
} from '../utils/fetchOrgUnitStatus'

export const useOrgUnitStatusLoader = (engine) => {
    const [statuses, setStatuses] = useState({})
    const statusesRef = useRef({})
    const inflightRef = useRef(new Set())
    const scopeRef = useRef('')

    const applyScope = (dataSet, period) => {
        const scope = `${dataSet || ''}|${period || ''}`
        if (scopeRef.current === scope) {
            return
        }
        scopeRef.current = scope
        statusesRef.current = {}
        inflightRef.current = new Set()
        setStatuses({})
    }

    const patchStatus = (orgUnitId, next) => {
        const current = statusesRef.current[orgUnitId] || {}
        const merged = { ...current, ...next }
        statusesRef.current = {
            ...statusesRef.current,
            [orgUnitId]: merged,
        }
        setStatuses(statusesRef.current)
    }

    const loadUnits = useCallback(
        async (orgUnitIds, options = {}) => {
            const { dataSet, period, silent = false } = options
            if (!engine || !dataSet || !period || !orgUnitIds?.length) {
                return
            }

            applyScope(dataSet, period)

            const toLoad = orgUnitIds.filter((id) => {
                if (!id || inflightRef.current.has(id)) {
                    return false
                }
                if (options.force) {
                    return true
                }
                return !hasKnownStatus(statusesRef.current[id])
            })

            if (!toLoad.length) {
                return
            }

            toLoad.forEach((id) => {
                inflightRef.current.add(id)
                if (!silent) {
                    patchStatus(id, { loading: true, error: null })
                }
            })

            const requestScope = scopeRef.current
            await runWithConcurrency(
                toLoad,
                async (orgUnitId) => {
                    try {
                        const status = await fetchOrgUnitStatus(engine, {
                            dataSet,
                            period,
                            orgUnit: orgUnitId,
                        })
                        if (scopeRef.current !== requestScope) {
                            return
                        }
                        patchStatus(orgUnitId, status)
                    } catch (err) {
                        if (scopeRef.current !== requestScope) {
                            return
                        }
                        patchStatus(orgUnitId, {
                            loading: false,
                            error: err?.message || 'Could not load status',
                        })
                    } finally {
                        if (scopeRef.current === requestScope) {
                            inflightRef.current.delete(orgUnitId)
                        }
                    }
                },
                5
            )
        },
        [engine]
    )

    const updateStatus = useCallback((orgUnitId, next) => {
        if (!orgUnitId) {
            return
        }
        patchStatus(orgUnitId, { ...next, loading: false })
    }, [])

    const reloadUnit = useCallback(
        async (orgUnitId, { dataSet, period } = {}) => {
            if (!orgUnitId) {
                return
            }
            inflightRef.current.delete(orgUnitId)
            const current = statusesRef.current[orgUnitId]
            statusesRef.current = {
                ...statusesRef.current,
                [orgUnitId]: current
                    ? { ...current, loading: true, error: null }
                    : { loading: true, error: null },
            }
            setStatuses(statusesRef.current)
            await loadUnits([orgUnitId], { dataSet, period, silent: true, force: true })
        },
        [loadUnits]
    )

    const reset = useCallback(() => {
        scopeRef.current = ''
        statusesRef.current = {}
        inflightRef.current = new Set()
        setStatuses({})
    }, [])

    return {
        statuses,
        loadUnits,
        updateStatus,
        reloadUnit,
        reset,
    }
}
