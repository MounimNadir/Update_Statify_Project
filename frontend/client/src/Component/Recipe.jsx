import React from 'react';
import { Card, Button } from 'react-bootstrap';

const Recipe = ({ title, description, onClick }) => {
    return (
        <Card className="recipe" style={{ marginBottom: '20px' }}>
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Text>{description}</Card.Text>
                <Button variant="primary" onClick={onClick}>Edit Recipe</Button>
            </Card.Body>
        </Card>
    )
}

export default Recipe;