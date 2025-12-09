import { useState } from 'react'
import { useEffect } from 'react'
import './App.css'
import { mockActivities } from './data/mockActivities'
import Dashboard from './Dashboard'
import AddActivityScreen from './screens/AddActivityScreen'
import HistoryScreen from './screens/HistoryScreen'
import ActivityDetailScreen from './screens/ActivityDetailScreen'

export type ActivityType = 'workout' | 'run' | 'ride'

export type WorkoutSet = {
  weight: number,
  reps: number
}

export type WorkoutExercise = {
  name: string,
  sets: WorkoutSet[]
}

export type BaseActivity = {
  id: string,
  type: ActivityType,
  date: string,
  title: string,
  notes?: string
}

export type WorkoutActivity = BaseActivity & {
  type: 'workout',
  exercises: WorkoutExercise[]
}

export type RunActivity = BaseActivity & {
  type: 'run',
  distanceKm: number,
  durationMin: number,
  intensity?: 'easy' | 'moderate' | 'hard', 
}

export type RideActivity = BaseActivity & {
  type: 'ride',
  distanceKm: number,
  durationMin: number,
  intensity?: 'easy' | 'moderate' | 'hard'
}

export type Activity = WorkoutActivity | RunActivity| RideActivity

function App() {
  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('fitlog-data')
    if (saved) {
      return JSON.parse(saved)
    }

    return mockActivities
  })

function handleDeleteActivity(idToDelete: string) {
    setActivities(prev => prev.filter(act => act.id !== idToDelete))
}

  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'add-activity' | 'history' | 'detail'>('dashboard')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activityToEdit, setActivityToEdit] = useState<Activity | undefined>(undefined)

  useEffect(() => {
    localStorage.setItem('fitlog-data', JSON.stringify(activities))
  }, [activities])

  function handleSelectActivity(id: string) {
    setSelectedId(id)
    setCurrentScreen('detail')
  }

  function handleEditClick(activity: Activity) {
    setActivityToEdit(activity)
    setCurrentScreen('add-activity')
  }

  function handleSaveActivity(activityData: Activity) {
    if (activityToEdit) {
      setActivities(prev => prev.map(a => a.id === activityToEdit.id ? activityData : a
      ))
      setActivityToEdit(undefined)
      setCurrentScreen('detail')
    } else {
      setActivities(prev => [activityData, ...prev])
      setCurrentScreen('dashboard')
    }
  }

  return (
    <>
    <div className="background-blur-container">
        <div className="blur-orb blur-orb-1"></div>
        <div className="blur-orb blur-orb-2"></div>
    </div>
    <div className='app-container'>
    {currentScreen === 'dashboard' && (
      <Dashboard
        activities={activities}
        onNavigateToAdd={() => setCurrentScreen('add-activity')}
        onNavigateToHistory={() => setCurrentScreen('history')}
        onSelectActivity={handleSelectActivity}
      />
    )}
    {currentScreen === 'add-activity' && (
      <AddActivityScreen
        onBack={() => {
          setActivityToEdit(undefined)
          setCurrentScreen('dashboard')
        }}
        onSave={handleSaveActivity}
        initialData={activityToEdit}
      />
    )}
    {currentScreen === 'history' && (
      <HistoryScreen
        activities={activities}
        onBack={() => setCurrentScreen('dashboard')}
        onDeleteActivity={handleDeleteActivity}
        onNavigateToAdd={() => setCurrentScreen('add-activity')}
        onSelectActivity={handleSelectActivity}
      />
    )}
    {currentScreen === 'detail' && selectedId && (
      <ActivityDetailScreen
        activity={activities.find(a => a.id === selectedId)!}
        onBack={() => setCurrentScreen('history')}
        onDelete={() => {
          handleDeleteActivity(selectedId)
          setCurrentScreen('history')
        }}
        onEdit={(activity) => handleEditClick(activity)}
        onNavigateToDashboard={() => setCurrentScreen('dashboard')}
        onNavigateToHistory={() => setCurrentScreen('history')}
      />
    )}
    </div>
  </>
)
}
export default App
