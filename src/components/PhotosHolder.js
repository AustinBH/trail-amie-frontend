import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Image, Comment, Header, Button } from 'semantic-ui-react';
import { fetchAuthentication } from '../actions/userActions';
import { api } from '../services/api';
import BasicLoader from '../components/BasicLoader';
import AddPhotoModal from './photoModals/AddPhotoModal';
import DeletePhotoModal from './photoModals/DeletePhotoModal';

class PhotosHolder extends Component {

    state = {
        isLoading: false,
        photos: [],
        open: false,
        deleteOpen: false,
        deletingId: '',
        photoUrl: '',
        newLoading: false
    }

    componentDidMount() {
        this.props.fetchAuthentication()
        this.fetchTrailPhotos()
    }

    fetchTrailPhotos = () => {
        this.setState({isLoading: true})
        api.photos.getPhotosByTrail(this.props.trail.id).then(json => this.setState({ photos: json, isLoading: false }))
    }

    toggleOpen = () => {
        this.setState({open: !this.state.open})
    }

    toggleDelete = id => {
        this.setState({ 
            deleteOpen: !this.state.deleteOpen,
            deletingId: id
        })
    }

    handleChange = ev => {
        this.setState({photoFileName: ev.target.files[0].name})
        const reader = new FileReader()
        reader.readAsDataURL(ev.target.files[0])
        reader.onload = () => {
            this.setState({
                photoFile: reader.result
            })
        }
    }

    handleSubmit = ev => {
        ev.preventDefault()
        this.setState({newLoading: true})
        let image = { user_id: this.props.user.id, trail_id: this.props.trail.id, photo_file: this.state.photoFile, photo_file_name: this.state.photoFileName }
        api.photos.addPhoto({image: image}).then(json => {
            if (!json.error) {
                this.toggleOpen()
                this.setState({ photos: [...this.state.photos, json.image], newLoading: false })
            }
        })
    }

    deletePhoto = id => {
        api.photos.deletePhoto({ image: {id: id} }).then(this.setState({ photos: this.state.photos.filter(element => element.id !== id) }))
        this.toggleDelete({ id: '' })
    }

    render() {
        return <>
            <Comment.Group>
                <Header as='h3' dividing content='Photos' />
            {this.state.isLoading ?
                <BasicLoader info='photos' />
            :
                this.state.photos.length > 0 ?
                            this.state.photos.map((photo, idx) => {
                                return <Comment key={idx}>
                                    <Comment.Avatar src={photo.avatar} />
                                    <Comment.Author as='a' content={photo.username} />
                                    <Image src={photo.img_url} size='small' />
                                    {photo.username === this.props.user.username ? 
                                        <Button className='delete-photo' size='mini' icon='trash alternate' negative onClick={() => this.toggleDelete(photo.id)} content='Delete' />
                                    :
                                        null
                                    }
                                </Comment>
                            })
                :
                    <p>No photos yet, post the first one!</p>
            }
            </Comment.Group>
            <DeletePhotoModal open={this.state.deleteOpen} toggle={this.toggleDelete} deletePhoto={this.deletePhoto} id={this.state.deletingId}/>
            <AddPhotoModal open={this.state.open} toggle={this.toggleOpen} handleOnChange={this.handleChange} handleOnSubmit={this.handleSubmit} loading={this.state.newLoading}/>
        </>
    }
}

const mapStateToProps = state => {
    return { user: state.user.user }
}

const mapDispatchToProps = dispatch => ({
    fetchAuthentication: () => dispatch(fetchAuthentication())
})

export default connect(mapStateToProps, mapDispatchToProps)(PhotosHolder);