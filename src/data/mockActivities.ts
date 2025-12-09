import type { Activity } from "../App"

export const mockActivities: Activity[] = [
  {
    id: "1",
    type: "workout",
    date: "2025-01-13",
    title: "Push Day",
    notes: "Fühlte mich stark heute",
    exercises: [
      {
        name: "Bench Press",
        sets: [
          { weight: 60, reps: 10 },
          { weight: 60, reps: 8 },
          { weight: 55, reps: 10 }
        ]
      },
      {
        name: "Incline Dumbbell Press",
        sets: [
          { weight: 22, reps: 12 },
          { weight: 22, reps: 10 }
        ]
      }
    ]
  },

  {
    id: "2",
    type: "run",
    date: "2025-11-24",
    title: "Morning Run",
    distanceKm: 4.2,
    durationMin: 25,
    intensity: "moderate",
    notes: "Neue Route ausprobiert"
  },

  {
    id: "3",
    type: "ride",
    date: "2025-11-23",
    title: "Evening Ride",
    distanceKm: 12.5,
    durationMin: 40,
    intensity: "easy"
  }
]
