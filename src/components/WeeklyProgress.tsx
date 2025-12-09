import { useMemo } from 'react'
import RunningIcon from '../assets/running.svg'
import RidingIcon from '../assets/bycicle.svg'
import WorkoutIcon from '../assets/dumbbell.svg'
import type { Activity, WorkoutActivity, RunActivity, RideActivity } from '../App'

type WeeklyProgressStats = {
    sessionsThisWeek: number
    totalSets: number
    totalVolumeOrDistance: number
    lastSessionLabel: string
}

type WeeklyProgressProps = {
    activeTab: 'workout' | 'running' | 'riding'
    onChangeTab: (tab: 'workout' | 'running' | 'riding') => void
    activities: Activity[]
}

export default function WeeklyProgress({ activeTab, onChangeTab, activities }: WeeklyProgressProps) {
        
    const filteredActivities = useMemo(() => {
        return activities.filter(a => {
            if (activeTab === 'workout') return a.type === 'workout'
            if (activeTab === 'running') return a.type === 'run'
            if (activeTab === 'riding') return a.type === 'ride'
            return false
        })
    },[activities, activeTab])

    const stats: WeeklyProgressStats = {
        sessionsThisWeek: filteredActivities.length,
        totalSets: activeTab === 'workout'
        ? filteredActivities.reduce((acc, curr) => {
            const w = curr as WorkoutActivity
            const setsInWorkout = w.exercises?.reduce((sum, ex) => sum + ex.sets.length, 0) || 0
            return acc + setsInWorkout
        }, 0)
        :0,
        totalVolumeOrDistance: filteredActivities.reduce((acc, curr) => {
            if (activeTab === 'workout') {
                const w = curr as WorkoutActivity;
                const volume = w.exercises?.reduce((sum, ex) => {
                    return sum + ex.sets.reduce((s, set) => s + (set.weight * set.reps), 0);
                }, 0) || 0;
                return acc + volume;
            } else {
                const c = curr as (RunActivity | RideActivity);
                return acc + (c.distanceKm || 0);
            }
        }, 0),
        lastSessionLabel: filteredActivities.length > 0 
            ? filteredActivities[0].date 
            : 'No data'
    }

    return (
        <div className='weekly-progress'>
            <div className='btn-row'>
                <button
                    className={ activeTab === 'workout' ? 'active' : ''}
                    onClick={() => onChangeTab('workout')}
                >
                <img src={WorkoutIcon} alt='workout icon' />
                Workout
                </button>
                <button
                    className={ activeTab === 'running' ? 'active' : ''}
                    onClick={() => onChangeTab('running')}
                >
                <img src={RunningIcon} alt='running icon' />
                Running
                </button>
                <button
                    className={ activeTab === 'riding' ? 'active' : ''}
                    onClick={() => onChangeTab('riding')}
                >
                <img src={RidingIcon} alt='bycicle icon' />
                Riding
                </button>
            </div>
            <div className='info-row'>
                <p>Sessions this week: </p>
                <span>{stats.sessionsThisWeek}</span>
            </div>
            {activeTab === 'workout' && (
                <div className='info-row'>
                    <p>Total sets: </p>
                    <span>{stats.totalSets}</span>
                </div>
            )}
            <div className='info-row'>

                <p>{activeTab === 'workout' ? 'Total Volume' : 'Distance'}: </p>
                <span>
                    {stats.totalVolumeOrDistance} 
                    {activeTab === 'workout' ? ' kg' : ' km'}
                </span>
            </div>
            <div className='info-row'>
                <p>Last session: </p>
                <span>{stats.lastSessionLabel}</span>
            </div>
            <div className='img-container'>
                <img 
                    src={activeTab === 'workout' ? WorkoutIcon : (activeTab === 'running' ? RunningIcon : RidingIcon)} 
                    alt='icon' 
                />
            </div>
        </div>
    )
}