import Sidebar from '@/components/shared/sidebar';
import { Outlet } from 'react-router-dom';


const Home = () => {
    return (
        <div className="bg-slate-900 min-h-screen lg:p-6 flex">
            <div className="bg-slate-800 lg:h-[92vh] h-screen rounded-2xl overflow-hidden shadow-lg grid md:grid-cols-[20rem_1fr] w-full">
                <Sidebar />

                <main className="bg-slate-800 flex flex-col h-screen">
                    <Outlet />
                </main>
            </div>
        </div>

    );
};

export default Home;






/* 

const users = [
    { id: 1, name: 'Alice Johnson', role: 'Admin', status: 'Online' },
    { id: 2, name: 'Bob Smith', role: 'Editor', status: 'Offline' },
    { id: 3, name: 'Charlie Brown', role: 'Viewer', status: 'Online' },
    { id: 4, name: 'David Wilson', role: 'Admin', status: 'Busy' },
    { id: 5, name: 'Eva Green', role: 'Editor', status: 'Offline' },
    { id: 6, name: 'Eva Green', role: 'Editor', status: 'Offline' },
    { id: 7, name: 'Eva Green', role: 'Editor', status: 'Offline' },
    { id: 8, name: 'Eva Green', role: 'Editor', status: 'Offline' },
    { id: 9, name: 'Eva Green', role: 'Editor', status: 'Offline' },
    { id: 10, name: 'Eva Green', role: 'Editor', status: 'Offline' },
    { id: 11, name: 'Eva Green', role: 'Editor', status: 'Offline' },
    { id: 12, name: 'Eva Green', role: 'Editor', status: 'Offline' },
    { id: 101, name: 'Eva Green', role: 'Editor', status: 'Offline' },
    { id: 1012, name: 'Eva Green', role: 'Editor', status: 'Offline' },
    { id: 1011, name: 'Eva Green', role: 'Editor', status: 'Offline' },
    { id: 1022, name: 'Eva ', role: 'Editor', status: 'Offline' },
];

*/




/* 


const messages: Message[] = [
    {
        id: '1', type: 'text', content: 'Hello, world!', sender: {
            id: '949137f0-94bc-4b1d-9551-79f25f69a883'
        }
    },
    {
        id: '7', type: 'text', content: 'Hello, world! lor df df df df d f df d f df em lsds dasf fasfasfasfas sfas f saf asf as fs af asf as ', sender: {
            id: '949137f0-94bc-4b1d-9551-79f25f69a883'
        }
    },

    {
        id: '2', type: 'image', content: 'https://example.com/image.jpg', altText: 'Sample Image', sender: {
            id: '949137f0-94bc-4b1d-9551-79f25f69a883'
        }
    },
    {
        id: '3', type: 'video', content: 'https://example.com/video.mp4', sender: {
            id: '949137f0-94bc-4b1d-9551-79f25fdcd69a883'
        }
    },
    {
        id: '4', type: 'audio', content: 'https://example.com/audio.mp3', sender: {
            id: '949137f0-94bc-4scsb1d-9551-79f25f69a883'
        }
    },
    {
        id: '5', type: 'file', content: 'https://example.com/file.zip', filename: 'file.zip', sender: {
            id: '949137f0-94bcss-4b1d-9551-79f25f69a883'
        }
    }
];


*/