import React from 'react'
import { Image, Icon, Card } from 'semantic-ui-react';

const MapMarker = props => {

    const handleClick = ev => {
        if (props.selectedTrail === props.trail.id && props.show) {
            props.handleOnClick(null, ev)
        } else {
            props.handleOnClick(props.trail.id, ev)
        }
    }

    const handleClose = ev => {
        props.handleOnClick(null, ev)
    }

    return <div className='marker-holder'>
        <div className='map-marker' onClick={handleClick}>
            {props.current ?
                <Image src='https://img.icons8.com/color/2x/user-location.png' alt='user-marker' />
                :
                <Image src='https://img.icons8.com/dusk/2x/filled-flag.png' alt='map-marker' />
            }
        </div>
        {props.$hover && props.selectedTrail !== props.trail.id ?
            <div className='marker-info'>
                <Card style={{zIndex: 3}}>
                    <Card.Content>
                        <Card.Header>
                            {props.trail.name}
                        </Card.Header>
                    </Card.Content>
                </Card>
            </div>
            :
            null
        }
        {props.show && props.selectedTrail === props.trail.id ?
            <div className='marker-info'>
                <Card style={{ zIndex: 3 }}>
                    {props.trail.imgMedium ?
                        <Image style={{ height: 150 }} src={props.trail.imgMedium} alt={props.trail.name} />
                        :
                        null
                    }
                    <Card.Content>
                        <Card.Header>
                            {props.trail.name}
                            <Icon name='cancel' style={{ cursor: 'pointer', float: 'right' }} onClick={handleClose} />
                        </Card.Header>
                    </Card.Content>
                    <Card.Description >
                        {props.trail.summary || 'No summary available'}
                    </Card.Description>
                    <Card.Content>
                        <Card.Meta>
                            Condition: {props.trail.conditionStatus || 'No condition available'}
                        </Card.Meta>
                        <Card.Meta>
                            As of: {props.trail.conditionDate || 'No condition date available'}
                        </Card.Meta>
                    </Card.Content>
                </Card>
            </div>
            :
            null
        }
    </div> 
}

export default MapMarker;