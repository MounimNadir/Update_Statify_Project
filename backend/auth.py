from flask_restx import Resource, Namespace, fields
from models import User
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, get_jwt_identity)
from werkzeug.security import generate_password_hash, check_password_hash
from flask import request

auth_ns = Namespace('auth', description="A namespace for our Authentication")

signup_model = auth_ns.model(
    'SignUp',
    {
        "username": fields.String(),
        "email": fields.String(),
        "password": fields.String()
    }
)

login_model = auth_ns.model(
    'Login',
    {
        "username": fields.String(),
        "password": fields.String()
    }
)

@auth_ns.route('/signup')
class SignUp(Resource):
    @auth_ns.expect(signup_model)
    def post(self):
        data = request.get_json()
        
        username = data.get('username')
        db_user = User.query.filter_by(username=username).first()
        
        if db_user is not None:
            return {"message": f"User with username {username} already exists."}, 400
        
        new_user = User(
            username=data.get('username'),
            email=data.get('email'),
            password=generate_password_hash(data.get('password'))
        )
        
        new_user.save()
        
        return {"message": "User created successfully"}, 201


@auth_ns.route('/login')
class Login(Resource):
    @auth_ns.expect(login_model)
    def post(self):
        data = request.get_json()
        
        username = data.get('username')
        password = data.get('password')
        
        db_user = User.query.filter_by(username=username).first()
        
        if db_user and check_password_hash(db_user.password, password):
            access_token = create_access_token(identity=db_user.username)
            refresh_token = create_refresh_token(identity=db_user.username)
            
            return {
                "message": "Login Success",
                "access_token": access_token,
                "refresh_token": refresh_token
            }, 200
        
        return {"message": "Invalid credentials"}, 401


@auth_ns.route('/refresh')
class RefreshResource(Resource):
    @jwt_required(refresh=True)
    def post(self):
        current_user = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user)
        return {"access_token": new_access_token}, 200