import {Routes, Route} from 'react-router-dom'
import PatientPanel from '../../layouts/PatientPanel'
import AdminPanel from '../../layouts/AdminPanel'

const routerButtons = [
    {
        value: 'PatientPanel',
        route: '/patient',
        element: <PatientPanel/>
    },
    {
        value: 'AdminPanel',
        route: '/admin',
        element: <AdminPanel/>
    }
];
    
        
 const Routing = () => {
        return <Routes>
        {
            routerButtons.map((info) => {
                return <Route key={info.route} path={info.route} element={info.element}/>
            })
        }
        </Routes>   
    }

export default Routing