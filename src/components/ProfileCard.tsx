export default function ProfileCard() {

    return(
        <div className='profile-card'>
            <div className='profile-header'>
                <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=User`} alt="User Avatar" className='avatar' />
                <div>
                    <p>Welcome back!</p>
                </div>
            </div>
        </div>
    )
}