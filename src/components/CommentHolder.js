import React, { Component } from 'react'
import { Button, Modal, Form, Icon, TextArea, Label, Placeholder, Comment, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { api } from '../services/api';
import { fetchAuthentication } from '../actions/userActions'


class CommentHolder extends Component {

    state = {
        open: false,
        comments: [],
        content: '',
        isLoading: 'false'
    }

    componentDidMount() {
        this.fetchTrailComments()
        this.props.fetchAuthentication()
    }

    fetchTrailComments = () => {
        this.setState({ isLoading: true })
        api.comments.getCommentsByTrail(this.props.trail.id).then(json => this.setState({ comments: json, isLoading: false }))
    }

    handleChange = ev => {
        this.setState({
            [ev.target.name]: ev.target.value
        })
    }

    open = () => this.setState({open: true})
    close = () => this.setState({open: false})

    handleSubmit = ev => {
        ev.preventDefault()
        let comment = {content: this.state.content, user_id: this.props.user.id, trail_id: this.props.trail.id}
        api.comments.addComment({comment: comment}).then(json => {
            if (!json.error) {
                this.setState({ comments: [...this.state.comments, json], content: '' })
            }
        })
        this.close()
    }

    render() {
        return <>
            <Comment.Group>
                <Header as='h3' dividing >Comments</Header>
                {this.state.isLoading ?
                        <Placeholder>
                            <Placeholder.Header>
                                <Placeholder.Line />
                                <Placeholder.Line />
                            </Placeholder.Header>
                            <Placeholder.Paragraph>
                                <Placeholder.Line />
                                <Placeholder.Line />
                                <Placeholder.Line />
                                <Placeholder.Line />
                            </Placeholder.Paragraph>
                        </Placeholder>
                :
                    this.state.comments.length > 0 ? this.state.comments.map((comment, idx) => {
                            return <Comment key={idx}>
                                <Comment.Author as='a'>{comment.username}</Comment.Author>
                                <Comment.Text>{comment.content}</Comment.Text>
                            </Comment>
                    })
                    :
                    <Comment>
                        <Comment.Text>No comments yet, leave the first one!</Comment.Text>
                    </Comment>
                }
                
            </Comment.Group>
            <Modal onOpen={this.open} onClose={this.close} open={this.state.open} trigger={<Button content='New Comment'/>} closeIcon>
                <Modal.Header>New Comment</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Form onSubmit={this.handleSubmit} className='standard-form' name='login'>
                            <Form.Field>
                                <Label color='brown' as='a'>
                                    <Icon name='content' />
                                    Content
                                </Label>
                                <TextArea value={this.state.content} onChange={this.handleChange} name='content' required />
                            </Form.Field>
                            <Button color='blue' type='submit' content='Add Comment' />
                        </Form>
                    </Modal.Description>
                </Modal.Content>
            </Modal>

        </>
    }
}

const mapStateToProps = state => {
    return {user: state.user}
}

const mapDispatchToProps = dispatch => ({
    fetchAuthentication: () => dispatch(fetchAuthentication())
})

export default connect(mapStateToProps, mapDispatchToProps)(CommentHolder);