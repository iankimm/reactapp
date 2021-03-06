import React, { Component } from 'react';
import {Card, CardImg, CardBody, CardText, Breadcrumb, BreadcrumbItem} from 'reactstrap'
import { Link } from 'react-router-dom';
import { Button, 
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Col,
  Row,
} from 'reactstrap';

import { Control, LocalForm, Errors } from "react-redux-form";
import { Loading } from './LoadingComponent';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !val || val.length <= len;
const minLength = (len) => (val) => val && val.length >= len;

class CommentForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  }

  handleSubmit(values) {
    this.toggleModal();
    this.props.addComment(this.props.campsiteId, values.rating, values.author, values.text);
  }

  render() {
    return(
      <div>
        <Button outline onClick={this.toggleModal}>
          <i className="fa fa-pencil fa-lg" /> Submit Comment
        </Button>

        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
          <ModalBody>
            <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
              <Row className = "form-group">
                <Label htmlFor = "rating" md={2}>
                  Rating
                </Label>
                <Col md={10}>
                  <Control.select
                    model=".rating"
                    name="rating"
                    className="form-control"
                  >
                    <option value = "1">1</option>
                    <option value = "2">2</option>
                    <option value = "3">3</option>
                    <option value = "4">4</option>
                    <option value = "5">5</option>
                  </Control.select>
                </Col>
              </Row>
              <Row className="form-group">
                <Label htmlFor="author" md={2}>
                  Your Name
                </Label>
                <Col md={10}>
                  <Control.text
                    model=".author"
                    id="author"
                    name="author"
                    placeholder="Your name"
                    className="form-control"
                    validators={{
                      required,
                      minLength: minLength(2),
                      maxLength: maxLength(15),
                    }}
                  />
                  <Errors
                    className="text-danger"
                    model=".author"
                    show="touched"
                    component="div"
                    messages={{
                      required: "Required",
                      minLength: "Must be at least 2 characters",
                      maxLength: "Must be 15 characters or less",
                    }}
                    />
                </Col>
              </Row>
              <Row className="form-group">
                <Label htmlFor="text" md={2}>
                  Comment
                </Label>
                <Col md={10}>
                  <Control.textarea
                    model=".text"
                    id="text"
                    name="text"
                    rows="6"
                    className="form-control"
                    validators={{
                      required,
                    }}
                  />
                  <Errors
                    className="text-danger"
                    model=".comment"
                    show="touched"
                    component="div"
                    messages={{
                      required: "Required",
                    }}
                  />
                </Col>
              </Row>
              <Row className="form-group">
                <Col md={{ size: 10, offset: 2 }}>
                  <Button type="submit" color="primary">
                    Submit
                  </Button>
                </Col>
              </Row>
            </LocalForm>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

function RenderCampsite({campsite}) {
  return (
    <div className = "col-md-5 m-1">
      <Card>
        <CardImg top src={campsite.image} alt={campsite.name} />
        <CardBody>
            <CardText>{campsite.description}</CardText>
        </CardBody>
      </Card>
    </div>
  )
}

function RenderComments({comments, addComment, campsiteId}) {
  if(comments) {
    return (
      <div className = "col-md-5 m-1">
        <h4>Comments</h4>
        {comments.map(comment => {
          return (
            <div>
              <p>{comment.text}</p>
              <p>-- {comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}
              </p>
            </div>
          )
        }
        )}
        <CommentForm campsiteId={campsiteId} addComment={addComment} />
      </div>
    )
  }
  return <div />;
}

function CampsiteInfo(props){
  if(props.isLoading) {
    return(
      <div className = "container">
        <div className = "row">
          <Loading />
        </div>
      </div>
    )
  }

  if(props.errMess) {
    return(
      <div className = "container">
        <div className = "row">
          <div className = "col">
            <h4>{props.errMess}</h4>
          </div>
        </div>
      </div>
    )
  }

  if(props.campsite) {
    return (
      <div className = "container">
        <div className = "row">
          <div className = "col">
            <Breadcrumb>
              <BreadcrumbItem><Link to = '/directory'> Directory </Link></BreadcrumbItem>
              <BreadcrumbItem active> {props.campsite.name} </BreadcrumbItem>
            </Breadcrumb>
            <h2>{props.campsite.name}</h2>
          </div>
        </div>
        <div className = "row">
          <RenderCampsite campsite = {props.campsite} />
          <RenderComments 
            comments={props.comments}
            addComment={props.addComment}
            campsiteId={props.campsite.id}
          />
        </div>
      </div>
    )
  }
  return (<div></div>)
}

export default CampsiteInfo;