import type { Activity, WorkoutActivity, RunActivity } from '../App'
import WorkoutIcon from '../assets/dumbbell.svg'
import RunningIcon from '../assets/running.svg'
import RidingIcon from '../assets/bycicle.svg'
import BackArrow from '../assets/back-arrow.svg'
import EditIcon from '../assets/edit.svg'
import DeleteIcon from '../assets/delete.svg'

type ActivityDetailScreenProps = {
    activity: Activity
    onBack: () => void
    onDelete: () => void
    onEdit: (activity: Activity) => void
    onNavigateToDashboard: () => void
    onNavigateToHistory: () => void
}

export default function ActivityDetailScreen({ activity, onBack, onDelete, onEdit, onNavigateToDashboard, onNavigateToHistory }: ActivityDetailScreenProps) {

    const getIcon = (type: string) => {
        if (type === 'workout') return WorkoutIcon
        if (type === 'run') return RunningIcon
        if (type === 'ride') return RidingIcon
        return WorkoutIcon
    }

    if (!activity) return <div>Activity not found</div>

    return (
        <div className="screen-container">
            <nav className="detail-nav detail-nav-screen">
                <button onClick={onBack} className="back-btn">
                <img src={BackArrow} alt="back arrow" /> 
                Go back
                </button>
                <span className="nav-title">Workout Detail</span>
                <div style={{width: 60}}></div>
            </nav>

            <div className="content-padding">
                
                <div className="detail-header">
                    <div className="detail-title-group">
                        <div className='detail-activity-header'>
                            <img src={getIcon(activity.type)} alt="icon"/>
                            <h1>{activity.title}</h1>
                        </div>
                        <p className="detail-date">{activity.date}</p>
                    </div>

                    <div className="detail-actions">
                        <button 
                            className="btn-edit-outline"
                            onClick={() => onEdit(activity)}
                            >
                            <img src={EditIcon} alt="edit icon" />
                            Edit
                        </button>
                        <button onClick={onDelete} className="btn-delete-outline">
                            <img src={DeleteIcon} alt="delete icon" />
                            Delete
                        </button>
                    </div>
                </div>

                {activity.type === 'workout' && (
                    <div className="exercises-grid">
                        {(activity as WorkoutActivity).exercises.map((exercise, index) => (
                            <div key={index} className="detail-card">
                                <div className="detail-card-header">
                                    <span className="label">Exercise</span>
                                    <h3>{exercise.name}</h3>
                                </div>

                                <div className="sets-table">
                                    <div className="table-header">
                                        <span>Set</span>
                                        <span>Reps</span>
                                        <span>Weight (kg)</span>
                                    </div>
                                    {exercise.sets.map((set, sIndex) => (
                                        <div key={sIndex} className="table-row">
                                            <span>{sIndex + 1}</span>
                                            <span>{set.reps}</span>
                                            <span>{set.weight}kg</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {(activity.type === 'run' || activity.type === 'ride') && (
                    <div className="detail-card cardio-limit">
                         <div className="detail-card-header">
                            <span className="label">Stats</span>
                            <h3>Performance</h3>
                        </div>
                        <div className="sets-table-cardio">
                            <div className="table-row-cardio">
                                <span>Distance</span>
                                <span>{(activity as RunActivity).distanceKm} km</span>
                            </div>
                            <div className="table-row-cardio">
                                <span>Duration</span>
                                <span>{(activity as RunActivity).durationMin} min</span>
                            </div>
                            <div className="table-row-cardio">
                                <span>Pace</span>
                                <span>
                                    {(activity as RunActivity).distanceKm > 0 
                                        ? ((activity as RunActivity).durationMin / (activity as RunActivity).distanceKm).toFixed(1) 
                                        : '0'
                                    } min/km
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {activity.notes && (
                    <div className="notes-section">
                        <h3>Notes</h3>
                        <div className="notes-box">
                            {activity.notes}
                        </div>
                    </div>
                )}

            </div>
            <div className="nav-btns">
                <button className="nav-btn" onClick={onNavigateToDashboard}>Dashboard</button>
                <button className="nav-btn" onClick={onNavigateToHistory}>History</button>
            </div>
        </div>
    )
}