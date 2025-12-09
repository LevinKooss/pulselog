type ProgressCardProps = {
    title: string
    value: number | string
    subtext: string
}

export default function ProgressCard({ title, value, subtext }: ProgressCardProps) {
    return (
        <div className='progress-card'>
            <h3>{title}</h3>
            <p className="value">{value}</p>
            <p>{subtext}</p>
        </div>
    )
}