import { useState } from 'react'
import type { Activity, WorkoutActivity, RunActivity } from '../App'
import WorkoutIcon from '../assets/dumbbell.svg'
import RunningIcon from '../assets/running.svg'
import RidingIcon from '../assets/bycicle.svg'
import RecentIcon from '../assets/recent.svg'
import DateIcon from '../assets/date.svg'
import DeleteIcon from '../assets/delete.svg'
import DetailIcon from '../assets/detail.svg'
import SetsIcon from '../assets/repeat.svg'
import WeightIcon from '../assets/weight.svg'
import DistanceIcon from '../assets/distance.svg'
import DurationIcon from '../assets/stopwatch.svg'
import ExerciseIcon from '../assets/biceps.svg'
import PaceIcon from '../assets/fast.svg'


type HistoryScreenProps = {
    activities: Activity[]
    onBack: () => void
    onNavigateToAdd: () => void
    onDeleteActivity: (id: string) => void
    onSelectActivity: (id: string) => void
}

export default function HistoryScreen({ activities, onBack, onNavigateToAdd, onDeleteActivity, onSelectActivity }: HistoryScreenProps) {
    const [sortBy, setSortBy] = useState<'recent' | 'date'>('recent')

    const sortedActivities = [...activities].sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()

        if (sortBy === 'recent') {
            return dateB - dateA
        } else {
            return dateA - dateB
        }
    })

    const getIcon = (type: string) => {
        if (type === 'workout') return WorkoutIcon
        if (type === 'run') return RunningIcon
        if (type === 'ride') return RidingIcon
        return WorkoutIcon
    }

    return (
        <>
            <nav>
                <span 
                    className="nav-brand"
                    onClick={onBack}
                    style={{ cursor: 'pointer' }}
                >
                    PulseLog
                </span>
                <div className="nav-btns">
                    <button className='nav-btn' onClick={onBack}>
                        Dashboard
                    </button>
                    <button className="nav-btn active">
                        History
                    </button>
                </div>
            </nav>

            <div className="content-padding">
                {activities.length === 0 && (
                    <div className="empty-state">
                        <h3>No workouts yet.</h3>
                        <p>Start by adding your first workout</p>
                        <button onClick={onNavigateToAdd} className="btn-primary mt-20">
                            + Add Workout
                        </button>
                    </div>
                )}

                {activities.length > 0 && (
                    <div className="history-list">
                        <div className="history-header">
                            <h2>Workout History</h2>
                            <div className="sort-controls">
                                <p>Sort by:</p>
                                <button onClick={() => setSortBy('recent')} className={sortBy === 'recent' ? 'sort-btn active' : 'sort-btn'}>
                                    <img src={RecentIcon} alt="recent" /> Recent
                                </button>
                                <button onClick={() => setSortBy('date')} className={sortBy === 'date' ? 'sort-btn active' : 'sort-btn'}>
                                    <img src={DateIcon} alt="date" /> Date
                                </button>
                            </div>
                        </div>

                        {sortedActivities.map((activity) => {
                            let workoutStats = { sets: 0, volume: 0 };
                            
                            if (activity.type === 'workout') {
                                const w = activity as WorkoutActivity;
                                workoutStats.sets = w.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
                                workoutStats.volume = w.exercises.reduce((acc, ex) => {
                                    return acc + ex.sets.reduce((s, set) => s + (set.weight * set.reps), 0);
                                }, 0);
                            }

                            let pace = '0';
                            if (activity.type === 'run' || activity.type === 'ride') {
                                const c = activity as RunActivity;
                                if (c.distanceKm > 0) {
                                    pace = (c.durationMin / c.distanceKm).toFixed(1);
                                }
                            }

                            return (
                                <div key={activity.id} className="history-card">
                                    <div className="card-header">
                                        <div className="card-title-group">
                                            <img src={getIcon(activity.type)} alt="icon" className="card-icon" />
                                            <h3>{activity.title}</h3>
                                        </div>
                                        <span className="card-date">{activity.date}</span>
                                    </div>

                                    <div className="card-info">
                                        {activity.type === 'workout' && (
                                            <div className='workout-card'>
                                                <span className='card-stats'>
                                                    <img src={ExerciseIcon} alt="Exercise Icon" />
                                                    {(activity as WorkoutActivity).exercises.length} Exercises
                                                </span>
                                                <span className='card-stats'>
                                                    <img src={SetsIcon} alt="Sets Icon" />
                                                    {workoutStats.sets} Sets
                                                </span>
                                                <span className='card-stats'>
                                                    <img src={WeightIcon} alt="Weight Icon" />
                                                    {workoutStats.volume} kg
                                                </span>
                                            </div>
                                        )}

                                        {(activity.type === 'run' || activity.type === 'ride') && (
                                            <div className='cardio-card'>
                                                <span className='card-stats'>
                                                    <img src={DistanceIcon} alt="Distance Icon" />
                                                    {(activity as RunActivity).distanceKm} km
                                                </span>
                                                <span className='card-stats'>
                                                    <img src={DurationIcon} alt="Duration Icon" />
                                                    {(activity as RunActivity).durationMin} min
                                                </span>
                                                <span className='card-stats'>
                                                    <img src={PaceIcon} alt="Pace Icon" />
                                                    {pace} min/km
                                                </span>
                                            </div>
                                            
                                        )}
                                    </div>

                                    <div className="card-actions">
                                        <button className="btn-history detail-btn" onClick={() => onSelectActivity(activity.id)}>
                                            <img src={DetailIcon} alt="detail" /> 
                                            <span>Detail</span>
                                        </button>
                                        <button className="btn-history delete-btn" onClick={() => onDeleteActivity(activity.id)}>
                                            <img src={DeleteIcon} alt="delete" /> 
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </>
    )
}