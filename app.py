from flask import Flask, request, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy

# App configuration
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///comments.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Database model definition
class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(500), nullable=False)
    ip = db.Column(db.String(45), nullable=False) # Store IP address
    leaked_ip = db.Column(db.String(45), nullable=False) # Store WebRTC leaked IP

# Create the database and the comment table
with app.app_context():
    db.create_all()

@app.route('/', methods=['GET', 'POST'])
def comment():
    if request.method == 'POST':
        # Handle JSON input
        data = request.get_json()
        new_comment = data['comment']
        leaked_ip = data['leaked_ip'] # Get the WebRTC leaked IP
        ip = request.remote_addr # Get the IP normally
        comment = Comment(content=new_comment, ip=ip, leaked_ip=leaked_ip)
        
        db.session.add(comment)
        db.session.commit()
        
        return jsonify(success=True) # Return a JSON response indicating success

    comments = Comment.query.all() # Retrieve all comments from the database
    return render_template('index.html', comments=comments)

# Login page
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        return f"<h1>Logged in as {username}</h1><p>Password: {password}</p>"
    return render_template('login.html')

if __name__ == '__main__':
    app.run(host='192.168.0.2', port=8000)
