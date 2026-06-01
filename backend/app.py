from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

@app.route("/")
def home():
    return "Smart Task Reminder Backend is running"

@app.route("/tasks", methods=["GET"])
def get_tasks():
    response = supabase.table("tasks").select("*").order("id", desc=True).execute()
    return jsonify(response.data)

@app.route("/tasks", methods=["POST"])
def add_task():
    data = request.json

    new_task = {
        "task_name": data["task_name"],
        "due_date": data["due_date"],
        "status": data["status"]
    }

    response = supabase.table("tasks").insert(new_task).execute()
    return jsonify(response.data)

@app.route("/tasks/<int:task_id>", methods=["PATCH"])
def update_task(task_id):
    data = request.json

    response = supabase.table("tasks").update({
        "status": data["status"]
    }).eq("id", task_id).execute()

    return jsonify(response.data)

@app.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    response = supabase.table("tasks").delete().eq("id", task_id).execute()
    return jsonify(response.data)

if __name__ == "__main__":
    app.run(debug=True)