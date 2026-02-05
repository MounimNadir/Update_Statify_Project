import React,{useEffect,useState} from 'react';
import './Main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import email from '../../Assests/email.png';
import linkedin from '../../Assests/linkedin.png';
import aboutimage from '../../Assests/images (3).jpeg';
import twitter from '../../Assests/x.png';
import videobg from '../../Assests/videobg.mp4';
import teamMember1 from '../../Assests/images (3).jpeg'; // Replace with your actual image path
import teamMember2 from '../../Assests/images (3).jpeg'; // Replace with your actual image path
import teamMember3 from '../../Assests/images (3).jpeg'; // Replace with your actual image path
import teamMember4 from '../../Assests/images (3).jpeg'; // Replace with your actual image path
import { useAuth } from '../../auth';
import Recipe from '../Recipe';
import { Modal, Button, Form } from 'react-bootstrap';



const LoggedInHome = () => {
    const [recipes, setRecipes] = useState([]);
    const [show, setShow] = useState(false);
    const [currentRecipe, setCurrentRecipe] = useState({
        id: '',
        title: '',
        description: '',
        salary: 0
    });

    // 1. Fetch Recipes (GET)
    const getAllRecipes = () => {
        fetch('/recipe/recipes')
            .then(res => res.json())
            .then(data => {
                setRecipes(data);
            })
            .catch(err => console.log(err));
    };

    useEffect(() => {
        getAllRecipes();
    }, []);

    // 2. Open Modal with Data
    const handleShow = (recipe) => {
        setCurrentRecipe({
            id: recipe.id,
            title: recipe.title,
            description: recipe.description,
            salary: recipe.salary // Now capturing Salary!
        });
        setShow(true);
    };

    const handleClose = () => setShow(false);

    // 3. Handle Form Changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentRecipe({ ...currentRecipe, [name]: value });
    };

    // 4. Submit Update (PUT)
    const updateRecipe = () => {
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');

        const requestOptions = {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            },
            body: JSON.stringify({
                title: currentRecipe.title,
                description: currentRecipe.description,
                salary: currentRecipe.salary
            })
        };

        fetch(`/recipe/recipe/${currentRecipe.id}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log("Updated:", data);
                handleClose();
                getAllRecipes(); // Refresh the list
            })
            .catch(err => console.log(err));
    };

    return (
        <>
            <div className="recipe container">
                <h1 className="my-4">List of Your Forms</h1>
                <div className="row">
                    {recipes.map((recipe) => (
                        <div className="col-md-4" key={recipe.id}>
                            <Recipe
                                title={recipe.title}
                                description={recipe.description}
                                onClick={() => handleShow(recipe)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* EDIT MODAL */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Recipe: {currentRecipe.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={currentRecipe.title}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={currentRecipe.description}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Salary (Test 2026 Feature)</Form.Label>
                            <Form.Control
                                type="number"
                                name="salary"
                                value={currentRecipe.salary}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={updateRecipe}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};


const LoggedOutHome =()=>{
  return(
    <>
              {/* HERO SECTION */}
          <section className="hero-section">
          <video src={videobg} autoPlay loop muted className="video-bg" />
          <div className="hero">
            <Link to="/login">
              <button className="btn-hero">Get Started</button>
            </Link>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="about-section" id="about">
          <div className="about">
            <h1 className="heading text-uppercase">About Us</h1>
            <span className="text-black-50">Statify is a Morocco statistics online</span>
            <div className="about-content">
              <div className="about-image">
                <img src={aboutimage} alt="about-image" />
              </div>
              <div className="about-info">
                <p>Statify is a groundbreaking platform designed to transform the way Morocco conducts its national census. Our mission is to streamline the data collection process by empowering citizens to participate directly. We believe that by modernizing this vital task, we can improve the accuracy, efficiency, and cost-effectiveness of large-scale statistical reporting. At Statify, we’re committed to innovation that benefits both the government and the people. Our platform enables individuals to easily input their own information, eliminating the need for traditional data collectors and saving valuable time and resources. Join us in building a smarter, more connected Morocco, where every voice matters, and every data point contributes to a brighter future.</p>
              </div>
            </div>
          </div>
        </section>

        {/* TEAM MEMBERS SECTION */}
        <section className="team-section" id="team">
          <h1 className="title text-uppercase">Our Team</h1>
          
          <Carousel interval={1000000} pause={false} controls={true}>
            <Carousel.Item>
              <img
                className="d-block"
                src={teamMember1}
                alt="First team member"
              />
              <Carousel.Caption>
                <h3>Mounim Nadir</h3>
                <p>Position and brief description of team member.</p>
                
                
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block"
                src={teamMember2}
                alt="Second team member"
              />
              <Carousel.Caption>
                <h3>Abdelaaziz Khouda</h3>
                <p>Position and brief description of team member.</p>
                
            </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block"
                src={teamMember3}
                alt="Third team member"
              />
              <Carousel.Caption>
                <h3>Mohamed El Bouhmi</h3>
                <p>Position and brief description of team member.</p>
                
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block"
                src={teamMember4}
                alt="Fourth team member"
              />
              <Carousel.Caption>
                <h3>Hamid Bouayadi</h3>
                <p>Position and brief description of team member.</p>
              
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </section>


        {/* CONTACT SECTION  1*/}

        <h1 className="title text-uppercase">Team socials</h1>
        <section className="contact-section" id="contact">
          <div className="contact">
            <h1 className="title-sub text-uppercase">Mounim's socials</h1>
            <p className="text-black-50">Get in Touch</p>
            <div className="contact-info-upper-container">
              <div className="contact-info-container">
                <img
                  src={email}
                  alt="Email icon"
                  className="icon contact-icon email-icon"
                />
                <p><a href="mailto:mounimnadir7@gmail.com">Gmail</a></p>
              </div>
              <div className="contact-info-container">
                <img
                  src={linkedin}
                  alt="LinkedIn icon"
                  className="icon contact-icon"
                />
                <p><a href="https://www.linkedin.com/in/mounim-nadir-b6575b27a">LinkedIn</a></p>
              </div>
              <div className="contact-info-container">
                <img
                  src={twitter}
                  alt="Twitter icon"
                  className="icon contact-icon"
                />
                <p><a href="https://x.com/MounimNadir">X-Twitter</a></p>
              </div>
            </div>
          </div>
        </section>
    {/* CONTACT SECTION  2*/}
        <section className="contact-section" id="contact">
          <div className="contact">
            <h1 className="title text-uppercase">Abdelaziz's socials</h1>
            <p className="text-black-50">Get in Touch</p>
            <div className="contact-info-upper-container">
              <div className="contact-info-container">
                <img
                  src={email}
                  alt="Email icon"
                  className="icon contact-icon email-icon"
                />
                <p><a href="mailto:Bouayadihamid@gmail.com">Gmail</a></p>
              </div>
              <div className="contact-info-container">
                <img
                  src={linkedin}
                  alt="LinkedIn icon"
                  className="icon contact-icon"
                />
                <p><a href="https://www.linkedin.com/in/mounim-nadir-b6575b27a">LinkedIn</a></p>
              </div>
              <div className="contact-info-container">
                <img
                  src={twitter}
                  alt="Twitter icon"
                  className="icon contact-icon"
                />
                <p><a href="https://twitter.com/AbdelKhouda">X-Twitter</a></p>
              </div>
            </div>
          </div>
        </section>
        {/* CONTACT SECTION  3*/}
        <section className="contact-section" id="contact">
          <div className="contact">
            <h1 className="title text-uppercase">Mohammed's socials</h1>
            <p className="text-black-50">Get in Touch</p>
            <div className="contact-info-upper-container">
              <div className="contact-info-container">
                <img
                  src={email}
                  alt="Email icon"
                  className="icon contact-icon email-icon"
                />
                <p><a href="mailto:Bouayadihamid@gmail.com">Gmail</a></p>
              </div>
              <div className="contact-info-container">
                <img
                  src={linkedin}
                  alt="LinkedIn icon"
                  className="icon contact-icon"
                />
                <p><a href="https://www.linkedin.com/in/mounim-nadir-b6575b27a">LinkedIn</a></p>
              </div>
              <div className="contact-info-container">
                <img
                  src={twitter}
                  alt="Twitter icon"
                  className="icon contact-icon"
                />
                <p><a href="https://twitter.com/AbdelKhouda">X-Twitter</a></p>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION  4*/}
        <section className="contact-section" id="contact">
          <div className="contact">
            <h1 className="title text-uppercase"> Hamid's socials</h1>
            <p className="text-black-50">Get in Touch</p>
            <div className="contact-info-upper-container">
              <div className="contact-info-container">
                <img
                  src={email}
                  alt="Email icon"
                  className="icon contact-icon email-icon"
                />
                <p><a href="mailto:Bouayadihamid@gmail.com">Gmail</a></p>
              </div>
              <div className="contact-info-container">
                <img
                  src={linkedin}
                  alt="LinkedIn icon"
                  className="icon contact-icon"
                />
                <p><a href="https://www.linkedin.com/in/mounim-nadir-b6575b27a">LinkedIn</a></p>
              </div>
              <div className="contact-info-container">
                <img
                  src={twitter}
                  alt="Twitter icon"
                  className="icon contact-icon"
                />
                <p><a href="https://twitter.com/AbdelKhouda">X-Twitter</a></p>
              </div>
            </div>
          </div>
        </section>
        
  </>
  )
}

function Main() {
  const [logged]=useAuth()
  return (
      <div>
      {logged?<LoggedInHome/>:<LoggedOutHome/>}
      </div>
  );
}

export default Main;
