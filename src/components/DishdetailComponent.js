import React, { Component } from 'react';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, Breadcrumb, BreadcrumbItem
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, Label, Row, Col } from 'reactstrap';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';





const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);


class CommentForm extends Component {

    constructor(props) {
        super(props);

        this.toggleCommentModal = this.toggleCommentModal.bind(this);
        this.state = {
            isModalOpen: false
        }
    }

    toggleCommentModal = () => {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    handleCommentSubmit = (values) => {
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
    }


    render() {
        return (
            <>
                <Button outline onClick={this.toggleCommentModal}> <span className="fa fa-pencil     fa-lg"></span> Submit Comment</Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleCommentModal}>
                    <ModalHeader toggle={this.toggleCommentModal}>
                        Submit Comment
                    </ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleCommentSubmit(values)}>
                            <Row className="form-group">
                                <Label htmlFor="Rating" md={2}>Rating</Label>
                                <Col md={12}>
                                    <Control.select model=".rating" name="rating" className="form-control">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="author" md={4}>Your Name</Label>
                                <Col md={12}>
                                    <Control.text model=".author" id="author" name="author" placeholder="Your Name"
                                        className="form-control"
                                        validators={{
                                            required, minLength: minLength(3), maxLength: maxLength(15)
                                        }} />
                                    <Errors className="text-danger" model=".author" show="touched"
                                        messages={{
                                            required: ' Required',
                                            minLength: '   Must be greater than 2 charactres',
                                            maxLength: '   Must be less than 15 characters'
                                        }} />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="comment" md={2}>Comment</Label>
                                <Col md={12}>
                                    <Control.textarea model=".comment" id="comment" name="comment" rows="6"
                                        className="form-control" />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col md={12} >
                                    <Button type="submit" color="primary">Submit</Button>
                                </Col>
                            </Row>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </>
        );
    }
}

function RenderDish(props) {

    if (props.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    else if (props.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <h4>{props.errMess}</h4>
                </div>
            </div>
        );
    }

    else if (props.dish !== undefined) {
        return (
            <div className="col-12 col-md m-1">
                <FadeTransform in transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }}>
                    <Card>
                        <CardImg top src={baseUrl + props.dish.image} alt={props.dish.name} />
                        <CardBody>
                            <CardTitle>{props.dish.name}</CardTitle>
                            <CardText>{props.dish.description}</CardText>
                        </CardBody>
                    </Card>
                </FadeTransform>
            </div>

        );
    }
    else {
        return (
            <div></div>
        );
    }
}



function RenderComments({ comments, postComment, dishId }) {
    if (comments !== undefined && comments.length !== 0) {

        const Rescomments = comments.map((commentElement) => {

            const DATE = new Date(commentElement.date);
            var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            return (

                <Fade in>
                    <li key={commentElement.id}>
                        <p>{commentElement.comment}</p>
                        {/* <p>{new Intl.DateTimeFormat('en-US', { year = "numeric", month = "short", day="2-digit" }).format(new Date(Date.parse( commentElement.date )))}</p> */}
                        <p>{"-- " + commentElement.author + " , " + month[DATE.getMonth()] + " " + DATE.getDay() + "," + DATE.getFullYear()}</p>
                    </li>
                </Fade>

            );
        });


        return (
            <div className="col-12 col-md m-1">
                <h4>Comments</h4>
                <ul className="list-unstyled">
                    <Stagger in>
                        {Rescomments}
                    </Stagger>
                </ul>
            </div>

        );
    }
    else {
        return (
            <div></div>
        );
    }
}

const Dishdetail = (props) => {


    return (
        <div className="container">
            <div className="row">
                <Breadcrumb>

                    <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                    <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                </Breadcrumb>
                <div className="col-12">
                    <h3>{props.dish.name}</h3>
                    <hr />
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-md m-1">
                    <RenderDish dish={props.dish} />
                </div>
                <div className="col-12 col-md m-1">
                    <RenderComments comments={props.comments} postComment={props.postComment} dishId={props.dish.id} />
                    <CommentForm postComment={props.postComment} dishId={props.dish.id} />
                </div>
            </div>
        </div>
    )

}


export default Dishdetail;