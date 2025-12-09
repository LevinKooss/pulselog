import { useState } from 'react'
import type { Activity } from "./App"
import AddIcon from './assets/add-new.svg'
import ProgressCard from "./components/ProgressCard"
import WeeklyProgress from './components/WeeklyProgress'
import WorkoutSummary from './components/WorkoutSummary'
import ProfileCard from './components/ProfileCard'

type DashboardProps = {
    activities: Activity[]
    onNavigateToAdd: () => void
    onNavigateToHistory: () => void
    onSelectActivity: (id: string) => void
}

function isInLast7Days(dateString: string): boolean {
    const date = new Date(dateString);
    const today = new Date();

    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    return diffDays <= 7;
}

export default function Dashboard({ activities, onNavigateToAdd, onNavigateToHistory, onSelectActivity }: DashboardProps) {
    const [activeTab, setActiveTab] = useState<'workout' | 'running' | 'riding'>('workout')
    function handleChangeTab(newTab: 'workout' | 'running' | 'riding'){
        setActiveTab(newTab)
    }
    const latestActivity = activities[0]

    const totalCount = activities.length
    const workoutsThisWeek = activities.filter(a => 
        a.type === 'workout' && isInLast7Days(a.date)
    ).length
    const activeMinutes = activities
        .filter(a => isInLast7Days(a.date))
        .reduce((sum, act) => {
            if (act.type === 'run' || act.type === 'ride') {
                return sum + act.durationMin
            } else if (act.type === 'workout') {
                return sum + 60 
            }
            return sum
        }, 0)

    return(
        <>
            <nav>
                <span
                    onClick={() => window.location.reload()}
                    style={{ cursor: 'pointer'}}
                    className='title'
                >
                    PulseLog
                </span>
                <div className='nav-btns'>
                <button 
                    className='nav-btn active'
                    onClick={() => window.location.reload()}
                >
                    Dashboard
                </button>
                <button 
                    className='nav-btn'
                    onClick={onNavigateToHistory}
                >
                    History
                </button>
                </div>
            </nav>
            <section className='header-dash'>
            <div className='header-text'>
                <h1>Track your workouts. See your progress.</h1>
                <p>Simple overview of your training volume and weekly consistency.</p>
            </div>
                <button 
                    className='btn-primary'
                    onClick={onNavigateToAdd}
                >
                    <img src={AddIcon} alt="add Icon" />
                    Add Activity
                </button>
            </section>
            <section className='grid'>
                <div className='left-column'>
                    <ProfileCard />
                </div>
                <div className='right-column'>
                    <div className='stats-row-top'>
                        <ProgressCard 
                            title='Workouts this week'
                            value={workoutsThisWeek}
                            subtext="Keep it up!"
                        />
                        <ProgressCard 
                            title='Total Workouts'
                            value={totalCount}
                            subtext="Lifetime stats"
                        />
                        <ProgressCard 
                            title='Active Minutes'
                            value={activeMinutes}
                            subtext="Last 7 days"
                        />
                    </div>
                    <div className='stats-row-bottom'>
                        <WeeklyProgress 
                            activeTab={activeTab}
                            onChangeTab={handleChangeTab}
                            activities={activities}
                        />
                        <div onClick={() => {
                            if(latestActivity) {
                                onSelectActivity(latestActivity.id)
                            }
                        }}>
                        <WorkoutSummary 
                            activity={latestActivity}
                        />
                    </div>
                </div>
            </div>
            </section>
        </>
    )
}