import React from 'react';
import ReactDOM from 'react-dom';
import Blogs from './Blogs';
//import { createRoot } from 'react-dom/client';
import { ToastContainer, toast } from 'react-toastify';

function Home() {
    return (
        <div>
            {/* <div className='bg-dark text-center py-2 shadow-lg'>
                <h1 className='text-white'>45 Blog App</h1>
            </div> */}
            <Blogs />
            <ToastContainer />
        </div>
    );
}

export default Home;

if (document.getElementById('home')) {
    ReactDOM.render(<Home />, document.getElementById('home'));
}

// if (document.getElementById('home')) {
//     const container = document.getElementById('home');
//     const root = createRoot(container);
//     root.render(<Home />);
// }