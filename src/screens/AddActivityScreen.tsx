import { useState } from "react"
import type { ActivityType, WorkoutExercise, Activity } from "../App"
import WorkoutIcon from '../assets/dumbbell.svg'
import RunningIcon from '../assets/running.svg'
import RidingIcon from '../assets/bycicle.svg'
import BackArrow from '../assets/back-arrow.svg'
import DeleteIcon from '../assets/delete.svg'
import MinusIcon from '../assets/minus.svg'


type AddActivityScreenProps = {
    onBack: () => void
    onSave:  (data: any) => void
    initialData?: Activity
}

export default function AddActivityScreen({ onBack, onSave, initialData }: AddActivityScreenProps) {
    const [activityType, setActivityType] = useState<ActivityType>(initialData?.type || 'workout')
    const [title, setTitle] = useState(initialData?.title || '')
    const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0])
    const [notes, setNotes] = useState(initialData?.notes || '')
    const [distance, setDistance] = useState((initialData as any)?.distanceKm ? String((initialData as any).distanceKm) : '')
    const [duration, setDuration] = useState((initialData as any)?.durationMin ? String((initialData as any).durationMin) : '')
    const [exercises, setExercises] = useState<WorkoutExercise[]>(
        (initialData?.type === 'workout' && (initialData as any).exercises) 
        ? (initialData as any).exercises 
        : [
            { name: '', sets: [{ weight: 0, reps: 0 }, { weight: 0, reps: 0 }, { weight: 0, reps: 0 }] }
        ])
    const today = new Date().toISOString().split('T')[0]
    

    function handleAddExercise() {
        setExercises(prev => [...prev, {
                name: '',
                sets: [
                    { weight: 0, reps: 0 },
                    { weight: 0, reps: 0 },
                    { weight: 0, reps: 0 }
                ]}
            ])
    }

    function handleAddSet(indexToUpdate: number) {
        setExercises(prev => {
            return prev.map((exercise, index) => {
                if (index === indexToUpdate) {
                    return {
                        ...exercise,
                        sets: [...exercise.sets, { weight: 0, reps: 0 }]
                    }
                }
                return exercise
            })
        })
    }

    function handleDeleteExercise(exerciseIndexToDelete: number) {
        setExercises(prev => prev.filter((_, index) => index !== exerciseIndexToDelete))
    }

    function handleDeleteSet(exerciseIndex: number, setIndexToDelete: number) {
        setExercises(prev => {
            return prev.map((exercise, index) => {
                if (index === exerciseIndex) {
                    return {
                        ...exercise,
                        sets: exercise.sets.filter((_, setIndex) => setIndex !== setIndexToDelete)
                    }
                }
                return exercise
            })
        })
    }

    function handleUpdateExerciseName(indexToUpdate: number, newName: string) {
        setExercises(prev => prev.map((exercise, index) => {
            if (index === indexToUpdate) {
                return { ...exercise, name: newName }
            }
            return exercise
        }))
    }

    function handleUpdateSet(exerciseIndex: number, setIndexToUpdate: number, field: 'reps' | 'weight', newValue: string) {
        if (newValue!== '' && Number.isNaN(Number(newValue))) return;

        let val = Number(newValue)

        const MAX_LIMIT = 999

        if(val > MAX_LIMIT) {
            val = MAX_LIMIT
        }

        if(val < 0) {
            val = 0
    }

    setExercises(prev => prev.map((exercise, index) => {
        if (index === exerciseIndex) {
            const updatedSets = exercise.sets.map((set, setIndex) => {
                if (setIndex === setIndexToUpdate) {
                    return { ...set, [field]: val }
                }
                return set
            })
            return { ...exercise, sets: updatedSets }
        }
        return exercise
        }))
    }

    function handleSave() {
        const idToUse = initialData?.id || self.crypto.randomUUID()
        if (activityType === 'workout') {
            const newWorkout = {
                id: idToUse,
                type: 'workout',
                date,
                title,
                notes,
                exercises
            }
            onSave(newWorkout)
        }   else {
            const newCardio = {
                id: crypto.randomUUID(),
                type: activityType,
                date,
                title,
                notes,
                distanceKm: Number(distance),
                durationMin: Number(duration),
                intensity: 'moderate'
        }
            onSave(newCardio)
    }}

    const isValid = () => {
        if (activityType === 'workout') {
            return exercises.some(exercise => 
                exercise.sets.some(set => 
                    Number(set.reps) > 0 && Number(set.weight) > 0
                )
            );
        } else {
            return Number(distance) > 0 && Number(duration) > 0;
        }
    };

    return(
        <div className="screen-container">
            <nav className="add-nav">
                <button className="back-btn" onClick={onBack}><img src={BackArrow} alt="back arrow" /> Back</button>
                <h1>Add Activity</h1>
                <div></div>
            </nav>
            <div className='form-content'>
                <div className="form-btn">
                <button 
                    className={`activity-btn ${activityType === 'workout' ? 'active' : ''}`}
                    onClick={() => setActivityType('workout')}
                >
                    <img src={WorkoutIcon} alt="Workout Icon" />
                    Workout
                </button>
                <button 
                    className={`activity-btn ${activityType === 'run' ? 'active' : ''}`}
                    onClick={() => setActivityType('run')}
                >
                    <img src={RunningIcon} alt="Workout Icon" />
                    Run
                </button>
                <button 
                    className={`activity-btn ${activityType === 'ride' ? 'active' : ''}`}
                    onClick={() => setActivityType('ride')}
                >
                    <img src={RidingIcon} alt="Workout Icon" />
                    Ride
                </button>
                </div>
                <section className="form-header">
                    <div className='form-group'>
                        <label htmlFor="title">Title</label>
                        <input 
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Morning exercise" 
                            className="input-field title-input"
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="date">Date</label>
                        <input 
                            id="date"
                            type="date"
                            value={date}
                            max={today}
                            onChange={(e) => setDate(e.target.value)}
                            placeholder="DD/MM/YYYY"
                            className="input-field"
                        />
                    </div>
                </section>
                {(activityType === 'run' || activityType === 'ride') && (
                <div className="cardio-fields">
                    <div className="form-group">
                        <label htmlFor="distance">Distance (km)</label>
                        <input 
                            id="distance"
                            type="number"
                            value={distance}
                            onChange={(e) => {
                                const val = Number(e.target.value)
                                if (val < 0) return;
                                if (val > 999) return;
                            setDistance(e.target.value)
                            }}
                            onKeyDown={(e) => {
                                if (["e", "E", "+", "-"].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            className="input-cardio"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="duration">Duration (min)</label>
                        <input 
                            id="duration"
                            type="number"
                            value={duration}
                            onChange={(e) => {
                                const val = Number(e.target.value)
                                if (val < 0) return;
                                if (val > 999) return;
                            setDuration(e.target.value)
                            }}
                            onKeyDown={(e) => {
                                if (["e", "E", "+", "-"].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            className="input-cardio"
                        />
                    </div>
                </div>
                )}

                {activityType === 'workout' && (
                    <div className="workout-builder">

                    {exercises.map((exercise, exerciseIndex) => (
                        <div key={exerciseIndex} className="exercise-card">

                            <div className="form-group-exercise">
                                <div className="exercise">
                                    <label>Exercise</label>
                                    <input 
                                        type="text" 
                                        placeholder="z.B. Lat Pulldown"
                                        value={exercise.name}
                                        onChange={(e) => {handleUpdateExerciseName(exerciseIndex, e.target.value)}} 
                                    />  
                                </div>
                                <button 
                                    type="button" 
                                    disabled={exercises.length <= 1}
                                    onClick={() => handleDeleteExercise(exerciseIndex)}
                                    className="delete-exercise"
                                >
                                <img src={DeleteIcon} alt="delete icon" />
                                </button>
                            </div>
                    
                            <div className="sets-list">
                                <div className="sets-header">
                                    <span className="set">Set</span>
                                    <span>Reps</span>
                                    <span>Weight (kg)</span>
                                    <span></span>
                                </div>
                    
                                {exercise.sets.map((set, setIndex) => (
                                    <div key={setIndex} className="set-row">
                                        <span className="set-number">{setIndex + 1}</span>
                                        <input 
                                            type="number" 
                                            value={set.reps || ''}
                                            onChange={(e) => {handleUpdateSet(exerciseIndex, setIndex, 'reps', e.target.value)}}
                                            onKeyDown={(e) => {
                                                if (["e", "E", "+", "-"].includes(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            className="input-workout"
                                        />
                                        <input 
                                            type="number" 
                                            value={set.weight || ''}
                                            onChange={(e) => {handleUpdateSet(exerciseIndex, setIndex, 'weight', e.target.value)}}
                                            onKeyDown={(e) => {
                                                if (["e", "E", "+", "-"].includes(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            className="input-workout"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => handleDeleteSet(exerciseIndex, setIndex)}
                                            className="delete-set"
                                        >
                                        <img src={MinusIcon} alt="delete set icon" />
                                        </button>
                                    </div>
                                ))}

                                <button 
                                    type="button"
                                    onClick={() => {handleAddSet(exerciseIndex)}}
                                    className="btn-add-set"
                                >
                                    + Add set
                                </button>
                            </div>
                        </div>
                    ))}

                            <button 
                                type="button"
                                className="btn-add-exercise"
                                onClick={handleAddExercise} 
                            >
                                Add exercise
                            </button>

                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="notes">Notes</label>
                        <textarea 
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            className="activity-notes"
                        />
                    </div>
            </div>
            <button 
                className="btn-save"
                onClick={handleSave}
                disabled={!isValid()}
            >
            Save Workout
            </button> 
        </div>
    )
}