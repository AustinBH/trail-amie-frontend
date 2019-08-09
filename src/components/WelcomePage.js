import React from 'react'
import { Button } from 'semantic-ui-react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';


const WelcomePage = props => {
    return (
        <>
            <h1>Hike Amie</h1>
            <img className='home-image' src='https://images.freeimages.com/images/large-previews/c27/mount-rainier-1337100.jpg' alt='mount-rainier' />
            <Router>
                <Button as={NavLink} color='brown' exact to='/hikes-near-me' content='Hikes Near Me!' />
                <Route />
            </Router>
        </>
    )
}

export default WelcomePage;