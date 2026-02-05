from flask_restx import Namespace, Resource, fields
from models import Recipe
from flask_jwt_extended import jwt_required
from flask import request

recipe_ns = Namespace('recipe', description="A namespace for Recipes.")

# Model for Validation/Documentation
recipe_model = recipe_ns.model(
    "Recipe",
    {
        "id": fields.Integer(),
        "title": fields.String(),
        "description": fields.String(),
        "full_name": fields.String(),
        "cin": fields.String(),
        "phone_number": fields.String(),
        "email": fields.String(),
        "age": fields.Integer(),
        "gender": fields.String(),
        "state": fields.String(),
        "city": fields.String(),
        "address": fields.String(),
        "marital_status": fields.String(),
        "nbr_of_children": fields.Integer(),
        "occupation": fields.String(),
        "salary": fields.Float()
    }
)

@recipe_ns.route('/hello')
class HelloResource(Resource):
    def get(self):
        return {"message": "Hello world"}

@recipe_ns.route('/recipes')
class RecipesResource(Resource):
    
    @recipe_ns.marshal_list_with(recipe_model)
    def get(self):
        """"Get all recipes"""
        recipes = Recipe.query.all()
        return recipes
    
    @recipe_ns.marshal_with(recipe_model)
    @recipe_ns.expect(recipe_model)
    @jwt_required()
    def post(self):
        """"Create a new recipe"""
        data = request.get_json()
        
        # --- DEBUG PRINT ---
        print("\n--- INCOMING DATA FROM FRONTEND ---")
        print(data)
        print("-----------------------------------\n")
        # -------------------

        new_recipe = Recipe(
            title=data.get('title'),
            description=data.get('description'),
            
            # Matching the frontend keys strictly
            full_name=data.get('full_name'),
            
            # Handling both 'cin' (backend) and 'CNI' (frontend)
            cin=data.get('cin') or data.get('CNI'),
            
            phone_number=data.get('phone_number'),
            email=data.get('email'),
            age=data.get('age'),
            gender=data.get('gender'),
            state=data.get('state'),
            city=data.get('city'),
            address=data.get('address'),
            marital_status=data.get('marital_status'),
            nbr_of_children=data.get('nbr_of_children') or data.get('number_of_children', 0),
            occupation=data.get('occupation'),
            salary=data.get('salary')
        )
        
        new_recipe.save()
        
        return new_recipe, 201

@recipe_ns.route('/recipe/<int:id>')
class RecipeResource(Resource):
    @recipe_ns.marshal_with(recipe_model)
    def get(self, id):
        """"Get a recipe by id"""
        recipe = Recipe.query.get_or_404(id)
        return recipe
    
    @recipe_ns.marshal_with(recipe_model)
    @jwt_required()
    def put(self, id):
        """Update a recipe by id"""
        recipe_to_update = Recipe.query.get_or_404(id)
        data = request.get_json()
        
        # We pass ALL the data to the smart update method in models.py
        recipe_to_update.update(
            title=data.get('title'),
            description=data.get('description'),
            full_name=data.get('full_name'),
            cin=data.get('cin') or data.get('CNI'), 
            phone_number=data.get('phone_number'),
            email=data.get('email'),
            age=data.get('age'),
            gender=data.get('gender'),
            state=data.get('state'),
            city=data.get('city'),
            address=data.get('address'),
            marital_status=data.get('marital_status'),
            nbr_of_children=data.get('nbr_of_children') or data.get('number_of_children'),
            occupation=data.get('occupation'),
            salary=data.get('salary')
        )
        
        return recipe_to_update

    @recipe_ns.marshal_with(recipe_model)
    @jwt_required()
    def delete(self, id):
        """"Delete a recipe by id"""
        recipe_to_delete = Recipe.query.get_or_404(id)
        recipe_to_delete.delete()
        return recipe_to_delete