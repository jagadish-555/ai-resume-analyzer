import { Link } from 'react-router';
import '../style/not-found.scss';

const NotFound = () => {
    return (
        <main className='not-found-page'>
            <div className='not-found-content'>
                <p className='not-found-code'>404</p>
                <h1>Page not found</h1>
                <p className='not-found-message'>
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link to='/' className='button primary-button'>
                    Back to home
                </Link>
            </div>
        </main>
    );
};

export default NotFound;
