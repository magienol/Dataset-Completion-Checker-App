import React, { useState } from 'react'
import { useDataEngine } from '@dhis2/app-runtime'
import {
    TableRow,
    TableCell,
    Button,
    ButtonStrip,
    CircularLoader,
    NoticeBox,
    Tooltip,
    Tag,
} from '@dhis2/ui'
import { buildCompleteRegistration, getUsername } from '../utils/dhis2Api'
import { hasKnownStatus } from '../utils/fetchOrgUnitStatus'

export function DatasetRow({
    serialNumber,
    level2Name,
    level3Name,
    facilityName,
    dataset,
    period,
    orgUnit,
    currentUser,
    cachedStatus,
    onReloadStatus,
}) {
    const [successMessage, setSuccessMessage] = useState(false)
    const [completing, setCompleting] = useState(false)
    const [mutationError, setMutationError] = useState(null)
    const engine = useDataEngine()

    const isKnown = hasKnownStatus(cachedStatus)
    const loading = Boolean(cachedStatus?.loading) && !isKnown
    const errorMessage = cachedStatus?.error
    const hasData = cachedStatus?.hasData === true
    const isCompleted = cachedStatus?.isCompleted === true
    const completedBy = cachedStatus?.completedBy
    const dateCompleted = cachedStatus?.dateCompleted

    const handleComplete = async () => {
        if (!period || !orgUnit) return
        setCompleting(true)
        setMutationError(null)
        try {
            setSuccessMessage(false)
            await engine.mutate({
                resource: 'completeDataSetRegistrations',
                type: 'create',
                data: {
                    completeDataSetRegistrations: [
                        buildCompleteRegistration({
                            dataSet: dataset.id,
                            period,
                            organisationUnit: orgUnit,
                            storedBy: getUsername(currentUser),
                        }),
                    ],
                },
            })
            if (onReloadStatus) {
                await onReloadStatus(orgUnit)
            }
            setSuccessMessage(true)
            setTimeout(() => setSuccessMessage(false), 4000)
        } catch (err) {
            console.error('Error marking dataset complete:', err)
            setMutationError(err)
        } finally {
            setCompleting(false)
        }
    }

    const handleIncomplete = async () => {
        if (!period || !orgUnit) return
        setCompleting(true)
        setMutationError(null)
        try {
            await engine.mutate({
                resource: 'completeDataSetRegistrations',
                type: 'delete',
                params: {
                    ds: dataset.id,
                    pe: period,
                    ou: orgUnit,
                },
            })
            if (onReloadStatus) {
                await onReloadStatus(orgUnit)
            }
        } catch (err) {
            console.error('Error marking dataset incomplete:', err)
            setMutationError(err)
        } finally {
            setCompleting(false)
        }
    }

    const getStatusDisplay = () => {
        if (loading) {
            return <CircularLoader small />
        }
        if (errorMessage) {
            return (
                <ButtonStrip>
                    <Tag negative>Error</Tag>
                    <Button
                        small
                        secondary
                        onClick={() => onReloadStatus && onReloadStatus(orgUnit)}
                    >
                        Retry
                    </Button>
                </ButtonStrip>
            )
        }
        if (isCompleted) {
            return (
                <Tooltip content={`Completed by: ${completedBy || 'System'}`}>
                    <Tag positive>Complete</Tag>
                </Tooltip>
            )
        }
        return <Tag negative>Not complete</Tag>
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return ''
        const date = new Date(dateStr)
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    }

    return (
        <>
            <TableRow>
                <TableCell>{serialNumber}</TableCell>
                <TableCell>{dataset.displayName}</TableCell>
                <TableCell>{level2Name}</TableCell>
                <TableCell>{level3Name}</TableCell>
                <TableCell>{facilityName}</TableCell>
                <TableCell>
                    {loading ? (
                        <CircularLoader small />
                    ) : errorMessage ? (
                        <Button
                            small
                            secondary
                            onClick={() => onReloadStatus && onReloadStatus(orgUnit)}
                        >
                            Retry
                        </Button>
                    ) : hasData ? (
                        <Tag>{'Has data'}</Tag>
                    ) : isKnown ? (
                        <Tag neutral>No data</Tag>
                    ) : (
                        <CircularLoader small />
                    )}
                </TableCell>
                <TableCell>{getStatusDisplay()}</TableCell>
                <TableCell>
                    {completedBy || dateCompleted ? (
                        <div>
                            <div>
                                {completedBy === getUsername(currentUser)
                                    ? currentUser?.displayName
                                    : completedBy}
                            </div>
                            <small>{formatDate(dateCompleted)}</small>
                        </div>
                    ) : (
                        '—'
                    )}
                </TableCell>
                <TableCell>
                    <ButtonStrip>
                        {isCompleted ? (
                            <Button
                                secondary
                                onClick={handleIncomplete}
                                small
                                disabled={completing}
                            >
                                {completing ? 'Processing...' : 'Mark incomplete'}
                            </Button>
                        ) : (
                            <Button
                                disabled={!hasData || loading || completing || !isKnown}
                                primary
                                onClick={handleComplete}
                                small
                            >
                                {completing ? 'Completing...' : 'Mark complete'}
                            </Button>
                        )}
                        {completing && <CircularLoader small />}
                    </ButtonStrip>
                </TableCell>
            </TableRow>
            {successMessage && (
                <TableRow>
                    <TableCell colSpan="9">
                        <NoticeBox title="Success" success>
                            {`${dataset.displayName} has been marked as completed by ${
                                currentUser?.displayName || 'System'
                            }.`}
                        </NoticeBox>
                    </TableCell>
                </TableRow>
            )}
            {mutationError && (
                <TableRow>
                    <TableCell colSpan="9">
                        <NoticeBox title="Error" error>
                            {`Action failed for ${dataset.displayName}. ${
                                mutationError.message || JSON.stringify(mutationError)
                            }`}
                        </NoticeBox>
                    </TableCell>
                </TableRow>
            )}
        </>
    )
}

export default React.memo(DatasetRow)
