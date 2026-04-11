import '../style/loading.scss';

const LoadingScreen = ({ message = 'Loading...' }) => {
    return (
        <main className='loading-screen' aria-live='polite'>
            <div className='loading-spinner' aria-hidden='true'></div>
            <h1>{message}</h1>
        </main>
    );
};

export default LoadingScreen;
