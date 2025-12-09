import type { Activity, RideActivity, RunActivity } from '../App' 
import ArrowIcon from '../assets/arrow.svg'

type WorkoutSummaryProps = {
    activity: Activity
}

export default function WorkoutSummary({ activity }: WorkoutSummaryProps) {
    
    if(!activity) {
        return (
            <div className='workout-summary'>
                <h3>Last workout</h3>
                <p>No workout yet.</p>
            </div>
        )
    }

    return (
    <div className='workout-summary'>
        <h3>Latest Activity 
            <span>{activity.date} 
                <img src={ArrowIcon} alt="arrow icon" />
            </span>
        </h3>
        {activity.type === 'workout' && (
        <>
        {activity.exercises.map((exercise, index) => {
            const maxWeight = Math.max(...exercise.sets.map(s => s.weight))

            return(
                <div className='info-row' key={index}>
                    <p>{exercise.name || 'Unnamed Exercise'}</p>
                    <span>
                        {exercise.sets.length} Sets
                    </span>
                    <span>
                        Max {maxWeight} kg
                    </span>
                </div>
            )
        })}
        <p>+3 more exercises</p>
        </>
        )}
        {(activity?.type === 'run' || activity?.type === 'ride') && (
        <>
        <div className='info-row'>
            <p>Distance</p>
            <span>{(activity as RunActivity).distanceKm} km</span>
        </div>
        <div className='info-row'>
            <p>Duration</p>
            <span>{(activity as RideActivity).durationMin} min</span>
        </div>
        </>
        )}
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
    )
}